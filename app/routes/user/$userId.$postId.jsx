import { redirect, json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import  connectDb  from '~/db/dbConnection.server'
import { getSession } from "~/session.server";

export async function loader({ request, params }) {
    const session = await getSession(request.headers.get("Cookie"));
    if (!session.get("userId")) {
        return redirect("/login");
      }

    const id = params.postId
    const db = connectDb()
    const post = await db.models.Post.findById(id)
    return json(post)
  }


export default function SinglePost() {
    const post = useLoaderData()

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
        <article key={post._id}>
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
