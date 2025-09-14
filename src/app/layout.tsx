import type { Metadata } from "next";
import "./globals.css";
import styles from "./RootLayout.module.css";
import { Orbitron } from 'next/font/google';
import Navbar from "../components/Navbar";
import BalanceHeader from "../components/BalanceHeader";
import { SessionProvider } from "@/lib/sessionContext";
import { initGlobals } from "@/lib/initGlobals";
import Header from "@/components/Header";
const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const metadata: Metadata = {
  title: "Aik Casino",
  description: "Online Casino built with Next.js",
};

initGlobals();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className={orbitron.className}>
        <SessionProvider>
          <div className={styles.layoutContainer}>
            <Navbar />
            <div className={styles.headerAndMainContainer}>
              <Header />
              <main className={styles.main}>
                {children}
              </main>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
