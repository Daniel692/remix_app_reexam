import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link, Form } from "@remix-run/react";
import connectDb from "~/db/dbConnection.server";
import { getSession } from "~/session.server";

import { BsHeartFill, BsHeart } from 'react-icons/bs';

export async function action({ request }) {
  const formData = await request.formData();
  if (formData.get("action") === "likePost") {
    const data = Object.fromEntries(formData);
    const db = connectDb();
    const post = await db.models.Post.findById(data.postId);
    // check if user is in starredBy
    if (post.starredBy.includes(data.userId)) {
        // remove user from starredBy
        post.starredBy = post.starredBy.filter((id) => id !== data.userId);
        post.starredByNames = post.starredByNames.filter((name) => name !== data.username);
        // update post
        await post.save();
    } else {
        // add user to starredBy
        post.starredBy.push(data.userId);
        post.starredByNames.push(data.username);
        // update post
        await post.save();
    }
    return json({ success: true });
  }
  if (formData.get("action") === "deletePost") {
    const data = Object.fromEntries(formData);
    const db = connectDb();
    const deletedPost = await db.models.Post.findByIdAndDelete(data.postId);
    return redirect("/");
}
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.get("userId")) {
    return redirect("/login");
  }

  const db = connectDb()
  const posts = await db.models.Post.find().sort({ _id: -1 });
  const user = {}

  user.userId = session.get("userId")
  user.username = session.get("username")

  const data = {posts, user}

  return json(data)
}

function isStarredBy(post, user) {
  return post.starredBy.includes(user.userId)
}

export default function Index() {

  function likedBy(values) {
    if (values.length  == 0) {
      return "No one";
    } else if (values.length < 4) {
      return values.join(", ");
    } else {
      return values.slice(0, 4).join(", ") + " and " + (values.length - 4) + " others";
    }
  }

  const data = useLoaderData()
  const posts = data.posts
  const user = data.user

  function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-GB');
  }


    return posts.map(post => (
<article key={post._id} className="my-4">
  <div className="max-w-sm rounded-md overflow-hidden shadow-lg mx-auto bg-gray-100">
  <div className="px-6 py-4">
    <div className="font-bold text-xl">{post.title}</div>
        <p className="text-xs my-2">Posted by: <Link to={'/user/' + post.postedBy} className='text-blue-500 underline'>{post.postedByUser}</Link> on {formatDate(post.createdAt)}</p>
        <p className="text-gray-700 text-base">{post.body}</p>
        <p className="text-xs mt-2">Liked by: {likedBy(post.starredByNames)}</p>
    </div>
    <div className="px-4 pt-2 pb-4">
      <Form className="inline-block px-1 py-1 ml-1 mr-1 mb-2" method='post'>
        <input type="hidden" name='userId' value={user.userId} />
        <input type="hidden" name='username' value={user.username} />
        <input type="hidden" name='postId' value={post._id} />
        <button type="submit" name="action" value="likePost">
          {isStarredBy(post, user) ? <BsHeartFill size={28} className="inline-block text-red-500 mx-2"/> : <BsHeart size={28} className="inline-block text-gray-300 hover:text-red-500 mx-2"/>}
        </button>
      </Form>
      <Link to={'/user/' + post.postedBy + '/' + post._id}><span className="inline-block bg-gray-600 hover:bg-gray-700 rounded-lg px-3 py-1 text-sm font-semibold text-gray-100 mr-2">Detail</span></Link>
      {(user.username === post.postedByUser) &&
        <Form className="inline-block" method="post">
          <input type="hidden" id="postId" name="postId" value={post._id}/>
          <button type="submit" name="action" value="deletePost" className="bg-red-500 hover:bg-red-600 rounded-lg px-3 py-1 text-sm font-semibold text-gray-100">
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


        // <Link to={'/user/' + post.postedBy + '/' + post._id}><span className="inline-block bg-gray-200 rounded-full px-3 py-1 ml-2 text-sm font-semibold text-gray-700 mr-2 mb-2">Detail</span></Link>
        //       {(user.username === post.postedByUser) &&
        //         <Form  className="inline-block bg-gray-200 rounded-full px-3 py-1 ml-2 text-sm font-semibold text-gray-700 mr-2 mb-2"  method="post">
        //           <input type="hidden" id="postId" name="postId" value={post._id}/>
        //           <button type="submit" name="action" value="deletePost">
        //             Delete
        //           </button>
        //         </Form>
        //       }

    //     </Form>
    //     <Link to={'/user/' + post.postedBy + '/' + post._id}><span className="inline-block bg-gray-600 hover:bg-gray-700 rounded-lg px-3 py-1 text-sm font-semibold text-gray-100 mr-2">Detail</span></Link>
    //     {(user.username === post.postedByUser) &&
    //       <Form className="inline-block bg-red-500 hover:bg-red-600 rounded-lg px-3 py-1 text-sm font-semibold text-gray-100" method="post">
    //         <input type="hidden" id="postId" name="postId" value={post._id}/>
    //         <button type="submit" name="action" value="deletePost" >
    //           Delete
    //         </button>
    //       </Form>
    //     }
    //   </div>
    // </div>