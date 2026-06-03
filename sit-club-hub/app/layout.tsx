import type { Metadata } from "next";
import { Roboto, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { LanguageProvider } from "./contexts/LanguageContext";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const notoSansJP = Noto_Sans_JP({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "SIT Club Hub & AI Assistant",
  description: "Integrated Campus Life Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${notoSansJP.variable} font-sans bg-slate-50 min-h-screen flex flex-col text-slate-900`}>
        <LanguageProvider>
          <Navbar />
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}