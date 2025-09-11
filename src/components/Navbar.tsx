"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const navItems = [
    { icon: "home", label: "Home", href: "/" },
    { icon: "bomb", label: "Mines", href: "/mines" },
    { icon: "casino", label: "Dice", href: "/dice" },
    { icon: "castle", label: "Tower", href: "/tower" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className={styles.navbar}>
            <span className={styles.navbarHeader}>
                <span className={styles.navbarHeaderShort}>AC</span>
                <span className={styles.navbarHeaderFull}>Aik Casino</span>
            </span>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navbarItem} ${pathname === item.href ? styles.navbarItemActive : ""}`}
                >
                    <span className={`${styles.navbarItemIcon} material-symbols-outlined`}>
                        {item.icon}
                    </span>
                    <span className={styles.navbarItemLabel}>{item.label}</span>
                </Link>
            ))}
        </nav>
    );
}
