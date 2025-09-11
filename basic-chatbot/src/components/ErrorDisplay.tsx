"use client";
export function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="text-sm text-red-600 border border-red-200 bg-red-50 px-3 py-2 rounded">
      {message}
    </div>
  );
}


