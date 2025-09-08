"use client";

import { useEffect, useState } from "react";
import { Post, Comment } from "../lib/types";
import { addComment, likePost, listenToComments } from "../lib/firebase/firebaseUtils";
import { useAuth } from "../lib/hooks/useAuth";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [likeCount, setLikeCount] = useState<number>(post.likeCount);
  const [commentCount, setCommentCount] = useState<number>(post.commentCount);

  useEffect(() => {
    const unsub = listenToComments(post.id, (list) => {
      setComments(list);
      setCommentCount(list.length);
    });
    return () => unsub();
  }, [post.id]);

  const onLike = async () => {
    if (!user) return;
    await likePost(post.id, user.uid);
    setLikeCount((c) => c + 1);
  };

  const onAddComment = async () => {
    if (!user || !commentText.trim()) return;
    await addComment(post.id, {
      uid: user.uid,
      authorName: user.displayName ?? null,
      authorPhotoURL: user.photoURL ?? null,
      text: commentText.trim(),
    } as any);
    setCommentText("");
  };

  return (
    <article className="bg-white rounded-lg border p-4 mb-4">
      <header className="flex items-center gap-3 mb-3">
        {post.authorPhotoURL ? (
          <img src={post.authorPhotoURL} alt={post.authorName ?? ""} className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200" />
        )}
        <div>
          <div className="font-medium">{post.authorName ?? "Unknown"}</div>
          <div className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
        </div>
      </header>
      <div className="whitespace-pre-wrap mb-3">{post.text}</div>
      {post.imageUrl ? (
        <img src={post.imageUrl} alt="post" className="rounded-lg border max-h-[480px] w-full object-cover mb-3" />
      ) : null}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <button onClick={onLike} className="px-3 py-1 rounded hover:bg-gray-100">❤️ Like ({likeCount})</button>
        <span>💬 {commentCount}</span>
      </div>
      <div className="mt-2">
        <div className="flex gap-2">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment"
            className="flex-1 border rounded px-3 py-2"
          />
          <button onClick={onAddComment} className="px-3 py-2 bg-gray-900 text-white rounded">Comment</button>
        </div>
        <ul className="mt-3 space-y-2">
          {comments.map((c) => (
            <li key={c.id} className="text-sm">
              <span className="font-medium mr-2">{c.authorName ?? "User"}</span>
              {c.text}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}


