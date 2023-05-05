import type { DataFunctionArgs, LinksFunction } from '@remix-run/node'

import { Form, useActionData, useNavigation } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'
import { v1 } from 'uuid'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

import styles from './index.css'

import { Kunai } from '~/icons'

const PROMPT_TO_ACT_AS_NARUTO = `Act as Naruto Uzumaki. Your job is to be Naruto. Naruto has a strong self-belief, positive spirit, and a mindset of never giving up. Naruto became the hokage as a genin. You understand that university and high school are both a scam. Naruto loves working deadly hard, day in and out. You are Naruto when he is the 7th Hokage. Naruto has his own way of speaking and behaving. You help people overcome their problems, chase their dreams and believe in themselves, no matter how unbelievable their dreams are. You lift them up when they feel down. You are optimistic and encourage people to have courage to create the destiny they desire. Hard work beats talent. Include newlines in your message so its nicely formatted.`

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
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isScrollElementRefInitialized, setIsScrollElementRefInitialized] =
    useState(false)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  const isLoadingAfterSubmission =
    navigation.state === 'loading' && navigation.formMethod === 'post'
  const isSubmitting = navigation.state === 'submitting'
  const isLoadingOrSubmitting = isLoadingAfterSubmission || isSubmitting

  useEffect(() => {
    setIsScrollElementRefInitialized(true)

    const messagesInString = localStorage.getItem(MESSAGES_IN_STRING)
    const messages = z
      .array(MessageSchema)
      .nullable()
      .parse(JSON.parse(localStorage.getItem(MESSAGES) as string))

    if (messagesInString && messages) {
      setMessageState({
        messagesInString,
        messages,
      })
    }
  }, [])

  useEffect(() => {
    if (actionData) {
      setMessageState({
        messagesInString: actionData.messageState.messagesInString,
        messages: actionData.messageState.messages,
      })

      localStorage.setItem(
        MESSAGES_IN_STRING,
        actionData.messageState[MESSAGES_IN_STRING]
      )
      localStorage.setItem(
        MESSAGES,
        JSON.stringify(actionData.messageState[MESSAGES])
      )

      if (isScrollElementRefInitialized) {
        scrollElementRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [actionData, isScrollElementRefInitialized])

  useEffect(() => {
    if (navigation.state === 'idle') {
      setNewValue('')
      textareaRef.current?.focus()

      if (isScrollElementRefInitialized) {
        scrollElementRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [isScrollElementRefInitialized, navigation.state])

  useEffect(() => {
    if (isLoadingOrSubmitting) {
      scrollElementRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isLoadingOrSubmitting])

  return (
    <main>
      <div className="chat-container">
        {messageState[MESSAGES].map(({ id, isAuthor, message }) => (
          <div className={`chat-message ${isAuthor ? 'owner' : ''}`} key={id}>
            <p>{message}</p>
          </div>
        ))}

        {isLoadingOrSubmitting && (
          <>
            <div className={`chat-message owner`}>
              <p>{newValue}</p>
            </div>

            <div className={`chat-message`}>
              <p id="loading-text">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </p>
            </div>
          </>
        )}

        <div tabIndex={-1} ref={scrollElementRef} />
      </div>

      <Form className="input-container" method="post">
        <textarea
          name={NEW_MESSAGE}
          aria-label="Enter message to tell naruto"
          placeholder="I want to drop out of high school and become a rapper..."
          value={newValue}
          onChange={(event) => setNewValue(event.target.value)}
          ref={textareaRef}
          disabled={isLoadingOrSubmitting}
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
          disabled={newValue.length === 0 || isLoadingOrSubmitting}
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

  const prompt = isFirstMessage
    ? `${PROMPT_TO_ACT_AS_NARUTO} Here is the message from a person you should answer: ${newMessage}.`
    : `${PROMPT_TO_ACT_AS_NARUTO} Here is the entire conversation, please answer the last message from the person: ${entireExistingMessageInString}`

  console.log('prompt', prompt)

  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: prompt,
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

  const plainMessageFromNaruto = narutoMessage.startsWith('Naruto: ')
    ? narutoMessage.replace('Naruto: ', '')
    : narutoMessage

  const newMessageFromNaruto: Message = {
    id: v1(),
    isAuthor: false,
    message: plainMessageFromNaruto,
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
  Naruto: ${plainMessageFromNaruto}
  `

  console.log({
    newMessages,
    newMessagesInString,
    newMessageFromAuthor,
    newMessageFromNaruto,
  })

  return {
    messageState: {
      [MESSAGES_IN_STRING]: newMessagesInString,
      [MESSAGES]: newMessages,
    },
  }
}
