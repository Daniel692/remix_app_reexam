import { createCookieSessionStorage, createCookie } from "@remix-run/node";

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
        cookie: createCookie("__session", {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7 * 4, 
            secrets: [process.env.SESSION_SECRET],
        }),
    });

export { getSession, commitSession, destroySession };