"use client";

import { useAuth } from "../../lib/hooks/useAuth";
import CreatePostForm from "../../components/CreatePostForm";
import SignInWithGoogle from "../../components/SignInWithGoogle";

export default function CreatePostPage() {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center">Loading...</div>;
  if (!user)
    return (
      <div className="max-w-md mx-auto text-center space-y-4">
        <h1 className="text-2xl font-semibold">Sign in to create posts</h1>
        <div className="flex justify-center"><SignInWithGoogle /></div>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Create a new post</h1>
      <CreatePostForm />
    </div>
  );
}


