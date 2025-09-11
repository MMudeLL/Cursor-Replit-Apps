"use client";
import React from "react";

export function InputField({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  disabled?: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        name="prompt"
        value={value}
        onChange={onChange}
        placeholder="Say something…"
        className="flex-1 border rounded px-3 py-2 bg-white text-black placeholder:text-neutral-500 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-400 border-neutral-300 dark:border-neutral-700"
      />
      <button
        type="submit"
        disabled={disabled || value.trim().length === 0}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}


