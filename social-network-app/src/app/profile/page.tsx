"use client";

import ProfileForm from "../../components/ProfileForm";
import SignInWithGoogle from "../../components/SignInWithGoogle";
import { useAuth } from "../../lib/hooks/useAuth";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div className="text-center">Loading...</div>;
  if (!user)
    return (
      <div className="max-w-md mx-auto text-center space-y-4">
        <h1 className="text-2xl font-semibold">Sign in to view your profile</h1>
        <div className="flex justify-center"><SignInWithGoogle /></div>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your Profile</h1>
        <button onClick={signOut} className="text-sm text-red-600">Sign out</button>
      </div>
      <ProfileForm />
    </div>
  );
}


