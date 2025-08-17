"use client";
import { getSessionId } from "@/services/sessionService";
import { getBalance } from "@/services/balanceService";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SessionContextType {
    sessionId: string | null;
    setSessionId: (id: string) => void;
    balance: number | null;
    setBalanceUI: (balance: number) => void;
}

const SessionContext = createContext<SessionContextType>({
    sessionId: null,
    setSessionId: () => { },
    balance: null,
    setBalanceUI: () => { },
});

export function SessionProvider({ children }: { children: ReactNode }) {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        const initSession = async () => {
            let storedSession = localStorage.getItem("sessionId");

            if (!storedSession) {
                const { sessionId } = await getSessionId();
                localStorage.setItem("sessionId", sessionId);
                setSessionId(sessionId);

                // fetch initial balance
                const data = await getBalance(sessionId);
                setBalance(data.balance);
            } else {
                setSessionId(storedSession);

                // fetch balance for stored session
                const data = await getBalance(storedSession);
                setBalance(data.balance);
            }
        };

        initSession();
    }, []);

    return (
        <SessionContext.Provider value={{ sessionId, setSessionId, balance, setBalanceUI: setBalance }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    return useContext(SessionContext);
}
