"use client";

import { getBalance } from "@/services/balanceRequesterService";
import { initSession } from "@/services/sessionRequesterService";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SessionContextType {
    balance: number | null;
    setBalanceUI: (balance: number) => void;
}

const SessionContext = createContext<SessionContextType>({
    balance: null,
    setBalanceUI: () => { },
});

export function SessionProvider({ children }: { children: ReactNode }) {
    const [balance, setBalanceUI] = useState<number | null>(null);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                // The cookie is automatically sent, no sessionId required
                await initSession();
                const data = await getBalance();
                setBalanceUI(data.balance);
            } catch (err) {
                console.error("Failed to fetch balance", err);
            }
        };

        fetchBalance();
    }, []);

    return (
        <SessionContext.Provider value={{ balance, setBalanceUI }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    return useContext(SessionContext);
}
