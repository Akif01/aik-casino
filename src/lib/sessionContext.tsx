"use client";

import { getBalance } from "@/services/balanceRequesterService";
import { initSession } from "@/services/sessionRequesterService";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type SessionContextType = {
    balance: number | null;
    refreshBalance: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
    balance: null,
    refreshBalance: async () => { },
});

export function SessionProvider({ children }: { children: ReactNode }) {
    const [balance, setBalance] = useState<number | null>(null);

    const refreshBalance = async () => {
        try {
            await initSession();
            const data = await getBalance();
            setBalance(data.balance);
        } catch (err) {
        }
    };

    useEffect(() => {
        refreshBalance();
    }, []);

    return (
        <SessionContext.Provider value={{ balance, refreshBalance }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    return useContext(SessionContext);
}
