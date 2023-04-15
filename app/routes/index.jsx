import { json } from "@remix-run/node";
import { useLoaderData, Link, Form } from "@remix-run/react";
import connectDb from "~/db/dbConnection.server";
import { getSession } from "~/session.server";

import { BsHeartFill, BsHeart } from 'react-icons/bs';

export async function action({ request }) {
  const formData = await request.formData();
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
                    <div className="font-bold text-xl mb-2">TITLE:{post.title}</div>
                    <Link to={'/user/' + post.postedBy} className="text-xs- mb-2">USER:<span className='underline'>{post.postedByUser}</span></Link>
                    <Link to={'/user/' + post.postedBy + '/' + post._id} className="text-xs- mb-2">POST:<span className='underline'>{post.title}</span></Link>
                    <p className="text-gray-700 text-base">BODY:{post.body}</p>
                    <p className="text-gray-700 text-base">STARREDBY:{post.starredByNames}</p>
                </div>
                <div className="px-6 pt-2 pb-4">
                    <Form className="inline-block px-3 py-1 ml-2 mr-2 mb-2" method='post'>
                        <input type="hidden" name='userId' value={user.userId} />
                        <input type="hidden" name='username' value={user.username} />
                        <input type="hidden" name='postId' value={post._id} />
                        <button>
                            {isStarredBy(post, user) ? <BsHeartFill size={32} className="inline-block mr-2"/> : <BsHeart  size={32} className="inline-block mr-2"/>}
                        </button>
                    </Form>

                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 ml-2 text-sm font-semibold text-gray-700 mr-2 mb-2">See All Likes</span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 ml-2 text-sm font-semibold text-gray-700 mr-2 mb-2">Delete Post</span>
                </div>
            </div>
        </article>
    )
  )
}

