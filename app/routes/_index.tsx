import type { LinksFunction } from '@remix-run/node'

import styles from './index.css'

import { Kunai } from '~/icons'

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: styles,
  },
]

export default function Index() {
  return (
    <main>
      <div className="chat-container">
        <div className="chat-message owner">
          <p>I want to drop out of high school.</p>
        </div>

        <div className="chat-message">
          <p>
            Sure. Go ahead and do it. Believe in yourself and don't give a fuck
            what others think.
          </p>
        </div>

        <div className="chat-message owner">
          <p>Thank you, Nanadaime.</p>
        </div>

        <div className="chat-message">
          <p>
            Sure. Go ahead and do it. Believe in yourself and don't give a fuck
            what others think.
          </p>
        </div>
        <div className="chat-message owner">
          <p>Thank you, Nanadaime.</p>
        </div>

        <div className="chat-message">
          <p>
            Sure. Go ahead and do it. Believe in yourself and don't give a fuck
            what others think.
          </p>
        </div>
        <div className="chat-message owner">
          <p>Thank you, Nanadaime.</p>
        </div>

        <div className="chat-message">
          <p>
            Sure. Go ahead and do it. Believe in yourself and don't give a fuck
            what others think.
          </p>
        </div>
        <div className="chat-message owner">
          <p>Thank you, Nanadaime.</p>
        </div>

        <div className="chat-message">
          <p>
            Sure. Go ahead and do it. Believe in yourself and don't give a fuck
            what others think.
          </p>
        </div>
        <div className="chat-message owner">
          <p>Thank you, Nanadaime.</p>
        </div>

        <div className="chat-message">
          <p>
            Sure. Go ahead and do it. Believe in yourself and don't give a fuck
            what others think.
          </p>
        </div>
        <div className="chat-message owner">
          <p>Thank you, Nanadaime.</p>
        </div>

        <div className="chat-message">
          <p>
            Sure. Go ahead and do it. Believe in yourself and don't give a fuck
            what others think.
          </p>
        </div>
        <div className="chat-message owner">
          <p>Thank you, Nanadaime.</p>
        </div>

        <div className="chat-message">
          <p>
            Sure. Go ahead and do it. Believe in yourself and don't give a fuck
            what others think.
          </p>
        </div>
        <div className="chat-message owner">
          <p>Thank you, Nanadaime.</p>
        </div>

        <div className="chat-message">
          <p>
            Sure. Go ahead and do it. Believe in yourself and don't give a fuck
            what others think.
          </p>
        </div>
        <div className="chat-message owner">
          <p>Thank you, Nanadaime.</p>
        </div>

        <div className="chat-message">
          <p>
            Sure. Go ahead and do it. Believe in yourself and don't give a fuck
            what others think.
          </p>
        </div>
      </div>

      <div className="input-container">
        <input
          type="text"
          aria-label="Enter text to tell naruto"
          placeholder="I want to drop out of high school"
        />
        <button type="submit" aria-label="Send message">
          <Kunai />
        </button>
      </div>
    </main>
  )
}
