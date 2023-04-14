import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PostsList from "~/components/PostsList";
import connectDb from "~/db/dbConnection.server";

export async function loader() {
  const db = connectDb()
  const posts = await db.models.Post.find()
  return json(posts)
}

export default function Index() {
  const posts = useLoaderData()
  console.log(posts[0])

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1 className="text-gray-900 font-bold text-3xl mb-2">Your Posts: </h1>
      <PostsList posts={posts}/>
    </div>
  );
}