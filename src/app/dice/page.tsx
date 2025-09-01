"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/sessionContext";
import StartGameButton from "@/components/StartGameButton";
import { Range } from "react-range";
import styles from "./Dice.module.css";
import BetInput from "@/components/BetInput";
import { roll } from "@/services/diceRequesterService";
import { GameState } from "@/types/gameState";
import { getBalance } from "@/services/balanceRequesterService";

export default function DicePage() {
    const { balance, setBalanceUI } = useSession();

    const [betAmount, setBetAmount] = useState(1);
    const [guessedDiceNumber, setGuessedDiceNumber] = useState(50);
    const [rolledDiceNumber, setRolledDiceNumber] = useState<number | null>(null);
    const [cashout, setCashout] = useState<number>(0);
    const [multiplier, setMultiplier] = useState<number>(0);
    const [gameState, setGameState] = useState<GameState>(GameState.Waiting);

    useEffect(() => {
        if (balance == null) return;

        if (betAmount > balance) setBetAmount(balance);
        if (balance === 0) setBetAmount(0);
    }, [balance]);

    async function rollDice() {
        if (balance === null || betAmount < 0 || betAmount > balance) return;

        try {
            const data = await roll(guessedDiceNumber, betAmount);

            if (!data)
                return;

            setGameState(data.state);
            setRolledDiceNumber(data.rolledDiceNumber);
            setGuessedDiceNumber(data.guessedDiceNumber);
            setMultiplier(Number(data.multiplier.toFixed(2)));
            setCashout(Number(data.cashout.toFixed(2)));

            await updateBalanceUI();

            console.log("Rolled game data:", data);
        }
        catch (err) {
            console.error("Failed to roll :", err);
            alert("Could not roll. Please try again.");
        }
    }

    async function updateBalanceUI() {
        const { balance } = await getBalance();
        setBalanceUI(balance);
    }

    return (
        <div className={styles.mainContent}>
            <div className="gameSettings">
                <BetInput
                    disabled={gameState === GameState.Playing}
                    onChange={(value) => setBetAmount(value)}
                />
                <StartGameButton
                    text="Roll Dice"
                    disabled={gameState === GameState.Playing}
                    onStartGame={rollDice}
                />
            </div>
            <div className={styles.resultWrapper}>
                <div className="resultBox">
                    <span>Rolled: {rolledDiceNumber ?? "---"} </span>
                </div>
                <div className="resultBox">
                    <span>Multiplier: {multiplier}x </span>
                </div>
                <div className="resultBox">
                    <span>Cashout: ${cashout}</span>
                </div>
            </div>
            <div className={styles.rangeWrapper}>
                <Range
                    disabled={gameState === GameState.Playing}
                    step={1}
                    min={1}
                    max={100}
                    values={[guessedDiceNumber]}
                    onChange={(values) => setGuessedDiceNumber(values[0])}
                    renderTrack={({ props, children }) => {
                        const min = 0, max = 99;
                        const percentage = ((guessedDiceNumber - min) / (max - min)) * 100;
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
            </div>
        </div>
    );
}
