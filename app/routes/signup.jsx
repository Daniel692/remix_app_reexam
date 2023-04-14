import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useCatch } from "@remix-run/react";
import { Link } from "react-router-dom";
import connectDb from "~/db/dbConnection.server";
import bcrypt from "bcryptjs"


export async function action({ request }) {
    const db = connectDb();
    const formData = await request.formData()
    console.log(formData)
    const user = db.models.User;
    let data = Object.fromEntries(formData);
    console.log(data)
    if (data.password === "" || data.username === "") {
        return json(
            { errorMessage: "Please fill out all fields", values: data },
            { status: 400 }
        );
  }

  if (data.password !== data.repeatPassword) {
    return json(
      { errorMessage: "Passwords do not match", values: data },
      { status: 400 }
    );
  } else {
    const hashedPassword = await bcrypt.hash(data.password.trim(), 10)
    const newUser = new user({
      username: data.username,
      password: hashedPassword,
    });
    await newUser.save();
    return redirect("/login");
  }
} 


export default function SignUp() {
    const dataAction = useActionData()

    return(
        <div className="w-full max-w-xs">
            <Form method="post" id="post-form" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h1 className="ml-8 mt-6 text-lg font-bold">Sign Up</h1>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" name="username" type="text" placeholder="Username" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" name="password" type="password" placeholder="*************" />
                    {/* If empty I can add border-red-500 */}
                    {/* <p class="text-red-500 text-xs italic">Please choose a password.</p> */}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Repeat Password
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="repeatPassword" name="repeatPassword" type="password" placeholder="*************" />
                    <p className="text-red-500 text-xs italic">{dataAction?.errorMessage}</p>
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Sign In
                    </button>
                    <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="/sorry">
                        Forgot Password?
                    </Link>
                </div>
            </Form>
        </div>
    )
}