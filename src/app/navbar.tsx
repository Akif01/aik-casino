"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./RootLayout.module.css";

const navItems = [
    { icon: "home", label: "Home", href: "/" },
    { icon: "bomb", label: "Mines", href: "/mines" },
    { icon: "castle", label: "Tower", href: "/tower" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className={styles.navbar}>
            <span className={styles.navbarHeader}>Aik Casino</span>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navbarItem} ${pathname === item.href ? styles.navbarItemActive : ""}`}
                >
                    <span className="material-symbols-outlined">
                        {item.icon}
                    </span>
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}
