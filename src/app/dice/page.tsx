"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/sessionContext";
import StartGameButton from "@/components/StartGameButton";
import { Range } from "react-range";
import styles from "./Dice.module.css";

export default function DicePage() {
    const { balance, setBalanceUI } = useSession();

    const [betAmount, setBetAmount] = useState(1);
    const [range, setRange] = useState<[number, number]>([1, 100]);

    const [rolledNumber, setRolledNumber] = useState<number | null>(null);
    const [result, setResult] = useState<string | null>(null);

    useEffect(() => {
        if (balance == null) return;

        if (betAmount > balance) setBetAmount(balance);
        if (balance === 0) setBetAmount(0);
    }, [balance]);

    function rollDice() {
        if (balance === null || betAmount < 1 || betAmount > balance) return;

        const roll = Math.floor(Math.random() * 101); // 0–100 inclusive
        setRolledNumber(roll);

        const [start, end] = range;

        // user can only select 1–100, but dice can roll 0
        if (roll !== 0 && roll >= start && roll <= end) {
            const probability = (end - start + 1) / 101; // 101 possible results: 0–100
            const payout = betAmount * (1 / probability) * 0.99;
            setResult(`You Win! Rolled ${roll}. Payout: $${payout.toFixed(2)}`);
            setBalanceUI(balance + payout - betAmount);
        } else {
            setResult(`You Lose. Rolled ${roll}`);
            setBalanceUI(balance - betAmount);
        }
    }

    return (
        <div className={styles.mainContent}>
            <h1 style={{ color: "red" }}>Work in progress, this is not finished!</h1>
            <div className="inputGroup">
                <input
                    id="betAmountInput"
                    type="number"
                    min={balance === 0 ? 0 : 1}
                    max={balance ?? 1}
                    value={betAmount}
                    onChange={(e) => {
                        let value = Number(e.target.value);
                        if (value < (balance === 0 ? 0 : 1)) value = (balance === 0 ? 0 : 1);
                        if (value > (balance ?? 0)) value = balance ?? 0;
                        setBetAmount(value);
                    }}
                />
                <label htmlFor="betAmountInput">Bet Amount</label>
            </div>

            <div className={styles.rangeWrapper}>
                <Range
                    step={1}
                    min={1}   // user can only pick 1–100
                    max={100}
                    values={range}
                    onChange={(values) => setRange([values[0], values[1]])}
                    renderTrack={({ props, children }) => {
                        const [min, max] = [1, 100];
                        const [start, end] = range;
                        return (
                            <div
                                {...props}
                                className={styles.track}
                                style={{
                                    background: `linear-gradient(
                                        to right,
                                        gray ${(start - min) / (max - min) * 100}%,
                                        #0f0 ${(start - min) / (max - min) * 100}%,
                                        #0f0 ${(end - min) / (max - min) * 100}%,
                                        gray ${(end - min) / (max - min) * 100}%
                                    )`
                                }}
                            >
                                {children}
                            </div>
                        );
                    }}
                    renderThumb={({ props, index }) => (
                        <div {...props} className={styles.thumb} key={`thumb-${index}`} />
                    )}
                />
                <div>
                    Range: {range[0]} – {range[1]}
                </div>
            </div>

            <StartGameButton
                text="Roll Dice"
                disabled={betAmount < 1 || balance === 0}
                onStartGame={rollDice}
            />

            {result && (
                <div className={styles.resultBox}>
                    <h2>{result}</h2>
                </div>
            )}
        </div>
    );
}
