"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import { listenToRecentPosts } from "../lib/firebase/firebaseUtils";
import { Post } from "../lib/types";
import PostCard from "../components/PostCard";
import SignInWithGoogle from "../components/SignInWithGoogle";

export default function HomeFeedPage() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const unsub = listenToRecentPosts(setPosts);
    return () => unsub();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4">
        <h1 className="text-2xl font-semibold">Welcome to Social</h1>
        <p className="text-gray-600">Sign in to view and create posts.</p>
        <div className="flex justify-center">
          <SignInWithGoogle />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="text-center text-gray-600">No posts yet. Be the first to post!</div>
      ) : (
        posts.map((p: Post) => <PostCard key={p.id} post={p} />)
      )}
    </div>
  );
}
