import type { Metadata } from "next";
import { Inter, Hanken_Grotesk } from "next/font/google";
import Sidebar from "../components/layout/sidebar";
import Header from "../components/layout/header";
import QueryProvider from "../components/providers/query-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "EventHub360 | Concierge Suite",
  description: "Enterprise Event Management Module",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${inter.variable} ${hanken.variable} antialiased bg-surface text-on-surface font-sans`}
      >
        <QueryProvider>
          <div className="min-h-screen">
            <Sidebar />
            <Header />
            <main className="ml-64 pt-24 px-container-margin pb-12 min-h-screen">
              <div className="max-w-[1440px] mx-auto">
                {children}
              </div>
            </main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
