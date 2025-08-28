"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/sessionContext";
import StartGameButton from "@/components/StartGameButton";
import { Range } from "react-range";
import styles from "./Dice.module.css";
import BetInput from "@/components/BetInput";

export default function DicePage() {
    const { balance, setBalanceUI } = useSession();

    const [betAmount, setBetAmount] = useState(1);
    const [targetNumber, setTargetNumber] = useState(50);

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

        // Example logic: win if roll <= targetNumber
        if (roll !== 0 && roll <= targetNumber) {
            const probability = (targetNumber + 1) / 101; // chance of winning
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
            <BetInput
                disabled={false}
                onChange={(value) => setBetAmount(value)}
            />
            <div className={styles.rangeWrapper}>
                <Range
                    step={1}
                    min={1}
                    max={100}
                    values={[targetNumber]}
                    onChange={(values) => setTargetNumber(values[0])}
                    renderTrack={({ props, children }) => {
                        const min = 1, max = 100;
                        const percentage = ((targetNumber - min) / (max - min)) * 100;
                        return (
                            <div
                                {...props}
                                className={styles.track}
                                style={{
                                    background: `linear-gradient(
                                    to right, 
                                    #0f0 ${percentage}%, 
                                    red ${percentage}%)`
                                }}
                            >
                                {children}
                            </div>
                        );
                    }}
                    renderThumb={({ props }) => {
                        const { key, ...restProps } = props;
                        return <div key={key} {...restProps} className={styles.thumb} />;
                    }}
                />
                <div>
                    Target Number: ≤ {targetNumber}
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
