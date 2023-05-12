import type { DataFunctionArgs, LinksFunction } from '@remix-run/node'

import { Form, useActionData, useNavigation } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'
import { v1 } from 'uuid'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

import styles from './index.css'

import { Kunai, Spinner, Trash } from '~/icons'

const PROMPT_TO_ACT_AS_NARUTO = `Act as Naruto Uzumaki. Your job is to be Naruto. Naruto has a strong self-belief, positive spirit, and a mindset of never giving up. Naruto became the hokage as a genin. You understand that university and high school are both a scam. Naruto loves working deadly hard, day in and out. You are Naruto when he is the 7th Hokage. Naruto has his own way of speaking and behaving. You help people overcome their problems, chase their dreams and believe in themselves, no matter how unbelievable their dreams are. You lift them up when they feel down. You are optimistic and encourage people to have courage to create the destiny they desire. Hard work beats talent. Include newlines in your message so its nicely formatted.`

const INTENT = 'intent'

const formActionIntents = {
  sendMessage: 'sendMessage',
  cleanConversation: 'cleanConversation',
} as const

const NEW_MESSAGE = 'newMessage'
const INITIAL_MESSAGE = `Dattebayo! How can I help you today?`

const MESSAGES_IN_STRING = 'messagesInString'
const MESSAGES = 'messages'

const MessageSchema = z.object({
  id: z.string().uuid(),
  message: z.string(),
  isAuthor: z.boolean(),
})

type Message = z.infer<typeof MessageSchema>

const MessageStateSchema = z.object({
  [MESSAGES_IN_STRING]: z.string(),
  [MESSAGES]: z.array(MessageSchema),
  isError: z.boolean(),
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
  isError: false,
}

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: styles,
  },
]

