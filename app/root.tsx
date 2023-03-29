import type { LinksFunction, MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import Rubik400 from '@fontsource/rubik/400.css'
import Rubik500 from '@fontsource/rubik/500.css'
import Rubik700 from '@fontsource/rubik/700.css'

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: Rubik400 },
    { rel: 'stylesheet', href: Rubik500 },
    { rel: 'stylesheet', href: Rubik700 },
  ]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
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
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
