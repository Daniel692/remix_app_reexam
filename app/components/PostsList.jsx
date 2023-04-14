import { BsHeartFill, BsHeart } from 'react-icons/bs';


export default function PostsList({posts}) {
    return posts.map(post => (
                <article key={post._id}>
                    <div className="max-w-sm rounded overflow-hidden shadow-lg">
                        <div className="px-6 py-4">
                            {/* TODO Delete */}
                            <div className="font-bold text-xl mb-2">{post.title}</div>
                            <p className="text-xs- mb-2">{post.postedBy}</p>
                            <p className="text-gray-700 text-base">{post.body}</p>
                            {/* TODO Implement Starred By */}
                            {/* <p>Starred By:</p> */}
                        </div>
                        <div className="px-6 pt-2 pb-4">

                            {/* <BsHeartFill size={32}/> */}
                            <BsHeart size={32} className="inline-block mr-2"/>
                            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 ml-2 text-sm font-semibold text-gray-700 mr-2 mb-2">See All Likes</span>
                            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 ml-2 text-sm font-semibold text-gray-700 mr-2 mb-2">Delete Post</span>
                        </div>
                    </div>
                </article>
            ))

}