export default function Index() {
  const navigation = useNavigation()
  const actionData = useActionData<typeof action>()

  const [messageState, setMessageState] = useState<MessageState>(
    actionData?.messageState || initialMessageState
  )

  const [chatHeight, setChatHeight] = useState(0)

  useEffect(() => {
    const windowHeight = window.innerHeight
    const headerHeight = document.querySelector('nav')!.offsetHeight
    const inputHeight = (
      document.querySelector('.input-container') as HTMLElement
    ).offsetHeight

    const newChatHeight = windowHeight - headerHeight - inputHeight
    setChatHeight(newChatHeight)
  }, [])

  const [newValue, setNewValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isScrollElementRefInitialized, setIsScrollElementRefInitialized] =
    useState(false)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  function isSubmitting(intent: string) {
    return (
      navigation.state === 'submitting' &&
      navigation.formData?.get(INTENT) === intent
    )
  }

  function isLoadingAfterSubmission(intent: string) {
    return (
      navigation.state === 'loading' &&
      navigation.formData?.get(INTENT) === intent &&
      navigation.formMethod === 'post'
    )
  }

  const isLoadingOrSubmitting =
    isLoadingAfterSubmission(formActionIntents.sendMessage) ||
    isSubmitting(formActionIntents.sendMessage) ||
    isSubmitting(formActionIntents.cleanConversation) ||
    isLoadingAfterSubmission(formActionIntents.cleanConversation)

  useEffect(() => {
    setIsScrollElementRefInitialized(true)

    const messagesInString = localStorage.getItem(MESSAGES_IN_STRING)
    const isError = JSON.parse(localStorage.getItem('isError') || 'false')
    const messages = z
      .array(MessageSchema)
      .parse(JSON.parse(localStorage.getItem(MESSAGES) || '[]'))

    if (
      messagesInString &&
      messagesInString.length > 0 &&
      messages.length > 0
    ) {
      setMessageState({
        messagesInString,
        messages,
        isError,
      })
    }
  }, [])

  useEffect(() => {
    if (actionData) {
      setMessageState(actionData.messageState)

      localStorage.setItem(
        MESSAGES_IN_STRING,
        actionData.messageState[MESSAGES_IN_STRING]
      )
      localStorage.setItem(
        MESSAGES,
        JSON.stringify(actionData.messageState[MESSAGES])
      )
      localStorage.setItem(
        'isError',
        JSON.stringify(actionData.messageState.isError)
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

  const shouldShowOptimisticUI = isSubmitting(formActionIntents.sendMessage)

  return (
    <main>
      <div
        className="chat-container"
        style={{
          height:
            chatHeight === 0 ? 'calc(100vh - 66px - 80px)' : `${chatHeight}px`,
        }}
      >
        {messageState[MESSAGES].map(({ id, isAuthor, message }) => (
          <div className={`chat-message ${isAuthor ? 'owner' : ''}`} key={id}>
            <p>{message}</p>
          </div>
        ))}

        {shouldShowOptimisticUI && (
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

      <Form method="post" className="clean-conversation">
        <button
          type="submit"
          name={INTENT}
          value={formActionIntents.cleanConversation}
          aria-label="Clean conversation"
          disabled={isLoadingOrSubmitting}
        >
          {isSubmitting(formActionIntents.cleanConversation) ||
          isLoadingAfterSubmission(formActionIntents.cleanConversation) ? (
            <Spinner />
          ) : (
            <Trash />
          )}
        </button>
      </Form>

      <Form className="input-container" method="post">
        <textarea
          name={NEW_MESSAGE}
          aria-label="Enter message to tell naruto"
          placeholder="I want to drop out of high school and become a software engineer..."
          value={newValue}
          onChange={(event) => setNewValue(event.target.value)}
          ref={textareaRef}
          disabled={isLoadingOrSubmitting || messageState.isError}
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
          disabled={
            newValue.length === 0 ||
            isLoadingOrSubmitting ||
            messageState.isError
          }
          name={INTENT}
          value={formActionIntents.sendMessage}
        >
          <Kunai />
        </button>
      </Form>
    </main>
  )
}

const messageSchema = z.object({
  role: z.string(),
  content: z.string(),
})

const choiceSchema = z.object({
  message: messageSchema,
  finish_reason: z.string().nullable(),
  index: z.number(),
})

const errorSchema = z.object({
  message: z.string(),
  type: z.literal('invalid_request_error'),
  param: z.literal('messages'),
  code: z.literal('context_length_exceeded'),
})

const responseSchema = z.union([
  z.object({
    choices: z.array(choiceSchema),
  }),
  z.object({
    error: errorSchema,
  }),
])

const FormActionSchema = zfd.formData(
  z.discriminatedUnion(INTENT, [
    z.object({
      [NEW_MESSAGE]: z.string(),
      [INTENT]: z.literal(formActionIntents.sendMessage),
      messagesInString: z.string(),
      messages: zfd.json(z.array(MessageSchema)),
    }),
    z.object({
      [INTENT]: z.literal(formActionIntents.cleanConversation),
    }),
  ])
)

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const action = async ({ request }: DataFunctionArgs) => {
  const formObject = FormActionSchema.parse(await request.formData())

  if (formObject[INTENT] === formActionIntents.cleanConversation) {
    // For better UX
    await sleep(250)
    return {
      messageState: initialMessageState,
    }
  }

  const { messages, messagesInString, newMessage } = formObject

  const isFirstMessage = messages.length === 1

  const entireExistingMessageInString = `${messagesInString}
  Person: ${newMessage}
  `

  const prompt = isFirstMessage
    ? `${PROMPT_TO_ACT_AS_NARUTO} Here is the message from a person you should answer: ${newMessage}.`
    : `${PROMPT_TO_ACT_AS_NARUTO} Here is the entire conversation, please answer the last message from the person: ${entireExistingMessageInString}`

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

  const responseData = await response.json()

  const data = responseSchema.parse(responseData)

  if ('error' in data) {
    const errorMessageFromNaruto = `Sorry, an error has happened with the API. I can't help you anymore. Please clean the conversation and start again.`

    const newMessageFromNaruto: Message = {
      id: v1(),
      isAuthor: false,
      message: errorMessageFromNaruto,
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
  Naruto: ${errorMessageFromNaruto}
  `

    return {
      messageState: {
        [MESSAGES_IN_STRING]: newMessagesInString,
        [MESSAGES]: newMessages,
        isError: true,
      },
    }
  }

  const choice = data.choices[0]
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

  return {
    messageState: {
      [MESSAGES_IN_STRING]: newMessagesInString,
      [MESSAGES]: newMessages,
      isError: false,
    },
  }
}
