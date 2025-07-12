import { type Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Chat App - RK",
  description: "Built with Socket.io, Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header className="flex justify-end items-center p-4 gap-4 h-16 bg-slate-800 text-white border-b-[0.1px] border-b-gray-500">
            <SignedOut>
              <SignInButton>
                <button className="px-4 py-2 rounded-md bg-white text-cyan-500 hover:bg-gray-200 transition-colors hover:text-cyan-700">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="px-4 py-2 rounded-md bg-cyan-500 text-white hover:bg-cyan-600 transition-colors border-[1.5px] border-cyan-600">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
