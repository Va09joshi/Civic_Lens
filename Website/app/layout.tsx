import "./globals.css";
import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { Noto_Sans } from "next/font/google";

const googleSansStyle = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata = {
  title: "CivicLens",
  description: "Civic Issue + News Platform",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={googleSansStyle.className}>
      <body className="relative min-h-screen bg-background">
        <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.1] bg-[url('/map-pattern.svg')] bg-[length:720px_auto] bg-repeat" />
        <div className="relative z-10">
          <ScrollToTop />
          <Navbar />
          <main className="min-h-screen p-4 md:p-8 bg-background/88">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
