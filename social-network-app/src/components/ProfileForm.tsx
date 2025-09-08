"use client";

import { useEffect, useState } from "react";
import { getUserProfile, upsertUserProfile } from "../lib/firebase/firebaseUtils";
import { useAuth } from "../lib/hooks/useAuth";
import { UserProfile } from "../lib/types";

export default function ProfileForm() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const p = await getUserProfile(user.uid);
      setProfile(
        p ?? {
          uid: user.uid,
          displayName: user.displayName ?? null,
          photoURL: user.photoURL ?? null,
          createdAt: Date.now(),
        }
      );
      setBio((p?.bio as any) ?? "");
      setWebsite((p?.website as any) ?? "");
    })();
  }, [user]);

  const onSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await upsertUserProfile(user.uid, {
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
        bio,
        website,
        createdAt: profile?.createdAt ?? Date.now(),
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-3">
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.displayName ?? ""} className="w-12 h-12 rounded-full" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200" />
        )}
        <div>
          <div className="font-medium">{user.displayName ?? "User"}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-gray-600">Bio</label>
        <textarea className="w-full border rounded p-2" value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="block text-sm text-gray-600">Website</label>
        <input className="w-full border rounded p-2" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <button onClick={onSave} disabled={saving} className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50">
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}


