import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import connectDb from "~/db/dbConnection.server";
import { getSession } from "~/session.server";

import Post from "~/components/Post";

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

export default function Index() {
  const data = useLoaderData()
  console.log(data)
  const posts = data.posts
  const user = data.user
  // console.log(posts[0])

    return posts.map(post => (
        <Post post={post}/>
  ))
}