import React, { useState } from "react";
import PostCard from "./postcard";

const Comment = ({ comment, user, depth = 0 }) => {
  const [showReplies, setShowReplies] = useState(true);

  // Limit depth to prevent the UI from getting too squeezed
  const maxDepth = 5;

  return (
    <div className={`mt-4 ${depth > 0 ? "ml-6 border-l-2 border-gray-100 dark:border-gray-800 pl-4" : ""}`}>
      {/* The main post/comment card */}
      <PostCard post={comment} user={user} isComment={depth > 0} />

      {/* Action to toggle replies visibility */}
      {comment.replies?.length > 0 && (
        <button 
          onClick={() => setShowReplies(!showReplies)}
          className="text-xs text-gray-500 mt-2 hover:underline"
        >
          {showReplies ? "Hide Replies" : `Show ${comment.replies.length} replies`}
        </button>
      )}

      {/* RECURSION: Component calls itself for each reply */}
      {showReplies && comment.replies?.map((reply) => (
        <Comment 
          key={reply.id} 
          comment={reply} 
          user={user} 
          depth={depth + 1} 
        />
      ))}
    </div>
  );
};

export default Comment;