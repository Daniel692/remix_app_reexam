import { redirect, json } from "@remix-run/node";
import { useLoaderData, useCatch} from "@remix-run/react";

import connectDb from "~/db/dbConnection.server";


export async function loader({ params }) {
    const db = connectDb();
    const user = await db.models.User.findById(params.userId);
    console.log(user);
    const userPosts = await db.models.Post.find({ postedBy: params.userId });
    if (!user) {
        return redirect("/404");
    }
    return json({ user });
}

export function CatchBoundary({ error }) {
    const errorCatch = useCatch()
    return (
        <div className="w-full max-w-xs">
            <h1 className="ml-2 mb-6 text-lg font-bold">The user does not exist</h1>
            <h2 className="ml-2 mb-6 text-lg font-bold">Error: {errorCatch.status}</h2>
        </div>
    )
}

export function ErrorBoundary({ error }) {
    return (
        <div className="w-full max-w-xs">
            <h1 className="ml-2 mb-6 text-lg font-bold">The user does not exist</h1>
            <h2 className="ml-2 mb-6 text-lg font-bold">Error: {error.message}</h2>
        </div>
    )
}


export default function UserPage() {
    const {user }= useLoaderData();
    return (
        <div className="bg-white border-gray-200 dark:bg-gray-700">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <article className="flex items-center">
                    <img src={user.avatar} className="h-8 mr-3" alt="avatar" />
                    <h1><span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">{user.username}</span></h1>
                </article>
            </div>

        </div>
    )
}