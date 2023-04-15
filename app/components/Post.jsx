import { BsHeartFill, BsHeart } from 'react-icons/bs';
import { Link, Form, useLoaderData, useActionData } from "@remix-run/react";

import connectDb from "~/db/dbConnection.server";


// export async function loader({ request }) {
//     const session = await getSession(request.headers.get("Cookie"));
//     return json({ userId: session.get("userId") });
// }

export async function action() {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    console.log(data);
    const db = connectDb();
    const post = await db.models.Post.findById(data.postId);
    console.log(post)
    console.log("FROM LIKEPOST FUNCTION")
    // check if user is in starredBy
    if (post.starredBy.includes(data.userId)) {
        // remove user from starredBy
        post.starredBy = post.starredBy.filter((id) => id !== data.userId);
        // update post
        await post.save();
    } else {
        // add user to starredBy
        post.starredBy.push(user.userId);
        // update post
        await post.save();
    }
    console.log("Like Post Done")
}


export default function Post({post, user}) {
    const actionData = useActionData();
    // const  userId  = useLoaderData();
    console.log(post)
    console.log(user)

    return (
                <article key={post._id}>
                    <div className="max-w-sm rounded overflow-hidden shadow-lg">
                        <div className="px-6 py-4">
                            {/* TODO Delete */}
                            <div className="font-bold text-xl mb-2">TITLE:{post.title}</div>
                            <Link to={'/user/' + post.postedBy} className="text-xs- mb-2">USER:<span className='underline'>{post.postedByUser}</span></Link>
                            <p className="text-gray-700 text-base">BODY:{post.body}</p>
                            <p className="text-gray-700 text-base">STARREDBY:{post.starredBy}</p>

                            {/* TODO Implement Starred By */}
                            {/* <p>Starred By:</p> */}
                        </div>
                        <div className="px-6 pt-2 pb-4">

                            {/* <BsHeartFill size={32}/> */}
                            <Form method='post'>
                                <input type="hidden" name='userId' value={user.userId} />
                                <input type="hidden" name='postId' value={post._id} />
                                <button>
                                    <BsHeart  size={32} className="inline-block mr-2"/>
                                </button>
                            </Form>

                            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 ml-2 text-sm font-semibold text-gray-700 mr-2 mb-2">See All Likes</span>
                            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 ml-2 text-sm font-semibold text-gray-700 mr-2 mb-2">Delete Post</span>
                        </div>
                    </div>
                </article>
            )

}