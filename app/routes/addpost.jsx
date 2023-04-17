import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/dbConnection.server";

import { Form, useActionData, useLoaderData } from '@remix-run/react';
// import { json } from '@remix-run/node';
import { getSession } from '~/session.server';
import { useState } from "react";

export default function AddPostPage() {
    const data = useActionData()
    const  user  = useLoaderData();

    const [ post, setPost ] = useState("")

    function handlePostChange(e) {
        const inputPost = e.target.value
        if (inputPost.length <= 140) {
            setPost(inputPost)
        }
    }
    

    return <main>
        <div className="w-full max-w-md mx-auto my-5">
        <Form method="post" id="post-form" className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8">
            <input type="hidden" id="postedBy" name="postedBy" value={user.userId} />
            <input type="hidden" id="postedByUser" name="postedByUser" value={user.username} />
            <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="title">Title:</label>
            <input className="appearance-none bg-gray-200 border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" id="title" name="title" placeholder="Enter a title" required maxLength={50} />
            </div>
            <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="body">Body:</label>
            <textarea className="appearance-none bg-gray-200 border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="body" name="body" rows="6" cols="50" placeholder="Enter some text" value={post} required maxLength="140" onChange={handlePostChange} />
            <p className="text-gray-700 text-xs italic text-right">{140 - post.length} characters remaining</p>
            </div>
            <div className="flex items-center justify-end">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Add Post</button>
            </div>
        </Form>
        </div>
    </main>
}

export async function loader({ request }) {
    const session = await getSession(request.headers.get("Cookie"));
    if (!session.get("userId")) {
        return redirect("/login");
      }

    return json({ userId: session.get("userId"), username: session.get("username") });
  }

export async function action({ request }) {
    const formData = await request.formData()

    let postData = Object.fromEntries(formData)

    const db = connectDb();
	try {
		const newPost = new db.models.Post(postData);
		await newPost.save();
        return redirect('/');
	} catch (error) {
		console.log(error);
		return json(error.errors);
	}

}