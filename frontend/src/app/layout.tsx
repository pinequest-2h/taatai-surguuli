import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "../components/providers/AppoloWrapper";
import { AuthProvider } from "@/context/AuthContext";
import LayoutWrapper from "@/components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Psychology Platform",
  description: "A platform for children and psychologists to connect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="calm-bg" aria-hidden="true">
          <div className="calm-blob calm-blob--blue" style={{ top: '-8rem', left: '-6rem' }} />
          <div className="calm-blob calm-blob--green" style={{ top: '20%', right: '-10rem', animationDelay: '2s' }} />
          <div className="calm-blob calm-blob--pink" style={{ bottom: '-10rem', left: '20%', animationDelay: '4s' }} />
          <div className="calm-noise" />
        </div>
        <ApolloWrapper>
          <AuthProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
