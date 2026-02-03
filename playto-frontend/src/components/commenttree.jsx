// components/CommentTree.jsx
import PostCard from "./postcard";

const CommentTree = ({ post, user, onCommentSuccess, depth = 0 }) => {
  return (
    <div className={`${depth > 0 ? "ml-4 md:ml-8 border-l-2 border-gray-100 dark:border-gray-800 pl-4 mt-4" : ""}`}>
      <PostCard 
        post={post} 
        user={user} 
        onCommentSuccess={onCommentSuccess} 
      />
      
      {/* Recursion: If this post has replies, render another CommentTree for each */}
      {post.replies && post.replies.length > 0 && (
        <div className="mt-2">
          {post.replies.map((reply) => (
            <CommentTree 
              key={reply.id} 
              post={reply} 
              user={user} 
              onCommentSuccess={onCommentSuccess}
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentTree;