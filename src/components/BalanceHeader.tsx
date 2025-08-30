"use client";

import style from "./BalanceHeader.module.css"
import { useSession } from "@/lib/sessionContext";

export default function BalanceHeader() {
    const { balance, setBalanceUI } = useSession();

    return (
        <div className={style.balance}>
            {balance !== null ? `Balance: $${balance.toFixed(2)}` : "Loading..."}
        </div>
    );
}
