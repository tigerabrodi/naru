import type { LinksFunction, MetaFunction } from '@remix-run/node'

import Rubik400 from '@fontsource/rubik/400.css'
import Rubik500 from '@fontsource/rubik/500.css'
import Rubik700 from '@fontsource/rubik/700.css'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { Analytics } from '@vercel/analytics/react'

import { Naruto } from './icons'
import rootCSS from './root.css'

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: Rubik400 },
    { rel: 'stylesheet', href: Rubik500 },
    { rel: 'stylesheet', href: Rubik700 },
    { rel: 'stylesheet', href: rootCSS },
  ]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Naru',
  description: 'Chat with naruto and get real fucking advice.',
  viewport: 'width=device-width,initial-scale=1',
  keywords:
    'remix,naruto,chat,narutouzumaki,hokage,advice,selfimprovement,dreams,success',
  'og:title': 'Naru',
  'og:type': 'website',
  'og:url': 'https://naru.chat/',
  'og:image':
    'https://user-images.githubusercontent.com/49603590/237285360-40d13fc8-3e85-409f-a520-df15c710e5c2.png',
  'og:card': 'summary_large_image',
  'og:creator': '@tabrodi',
  'og:site': 'https://naru.chat/',
  'og:description': 'Chat with naruto and get real fucking advice.',
  'twitter:image':
    'https://user-images.githubusercontent.com/49603590/237285360-40d13fc8-3e85-409f-a520-df15c710e5c2.png',
  'twitter:card': 'summary_large_image',
  'twitter:creator': '@tabrodi',
  'twitter:title': 'Naru',
  'twitter:description': 'Chat with naruto and get real fucking advice.',
})

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <nav className="navigation">
          <h1>Naru</h1>
          <Naruto />
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  )
}
