"use client";

import { usePathname } from "next/navigation";
import { getCurrentPageName } from "./Navbar";
import styles from "./Header.module.css";
import BalanceHeader from "./BalanceHeader";

export default function Header() {
    const pathname = usePathname();
    const pageName = getCurrentPageName(pathname);

    return (
        <header className={styles.header}>
            <span className={styles.headerText}>{pageName}</span>
            <BalanceHeader />
        </header>
    );
}