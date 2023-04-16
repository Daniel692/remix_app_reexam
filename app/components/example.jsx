<article key={post._id}>
  <div className="max-w-md mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-lg">
    <div className="px-6 py-4">
      <div className="max-w-sm rounded overflow-hidden shadow-lg mx-auto bg-white"></div>
      <Link to={`/user/${post.postedBy}`} className="text-xs text-gray-400 mb-2 hover:text-gray-100">
        Posted by: <span className="underline">{post.postedByUser}</span>
      </Link>
      <p className="text-gray-300 text-base">{post.body}</p>
      <p className="text-gray-400 text-sm mt-2">Liked by: {likedBy(post.starredByNames)}</p>
    </div>
    <div className="px-6 py-3 bg-gray-700">
      <Form method="post">
        <input type="hidden" name="userId" value={user.userId} />
        <input type="hidden" name="username" value={user.username} />
        <input type="hidden" name="postId" value={post._id} />
        <button type="submit" name="action" value="likePost" className="inline-block focus:outline-none mr-2">
          {isStarredBy(post, user) ? (
            <BsHeartFill size={28} className="text-red-500" />
          ) : (
            <BsHeart size={28} className="text-gray-300 hover:text-red-500" />
          )}
        </button>
      </Form>
      <Link to={`/user/${post.postedBy}/${post._id}`}>
        <span className="inline-block bg-gray-600 hover:bg-gray-700 rounded-lg px-3 py-1 text-sm font-semibold text-gray-100 mr-2">
          Detail
        </span>
      </Link>
      {user.username === post.postedByUser && (
        <Form method="post" className="inline-block">
          <input type="hidden" id="postId" name="postId" value={post._id} />
          <button type="submit" name="action" value="deletePost" className="inline-block bg-red-500 hover:bg-red-600 rounded-lg px-3 py-1 text-sm font-semibold text-gray-100">
            Delete
          </button>
        </Form>
      )}
    </div>
  </div>
</article>
