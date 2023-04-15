
import { json } from "@remix-run/node";
import {
  Form,
  Links,
  NavLink,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "@remix-run/react";

import styles from "./styles/app.css"

import { getSession } from "~/session.server";

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return json({
    isAuthenticated: session.has("userId"),
  })
}

export default function App() {
  const {isAuthenticated} = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <header id="main-header">
      
<nav className="bg-white border-gray-200 dark:bg-gray-900">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <NavLink to="/" className="flex items-center">
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">NotTwitter</span>
    </NavLink>
    {!isAuthenticated ? (
      
    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        <li>
          <NavLink to="/login">
            <a  className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500">Login</a>
          </NavLink>
        </li>
        <li>
          <NavLink to="/signup" >
            <a className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500">Sign up</a>
          </NavLink>
        </li>
      </ul>
    </div>
     ) : (            
    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        <li>
          <NavLink to="/addpost" >
            <a className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500">Add Post</a>
          </NavLink>
        </li>
        <li>
          <Form method='post' action='/logout'>
            <button className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" type="submit">Logout</button>
          </Form>
      </li>
    </ul>
  </div>
  )}

  </div>
</nav>

    </header>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caughtResponse = useCatch();

  return (
    <div>
      <h1>Caught</h1>
      <p> There is an Error!</p>
      <p>Status: {caughtResponse.status}</p>
      <p>{caughtResponse.data?.message || 'Something went wrong!'}</p>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <div>
      <h1>Error</h1>
      <p>Something went wrong</p>
      <p>{error.message}</p>
    </div>
  );
}