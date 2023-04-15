import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/dbConnection.server";

import { Form, useActionData, useLoaderData } from '@remix-run/react';
// import { json } from '@remix-run/node';
import { getSession } from '~/session.server';

export default function AddPostPage() {
        const data = useActionData()

        const  user  = useLoaderData();
        console.log(user);
    return <main>
        <div className='w-full max-w-xs'>
            <Form method="post" id="post-form" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <input type="hidden" id="postedBy" name="postedBy" value={user.userId} />
                    <input type="hidden" id="postedByUser" name="postedByUser" value={user.username} />
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title:</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" id="title" name="title" placeholder='Title' required />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="body">body:</label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="body" name="body" rows="5" placeholder='Body Text' required />
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type='submit'>Add Post</button>
                </div>
            </Form>
        </div>

    </main>
}

export async function loader({ request }) {
    const session = await getSession(request.headers.get("Cookie"));
    return json({ userId: session.get("userId"), username: session.get("username") });
  }

export async function action({ request }) {
    const formData = await request.formData()

    let postData = Object.fromEntries(formData)

    console.log(JSON.stringify(postData))
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