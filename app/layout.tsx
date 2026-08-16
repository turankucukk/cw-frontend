import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeRegistry from "@/src/lib/theme/ThemeRegistry";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeskHere",
  description: "CreditWest Information Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeRegistry>
          {children}

          <Toaster
            position="top-left"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: "10px",
                padding: "14px 18px",
              },
            }}
          />
        </ThemeRegistry>
      </body>
    </html>
  );
}