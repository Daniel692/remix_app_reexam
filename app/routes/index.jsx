import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link, Form } from "@remix-run/react";
import connectDb from "~/db/dbConnection.server";
import { getSession } from "~/session.server";

import { useState } from "react";

import { BsHeartFill, BsHeart } from 'react-icons/bs';
import Modal from "~/components/Modal";

export async function action({ request }) {
  const formData = await request.formData();
  if (formData.get("action") === "likePost") {
    const data = Object.fromEntries(formData);
    console.log(data);
    const db = connectDb();
    const post = await db.models.Post.findById(data.postId);
    console.log(post)
    console.log("FROM LIKEPOST FUNCTION")
    console.log(post.starredBy.includes(data.userId))
    // check if user is in starredBy
    if (post.starredBy.includes(data.userId)) {
        // remove user from starredBy
        post.starredBy = post.starredBy.filter((id) => id !== data.userId);
        post.starredByNames = post.starredByNames.filter((name) => name !== data.username);
        console.log("USER ALREADY LIKED")
        // update post
        await post.save();
    } else {
        console.log("USER LIKED")
        // add user to starredBy
        post.starredBy.push(data.userId);
        post.starredByNames.push(data.username);
        // update post
        await post.save();
    }
    console.log("Like Post Done")
    return json({ success: true });
  }
  if (formData.get("action") === "deletePost") {
    const data = Object.fromEntries(formData);
    console.log(data);
    const db = connectDb();
    const deletedPost = await db.models.Post.findByIdAndDelete(data.postId);
    console.log(deletedPost)
    console.log("FROM DELETEPOST FUNCTION")
    return redirect("/");
}
}

export async function loader({ request }) {
  const db = connectDb()
  const posts = await db.models.Post.find()
  const user = {}

  const session = await getSession(request.headers.get("Cookie"));
  user.userId = session.get("userId")
  user.username = session.get("username")

  const data = {posts, user}

  return json(data)
}

function isStarredBy(post, user) {
  return post.starredBy.includes(user.userId)
}

export default function Index() {

  const [showModal, setShowModal] = useState(false);
  
  const data = useLoaderData()
  console.log(data)
  const posts = data.posts
  const user = data.user
  console.log(user)
  console.log(posts)
  console.log("HERE POSTS")


    return posts.map(post => (
        <article key={post._id}>
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
                <div className="px-6 py-4">
                    {/* TODO Delete */}
                    <div className="font-bold text-xl mb-2">{post.title}</div>
                    <Link to={'/user/' + post.postedBy} className="text-xs- mb-2">Posted by: <span className='underline'>{post.postedByUser}</span></Link>
                    {/* <Link to={'/user/' + post.postedBy + '/' + post._id} className="text-xs- mb-2">POST:<span className='underline'>{post.title}</span></Link> */}
                    <p className="text-gray-700 text-base">{post.body}</p>
                    {/* <p className="text-gray-700 text-base">STARREDBY:{post.starredByNames}</p> */}
                </div>
                <div className="px-4 pt-2 pb-4">
                    <Form className="inline-block px-1 py-1 ml-1 mr-1 mb-2" method='post'>
                        <input type="hidden" name='userId' value={user.userId} />
                        <input type="hidden" name='username' value={user.username} />
                        <input type="hidden" name='postId' value={post._id} />
                        <button type="submit" name="action" value="likePost">
                            {isStarredBy(post, user) ? <BsHeartFill size={32} className="inline-block mr-1"/> : <BsHeart  size={32} className="inline-block mr-1"/>}
                        </button>
                    </Form>
                    <Link to={'/user/' + post.postedBy + '/' + post._id}><span className="inline-block bg-gray-200 rounded-full px-3 py-1 ml-2 text-sm font-semibold text-gray-700 mr-2 mb-2">Detail</span></Link>
                    <button onClick={() => setShowModal(true)} type="button" className="inline-block bg-gray-200 rounded-full px-3 py-1 ml-2 text-sm font-semibold text-gray-700 mr-2 mb-2">See Likes({post.starredBy.length})</button>
                            {showModal ? (
                               <>
                               <div
                                 className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                               >
                                 <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                   <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                     <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                       <h3 className="text-3xl font-semibold">
                                         Post Liked by:
                                       </h3>
                                     </div>
                                     <div className="relative p-6 flex-auto">
                                       <ul className="list-disc list-inside">
                                         {post.starredByNames.map((username) => (
                                           <li key={username}>
                                               {username}
                                           </li>
                                         ))}
                                       </ul>
                                     </div>
                                     <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                       <button
                                         className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                         type="button"
                                         onClick={() => setShowModal(false)}
                                       >
                                         Close
                                       </button>
                                     </div>
                                   </div>
                                 </div>
                               </div>
                               <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                             </>
                            )
                            : null}
                          {(user.username === post.postedByUser) &&
                            <Form  className="inline-block bg-gray-200 rounded-full px-3 py-1 ml-2 text-sm font-semibold text-gray-700 mr-2 mb-2"  method="post">
                              <input type="hidden" id="postId" name="postId" value={post._id}/>
                              <button type="submit" name="action" value="deletePost">
                                Delete
                              </button>
                            </Form>
                          }
                </div>
            </div>
        </article>
    )
  )
}

