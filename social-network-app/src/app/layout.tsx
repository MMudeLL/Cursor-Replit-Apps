import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "../lib/contexts/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <AuthProvider>
          <header className="border-b bg-white">
            <nav className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
              <Link href="/" className="text-xl font-semibold">Social</Link>
              <div className="flex items-center gap-4">
                <Link href="/" className="px-3 py-1.5 rounded hover:bg-gray-100">Home</Link>
                <Link href="/create" className="px-3 py-1.5 rounded hover:bg-gray-100">Create Post</Link>
                <Link href="/profile" className="px-3 py-1.5 rounded hover:bg-gray-100">Profile</Link>
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-3xl px-4 py-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
