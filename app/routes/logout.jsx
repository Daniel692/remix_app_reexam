import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/session.server";

export function loader() {
    return redirect("/login");
}

export async function action({ request }) {
    const session = getSession(request.headers.get("Cookie"));
    return redirect("/login", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}