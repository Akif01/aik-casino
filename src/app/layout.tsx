import type { Metadata } from "next";
import "./globals.css";
import styles from "./RootLayout.module.css";
import { Orbitron } from 'next/font/google';
import Navbar from "./navbar";
import BalanceHeader from "./balanceHeader";

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const metadata: Metadata = {
  title: "Aik Casino",
  description: "Online Casino built with Next.js",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={orbitron.className}>
        <header className={styles.header}>
          <div>Aik Casino - Built by Akif</div>
          <BalanceHeader />
        </header>

        <div className={styles.navbarMainWrapper}>
          <Navbar />
          <main className={styles.main}>
            {children}
          </main>
        </div>

        <footer className={styles.footer}>
          Casino Footer
        </footer>
      </body>
    </html>
  );
}
