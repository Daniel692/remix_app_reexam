import { json, redirect } from "@remix-run/node";
import NewPost from "~/components/NewPost";
import connectDb from "~/db/dbConnection.server";

export default function AddPostPage() {
    return <main>
        <NewPost/>
    </main>
}

export async function action({ request }) {
    const formData = await request.formData()

    const postData = Object.fromEntries(formData)

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