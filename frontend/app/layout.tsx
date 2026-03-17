import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppHeader from "@/app/components/AppHeader";
import IdleLogoutWrapper from "./IdleLogoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Fitness Tracker",
  description: "Track workout sessions, exercises, and sets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <IdleLogoutWrapper>
          <AppHeader />
          {children}
        </IdleLogoutWrapper>
      </body>
    </html>
  );
}
