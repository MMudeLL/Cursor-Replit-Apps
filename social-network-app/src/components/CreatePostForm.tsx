"use client";

import { useState } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import { createPost } from "../lib/firebase/firebaseUtils";

export default function CreatePostForm({ onCreated }: { onCreated?: () => void }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || (!text.trim() && !file)) return;
    setLoading(true);
    try {
      await createPost({
        uid: user.uid,
        authorName: user.displayName ?? null,
        authorPhotoURL: user.photoURL ?? null,
        text: text.trim(),
        imageFile: file,
      } as any);
      setText("");
      setFile(null);
      onCreated?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-lg p-4 space-y-3">
      <textarea
        className="w-full border rounded p-3 min-h-[100px]"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center justify-between">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}


