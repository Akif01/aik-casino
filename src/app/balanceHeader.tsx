"use client";

import { useEffect, useState } from "react";
import { getBalance } from "@/services/balanceService";
import style from "./BalanceHeader.module.css"
import { useSession } from "@/lib/sessionContext";

export default function BalanceHeader() {
    const { sessionId, balance, setBalanceUI } = useSession();

    return (
        <div className={style.balance}>
            {balance !== null ? `Balance: $${balance.toFixed(2)}` : "Loading..."}
        </div>
    );
}
