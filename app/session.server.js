import { createCookieSessionStorage, redirect, createCookie } from "@remix-run/node";

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
        cookie: createCookie("__session", {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7 * 4, 
            secrets: [process.env.SESSION_SECRET],
        }),
    });

export { getSession, commitSession, destroySession };

export async function requireUserSession(request) {
    const session = await getSession(request.headers.get("Cookie"));
    if (!session.get("userId")) {
        return redirect("/");
    }

    return session;
}