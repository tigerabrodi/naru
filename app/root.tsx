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
  viewport: 'width=device-width,initial-scale=1',
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
