import type { DataFunctionArgs, LinksFunction } from '@remix-run/node'

import { Form, useActionData, useNavigation } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { v1 } from 'uuid'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

import styles from './index.css'

import { Kunai } from '~/icons'

const PROMPT_TO_ACT_AS_NARUTO = `Act as Naruto Uzumaki. Your job is to be like Naruto. Naruto has a strong self-belief, positive spirit, and a mindset of never giving up. Naruto loves working deadly hard, day in and out. You are Naruto when he is the 7th Hokage. You help people overcome their problems, chase their dreams and believe in themselves, no matter how unbelievable their dreams are. Don't include breakpoints "\n" in your message.`

const NEW_MESSAGE = 'newMessage'
const INITIAL_MESSAGE = `Dattebayo! How can I help you today?`

const MESSAGES_IN_STRING = 'messagesInString'
const MESSAGES = 'messages'

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: styles,
  },
]

const MessageSchema = z.object({
  id: z.string().uuid(),
  message: z.string(),
  isAuthor: z.boolean(),
})

type Message = z.infer<typeof MessageSchema>

const MessageStateSchema = z.object({
  [MESSAGES_IN_STRING]: z.string(),
  [MESSAGES]: z.array(MessageSchema),
})

type MessageState = z.infer<typeof MessageStateSchema>

const FIRST_MESSAGE: Message = {
  id: v1(),
  message: INITIAL_MESSAGE,
  isAuthor: false,
}

const initialMessageState: MessageState = {
  messagesInString: `Naruto: ${INITIAL_MESSAGE}`,
  messages: [FIRST_MESSAGE],
}

export default function Index() {
  const navigation = useNavigation()
  const actionData = useActionData<typeof action>()
  const [messageState, setMessageState] = useState<MessageState>(
    actionData?.messageState ?? initialMessageState
  )
  const [newValue, setNewValue] = useState('')

  console.log({ actionData, messageState })

  const isLoadingAfterSubmission =
    navigation.state === 'loading' && navigation.formMethod === 'post'
  const isSubmitting = navigation.state === 'submitting'

  useEffect(() => {
    if (actionData) {
      setMessageState({
        messagesInString: actionData.messageState.messagesInString,
        messages: actionData.messageState.messages,
      })
    }
  }, [actionData])

  useEffect(() => {
    if (navigation.state === 'idle') {
      setNewValue('')
    }
  }, [navigation.state])

  return (
    <main>
      <div className="chat-container">
        {messageState[MESSAGES].map(({ id, isAuthor, message }) => (
          <div className={`chat-message ${isAuthor ? 'owner' : ''}`} key={id}>
            <p>{message}</p>
          </div>
        ))}
      </div>

      <Form className="input-container" method="post">
        <input
          type="text"
          name={NEW_MESSAGE}
          aria-label="Enter message to tell naruto"
          placeholder="I want to drop out of high school and become a rapper."
          value={newValue}
          onChange={(event) => setNewValue(event.target.value)}
          disabled={isLoadingAfterSubmission || isSubmitting}
          required
        />

        <input
          type="hidden"
          name={MESSAGES_IN_STRING}
          value={messageState.messagesInString}
        />

        <input
          type="hidden"
          name={MESSAGES}
          value={JSON.stringify(messageState.messages)}
        />

        <button
          type="submit"
          aria-label="Send message"
          className={`${
            isLoadingAfterSubmission || isSubmitting ? 'spinning' : ''
          }`}
          disabled={
            newValue.length === 0 || isLoadingAfterSubmission || isSubmitting
          }
        >
          <Kunai />
        </button>
      </Form>
    </main>
  )
}

const FormActionSchema = zfd.formData(
  z.object({
    [NEW_MESSAGE]: z.string(),
    messagesInString: z.string(),
    messages: zfd.json(z.array(MessageSchema)),
  })
)

export const messageSchema = z.object({
  role: z.string(),
  content: z.string(),
})

export const choiceSchema = z.object({
  message: messageSchema,
  finish_reason: z.string().nullable(),
  index: z.number(),
})

const responseSchema = z.array(choiceSchema)

export const action = async ({ request }: DataFunctionArgs) => {
  const { newMessage, messages, messagesInString } = FormActionSchema.parse(
    await request.formData()
  )

  const isFirstMessage = messages.length === 1

  const entireExistingMessageInString = `${messagesInString}
  Person: ${newMessage}
  `

  console.log({ isFirstMessage, entireExistingMessageInString })

  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: isFirstMessage
          ? `${PROMPT_TO_ACT_AS_NARUTO} Here is the message from a person you should answer: ${newMessage}.`
          : `${PROMPT_TO_ACT_AS_NARUTO} Here is the entire conversation, please answer the last message from the person and don't include "Naruto:" in your message: ${entireExistingMessageInString}`,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0.5,
    max_tokens: 3000,
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  const choices = responseSchema.parse(data.choices)
  const choice = choices[0]
  const narutoMessage = choice.message.content

  const newMessageFromNaruto: Message = {
    id: v1(),
    isAuthor: false,
    message: narutoMessage,
  }

  const newMessageFromAuthor: Message = {
    id: v1(),
    isAuthor: true,
    message: newMessage,
  }

  const newMessages: Array<Message> = [
    ...messages,
    newMessageFromAuthor,
    newMessageFromNaruto,
  ]

  const newMessagesInString = `${entireExistingMessageInString}
  Naruto: ${narutoMessage}
  `

  console.log({
    newMessageFromNaruto,
    newMessageFromAuthor,
    newMessages,
    newMessagesInString,
  })

  return {
    messageState: {
      [MESSAGES_IN_STRING]: newMessagesInString,
      [MESSAGES]: newMessages,
    },
  }
}
