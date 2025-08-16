"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./RootLayout.module.css";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Mines", href: "/mines" },
    { label: "Tower", href: "/tower" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className={styles.navbar}>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navbarItem} ${pathname === item.href ? styles.navbarItemActive : ""}`}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}
