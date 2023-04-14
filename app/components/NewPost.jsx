import { Form, useActionData, useTransition as useNavigation } from '@remix-run/react';


function NewPost() {
    const data = useActionData()
    const navigation = useNavigation()

    // Get the state of the Form to disable the button while the form is being submitted 
    const isSubmitting = navigation.state === 'submitting'

  return (
    <div className='w-full max-w-xs'>
        <Form method="post" id="post-form" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {data?.message && <p>{data.message}</p>}
            <div className="mb-4">
                <label htmlFor="postedBy" className="block text-gray-700 text-sm font-bold mb-2">Posted By:</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" id="postedBy" name="postedBy" placeholder='User Name' required />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title:</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" id="title" name="title" placeholder='Title' required />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="body">body:</label>
                <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="body" name="body" rows="5" placeholder='Body Text' required />
            </div>
            <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={isSubmitting}>{isSubmitting ? "Adding"  : 'Add Post'}</button>
            </div>
        </Form>
    </div>

  );
}

export default NewPost;
