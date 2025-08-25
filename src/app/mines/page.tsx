"use client";

import styles from "./Mines.module.css";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/sessionContext";
import { cashoutMinesGame, cellClickedMinesGame, startMinesGame } from "@/services/minesRequesterService";
import { getBalance } from "@/services/balanceRequesterService";
import { GameState } from "@/types/gameState";
import CashoutButton from "@/components/CashoutButton";
import StartGameButton from "@/components/StartGameButton";
export default function MinesPage() {

    const [gameId, setGameId] = useState<string | null>(null);
    const [revealed, setRevealed] = useState<Set<number>>(new Set());
    const [mines, setMines] = useState<Set<number>>(new Set());
    const [gameState, setGameState] = useState<GameState>(GameState.Waiting);

    const [pendingGridSize, setPendingGridSize] = useState(5);
    const [pendingMineAmount, setPendingMineAmount] = useState(1);

    const [cellMultipliers, setCellMultipliers] = useState<Record<number, number>>({});

    const [betAmount, setBetAmount] = useState(1);
    const [cashout, setCashout] = useState(0);

    const { sessionId, balance, setBalanceUI } = useSession();

    useEffect(() => {
        if (balance == null) return;

        if (betAmount > balance) {
            setBetAmount(balance);
        }

        if (balance === 0) {
            setBetAmount(0);
        }
    }, [balance]);

    async function startGame() {
        setRevealed(new Set());
        setMines(new Set());

        const data = await startMinesGame(
            sessionId!,
            pendingGridSize,
            pendingMineAmount,
            betAmount
        );

        if (!data)
            return;

        setGameId(data.gameId);
        setPendingGridSize(data.size);
        setPendingMineAmount(data.mineCount);
        setGameState(data.state);
        setCashout(data.cashout);

        console.log("Starting game with data:", data);
    }

    async function updateBalanceUI(sessionId: string) {
        const { balance } = await getBalance(sessionId);
        setBalanceUI(balance);
    }

    async function cashoutGame() {
        if (!gameId || gameState !== GameState.Playing) return;

        if (!sessionId) return;

        const result = await cashoutMinesGame(sessionId, gameId);
        if (!result) return;

        console.log("Cashout game with result:", result);

        updateBalanceUI(sessionId);
        setGameState(result.gameState);
        setCashout(result.cashout);
    }

    async function handleClick(index: number) {
        if (!sessionId || !gameId || gameState !== GameState.Playing) return;

        const data = await cellClickedMinesGame(sessionId, gameId, index);

        if (!data) return;

        setRevealed(new Set(data.revealed));

        if (data.gameState === GameState.Lost) {
            updateBalanceUI(sessionId);
            setMines(new Set(data.mines));
        }

        if (data.gameState === GameState.Won) {
            updateBalanceUI(sessionId);
        }

        setGameState(data.gameState);
        setCashout(data.cashout);

        setCellMultipliers(prev => ({
            ...prev,
            [index]: data.multiplier,
        }));
    }

    return (
        <div className={styles.mainContent}>
            <div className={styles.gridSettings}>
                <div className="inputGroup">
                    <input
                        id="gridSizeInput"
                        type="number"
                        min={5}
                        max={10}
                        disabled={gameState === GameState.Playing}
                        value={pendingGridSize}
                        onChange={(e) => {
                            let value = Number(e.target.value);
                            if (value < 5) value = 5;
                            if (value > 10) value = 10;
                            setPendingGridSize(value);
                        }}
                        required
                    />
                    <label htmlFor="gridSizeInput">Grid</label>
                </div>

                <div className="inputGroup">
                    <input
                        id="mineAmountInput"
                        type="number"
                        min={1}
                        max={pendingGridSize * pendingGridSize - 1}
                        disabled={gameState === GameState.Playing}
                        value={pendingMineAmount}
                        onChange={(e) => {
                            let value = Number(e.target.value);
                            if (value < 1) value = 1;
                            if (value > pendingGridSize * pendingGridSize - 1)
                                value = pendingGridSize * pendingGridSize - 1;
                            setPendingMineAmount(value);
                        }}
                        required
                    />
                    <label htmlFor="mineAmountInput">Mines</label>
                </div>

                <div className="inputGroup">
                    <input
                        id="betAmountInput"
                        type="number"
                        style={{ minWidth: "150px", maxWidth: "150px" }}
                        min={balance === 0 ? 0 : 1}
                        max={balance ?? 1} // fallback to 1
                        disabled={gameState === GameState.Playing}
                        value={betAmount}
                        onChange={(e) => {
                            let value = Number(e.target.value);
                            if (value < (balance === 0 ? 0 : 1)) value = (balance === 0 ? 0 : 1);
                            if (value > (balance ?? 0)) value = balance ?? 0;
                            setBetAmount(value);
                        }}
                        required
                    />
                    <label htmlFor="betAmountInput">Bet</label>
                </div>
                <StartGameButton
                    text="Start Mines"
                    disabled={gameState === GameState.Playing}
                    onStartGame={startGame}
                />
            </div>

            {(gameState === GameState.Playing) && (
                <CashoutButton
                    cashoutAmount={cashout}
                    disabled={gameState !== GameState.Playing}
                    onCashout={cashoutGame}
                />
            )}

            {(gameState === GameState.Won || gameState === GameState.Lost) && (
                <div className={styles.winMessage}>
                    <h2>{gameState === GameState.Won ? `You Win $${cashout}!` : "You hit a mine!"}</h2>
                </div>
            )}

            <div
                className={styles.grid}
                style={{ gridTemplateColumns: `repeat(${pendingGridSize}, 100px)` }}
            >
                {Array.from({ length: pendingGridSize * pendingGridSize }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handleClick(i)}
                        disabled={revealed.has(i) || gameState !== GameState.Playing}
                        className={`${styles.gridCell} 
                            ${revealed.has(i) ? styles.gridCellRevealed : ""} 
                            ${mines.has(i) ? styles.gridCellMineRevealed : ""}`}
                    >
                        {revealed.has(i) ? (
                            <span className={styles.multiplierText}>{cellMultipliers[i]}x</span>
                        ) : (
                            "")}
                    </button>
                ))}
            </div>
        </div>
    );
}
