"use client";

import { useEffect, useState } from "react";
import { getBalance } from "@/services/balanceService";
import style from "./BalanceHeader.module.css"

export default function BalanceHeader() {
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        const storedSession = localStorage.getItem("sessionId");

        async function fetchBalance() {
            const data = await getBalance(storedSession || undefined);
            setBalance(data.balance);
            localStorage.setItem("sessionId", data.sessionId);
        }

        fetchBalance();
    }, []);

    return (
        <div className={style.balance}>
            {balance !== null ? `Balance: $${balance}` : "Loading..."}
        </div>
    );
}
