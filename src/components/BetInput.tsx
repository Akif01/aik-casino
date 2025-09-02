"use client";

import { useSession } from "@/lib/sessionContext";
import { useEffect, useState } from "react";


type BetInputProps = {
    disabled: boolean;
    onChange?: (value: number) => void;
}

export default function BetInput({ disabled, onChange }: BetInputProps) {
    const { balance, setBalanceUI } = useSession();
    const [betAmount, setBetAmount] = useState(1);

    useEffect(() => {
        if (balance == null) return;
        let newBetAmount = betAmount;
        if (betAmount > balance) {
            newBetAmount = Number(balance.toFixed(2));
        } else if (balance === 0) {
            newBetAmount = Number(0);
        }

        setBetAmount(newBetAmount);
        onChange?.(newBetAmount);
    }, [balance]);

    return (
        <div className="inputGroup">
            <input
                id="betAmountInput"
                type="number"
                style={{ minWidth: "150px", maxWidth: "150px" }}
                min={0}
                max={balance ?? 0}
                disabled={disabled}
                value={betAmount}
                onChange={(e) => {
                    let value = Number(e.target.value);
                    if (value < 0) value = 0;
                    if (value > (balance ?? 0)) value = Number(balance?.toFixed(2)) ?? 0;
                    setBetAmount(value);
                    onChange?.(value);
                }}
                required
            />
            <label htmlFor="betAmountInput">Bet</label>
        </div>
    );
}
