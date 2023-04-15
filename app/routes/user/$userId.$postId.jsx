import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import  connectDb  from '~/db/dbConnection.server'

export async function loader({ params }) {
    const id = params.postId
    const db = connectDb()
    const post = await db.models.Post.findById(id)
    return json(post)
  }


export default function SinglePost() {
    const post = useLoaderData()
    return (
        <div>
            <article key={post._id}>
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">TITLE:{post.title}</div>
                    <p to={'/user/' + post.postedBy} className="text-xs- mb-2">USER:{post.postedByUser}</p>
                    <p className="text-gray-700 text-base">BODY:{post.body}</p>
                    <p className="text-gray-700 text-base">STARREDBY:{post.starredByNames}</p>
                </div>
            </div>
        </article>
        </div>
    )
}
