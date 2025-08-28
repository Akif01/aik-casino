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
    const { sessionId, balance, setBalanceUI } = useSession();
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

        const data = await roll(sessionId!, guessedDiceNumber, betAmount);

        if (!data)
            return;

        setRolledDiceNumber(data.rolledDiceNumber);
        setGuessedDiceNumber(data.guessedDiceNumber);
        setMultiplier(data.multiplier);
        setCashout(data.cashout);

        await updateBalanceUI(sessionId!);

        console.log("Rolled game data:", data);
    }

    async function updateBalanceUI(sessionId: string) {
        const { balance } = await getBalance(sessionId);
        setBalanceUI(balance);
    }

    return (
        <div className={styles.mainContent}>
            <h1 style={{ color: "red" }}>Work in progress, this is not finished!</h1>
            <BetInput
                disabled={gameState === GameState.Playing}
                onChange={(value) => setBetAmount(value)}
            />
            <div className={styles.resultBox}>
                <span>Rolled: {rolledDiceNumber ?? "NaN"} </span>
                <span>Multiplier: {multiplier} </span>
                <span>Cashout: {cashout}</span>
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
                        const min = 1, max = 100;
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
                <div>
                    Target Number: Bigger than 1, equal or smaller than {guessedDiceNumber}
                </div>
            </div>

            <StartGameButton
                text="Roll Dice"
                disabled={gameState === GameState.Playing}
                onStartGame={rollDice}
            />
        </div>
    );
}
