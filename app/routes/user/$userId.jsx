import { redirect, json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getSession } from "~/session.server";
import connectDb from "~/db/dbConnection.server";


export async function loader({ request, params }) {
    const session = await getSession(request.headers.get("Cookie"));
    if (!session.get("userId")) {
        return redirect("/login");
      }

    const db = connectDb();
    const user = await db.models.User.findById(params.userId);
    const userPosts = await db.models.Post.find({ postedBy: params.userId }).sort({ _id: -1 });;
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

    function likedBy(values) {
        if (values.length  == 0) {
          return "No one";
        } else if (values.length < 4) {
          return values.join(", ");
        } else {
          return values.slice(0, 4).join(", ") + " and " + (values.length - 4) + " others";
        }
      }

    function formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('en-GB');
      }

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
                        <article className="my-4" key={post._id}>
                            <div className="max-w-sm rounded-md overflow-hidden shadow-lg mx-auto bg-gray-100">
                                <div className="px-6 py-4">
                                    <div className="font-bold text-xl">{post.title}</div>
                                    <p className="text-xs my-2">Posted by: <Link to={'/user/' + post.postedBy} className='text-blue-500 underline'>{post.postedByUser}</Link> on {formatDate(post.createdAt)}</p>
                                    <p className="text-gray-700 text-base">{post.body}</p>
                                    <p className="text-xs mt-2">Liked by: {likedBy(post.starredByNames)}</p>
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