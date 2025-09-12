"use client";
export function ProgressStatus({ status, logs }: { status: string; logs?: string }) {
  return (
    <div className="text-sm px-3 py-2 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
      <div className="font-medium">Status: {status}</div>
      {logs ? (
        <pre className="mt-2 text-xs whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">{logs}</pre>
      ) : null}
    </div>
  );
}


