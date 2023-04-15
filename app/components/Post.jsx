export default function Post(post) {
    return (
            <article key={post._id}>
                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">TITLE:{post.title}</div>
                        <p className="text-xs- mb-2">USER:<span className='underline'>{post.postedByUser}</span></p>
                        <p className="text-gray-700 text-base">BODY:{post.body}</p>
                        <p className="text-gray-700 text-base">STARREDBY:{post.starredByNames}</p>
                    </div>
                </div>
            </article>
            )

}