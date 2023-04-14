import { Form, Link } from "@remix-run/react";


export async function loader({ request }) {
    const session = await getSession(request.headers.get("Cookie"));
    return json({ userId: session.get("userId") });
  }


export async function action( {request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const session = await getSession(request.headers.get("Cookie"));
    const db = connectDb();
    const user = await db.models.User.findOne({ username: data.get(username).trim() });

    if (!user) {
        return json({ errorMessage: "Username or password is incorrect" }, { status: 400 });
    }

    if (user) {
        const match = await bcrypt.compare(data.get(password).trim(), user.password);
        if (match) {
            session.set("userId", user._id);
            return redirect("/", { headers: { "Set-Cookie": await session.commit() } });
        } else {
            return json({ errorMessage: "Username or password is incorrect" }, { status: 400 });
        }
    }
    return  
}

export default function Login() {
    return (
        <div className="w-full max-w-xs">
            <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h1 className="ml-2 mb-6 text-lg font-bold">Log In</h1>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" for="username">
                        Username
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"/>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" for="password">
                        Password
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="**************"/>
                    <p className="text-red-500 text-xs italic">{dataAction?.errorMessage}</p>
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white ml-4 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                        Log In
                    </button>
                    <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="/sorry">
                        Forgot Password?
                    </Link>
                </div>
                <div className="flex items-center justify-between">
                    <Link className=" mt-6 inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="/signup">
                        Create Account
                    </Link>
                </div>
            </Form>
        </div>
    )
}