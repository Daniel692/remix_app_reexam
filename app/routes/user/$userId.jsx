import { redirect, json } from "@remix-run/node";
import { useLoaderData, Link, Form} from "@remix-run/react";

import connectDb from "~/db/dbConnection.server";


export async function loader({ params }) {
    const db = connectDb();
    const user = await db.models.User.findById(params.userId);
    console.log(user);
    const userPosts = await db.models.Post.find({ postedBy: params.userId });
    console.log(userPosts);
    console.log("USER POSTS")
    if (!user) {
        return redirect("/404");
    }
    return json({ userPosts, user });
}

export function CatchBoundary({ error }) {
    return (
        <div className="w-full max-w-xs">
            <h1 className="ml-2 mb-6 text-lg font-bold">The user does not exist</h1>
            <h2 className="ml-2 mb-6 text-lg font-bold">Error: {error.status}</h2>
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
    const data = useLoaderData();
    const posts = data.userPosts;
    const user = data.user;
    console.log(posts);

    return (
        <>
            <div className="bg-white border-gray-200 dark:bg-gray-700">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <div className="flex items-center">
                        <img src={user.avatar} className="h-8 mr-3" alt="avatar" />
                        <h1><span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">{user.username}</span></h1>
                    </div>
                </div>
        </div>
            <div>
                {posts.map((post) => {
                    return (
                        <article key={post._id}>
                        <div className="max-w-sm rounded overflow-hidden shadow-lg">
                            <div className="px-6 py-4">
                                {/* TODO Delete */}
                                <div className="font-bold text-xl mb-2">TITLE:{post.title}</div>
                                <Link to={'/user/' + post.postedBy} className="text-xs- mb-2">USER:<span className='underline'>{post.postedByUser}</span></Link>
                                <p className="text-gray-700 text-base">BODY:{post.body}</p>
                                <p className="text-gray-700 text-base">STARREDBY:{post.starredByNames}</p>
                            </div>
                        </div>
                    </article>
                    )
                }

                )}

            </div>
        </>
    )

}