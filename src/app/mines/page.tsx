"use client";

import styles from "./Mines.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "@/lib/sessionContext";
import { cashoutMinesGame, cellClickedMinesGame, startMinesGame } from "@/services/minesRequesterService";
import { getBalance } from "@/services/balanceRequesterService";
import { GameState } from "@/types/gameState";
import CashoutButton from "@/components/CashoutButton";
import StartGameButton from "@/components/StartGameButton";
import BetInput from "@/components/BetInput";
export default function MinesPage() {

    const { balance, setBalanceUI } = useSession();

    const [gameId, setGameId] = useState<string | null>(null);
    const [revealed, setRevealed] = useState<Set<number>>(new Set());
    const [mines, setMines] = useState<Set<number>>(new Set());
    const [gameState, setGameState] = useState<GameState>(GameState.Waiting);

    const [pendingGridSize, setPendingGridSize] = useState(5);
    const [pendingMineAmount, setPendingMineAmount] = useState(1);

    const [cellMultipliers, setCellMultipliers] = useState<Record<number, number>>({});

    const [betAmount, setBetAmount] = useState(1);
    const [cashout, setCashout] = useState(0);

    useEffect(() => {
        if (balance == null) return;

        if (betAmount > balance) {
            setBetAmount(Number(balance.toFixed(2)));
        }

        if (balance === 0) {
            setBetAmount(0);
        }
    }, [balance]);

    const resetRevealedAndMines = () => {
        setRevealed(new Set());
        setMines(new Set());
    };

    useEffect(() => {
        const maxMines = pendingGridSize * pendingGridSize - 1;
        if (pendingMineAmount > maxMines) {
            setPendingMineAmount(maxMines);
        }
    }, [pendingGridSize, pendingMineAmount]);

    async function startGame() {
        if (gameState === GameState.Playing) return;

        try {
            resetRevealedAndMines();

            const data = await startMinesGame(
                pendingGridSize,
                pendingMineAmount,
                betAmount
            );

            setGameId(data.gameId);
            setPendingGridSize(data.size);
            setPendingMineAmount(data.mineCount);
            setGameState(data.state);
            setCashout(data.cashout);

        } catch (err) {
            alert("Could not start game. Please try again.");
        }
    }

    async function updateBalanceUI() {
        const { balance } = await getBalance();
        setBalanceUI(balance);
    }

    async function cashoutGame() {
        if (!gameId || gameState !== GameState.Playing) return;

        try {
            const result = await cashoutMinesGame(gameId);

            updateBalanceUI();
            setGameState(result.gameState);
            setCashout(result.cashout);
        } catch (err) {
            alert("Cashout failed. Please try again.");
        }
    }

    async function handleClick(index: number) {
        if (!gameId || gameState !== GameState.Playing) return;

        try {
            const data = await cellClickedMinesGame(gameId, index);

            setRevealed(new Set(data.revealed));

            if (data.gameState === GameState.Lost) {
                updateBalanceUI();
                setMines(new Set(data.mines));
            }

            if (data.gameState === GameState.Won) {
                updateBalanceUI();
            }

            setGameState(data.gameState);
            setCashout(data.cashout);

            setCellMultipliers(prev => ({
                ...prev,
                [index]: Number(data.multiplier.toFixed(2)),
            }));
        } catch (err) {
            alert("Something went wrong. Please try again.");
        }
    }

    const handleGridChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let value = Math.min(10, Math.max(5, Number(e.target.value)));
        setPendingGridSize(value);
        if (gameState === GameState.Lost || gameState === GameState.Won) {
            resetRevealedAndMines();
        }
    }, [gameState]);

    const handleMineAmountChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            let value = Number(e.target.value);
            if (value < 1) value = 1;
            const maxMines = pendingGridSize * pendingGridSize - 1;
            if (value > maxMines) value = maxMines;
            setPendingMineAmount(value);
        }, [pendingGridSize]);

    const grid = useMemo(() => {
        const cells = Array.from({ length: pendingGridSize * pendingGridSize }, (_, i) => (
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
                ) : ("")}
            </button>
        ));
        return cells;
    }, [pendingGridSize, revealed, mines, gameState, cellMultipliers]);

    return (
        <div className={styles.mainContent}>
            <div className="gameSettings">
                <div className="inputGroup">
                    <input
                        id="gridSizeInput"
                        type="number"
                        min={5}
                        max={10}
                        disabled={gameState === GameState.Playing}
                        value={pendingGridSize}
                        onChange={handleGridChange}
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
                        onChange={handleMineAmountChange}
                        required
                    />
                    <label htmlFor="mineAmountInput">Mines</label>
                </div>
                <BetInput
                    disabled={gameState === GameState.Playing}
                    onChange={(value) => setBetAmount(value)}
                />
                <StartGameButton
                    text="Start Mines"
                    disabled={gameState === GameState.Playing}
                    onStartGame={startGame}
                />
                <CashoutButton
                    cashoutAmount={cashout}
                    disabled={gameState !== GameState.Playing}
                    onCashout={cashoutGame}
                />
            </div>
            {(gameState === GameState.Won || gameState === GameState.Lost) && (
                <div className="resultBox">
                    <span className={gameState === GameState.Won ? styles.wonText : styles.lostText}>
                        {gameState === GameState.Won
                            ? `You Win $${cashout.toFixed(2)}!`
                            : "You hit a mine!"}
                    </span>
                </div>
            )}
            <div
                className={styles.grid}
                style={{ gridTemplateColumns: `repeat(${pendingGridSize}, 100px)` }}
            >
                {grid}
            </div>
        </div>
    );
}
