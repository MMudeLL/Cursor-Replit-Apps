import "./globals.css";
import { DeepgramContextProvider } from "../lib/contexts/DeepgramContext";

export const metadata = {
  title: "Doctor Notes - Voice to Text App",
  description: "Transcribe real-time conversations between doctors and patients",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <DeepgramContextProvider>
          {children}
        </DeepgramContextProvider>
      </body>
    </html>
  );
}
