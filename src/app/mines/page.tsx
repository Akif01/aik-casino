"use client";

import style from "./Mines.module.css";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/sessionContext";
import { cashoutMinesGame, cellClickedMinesGame, startMinesGame } from "@/services/minesRequesterService";
import { getBalance } from "@/services/balanceRequesterService";

export default function MinesPage() {

    const [gameId, setGameId] = useState<string | null>(null);
    const [revealed, setRevealed] = useState<Set<number>>(new Set());
    const [mines, setMines] = useState<Set<number>>(new Set());
    const [gameState, setGameState] = useState<GameState>("waiting");

    const [pendingGridSize, setPendingGridSize] = useState(5); // editable value
    const [pendingMineAmount, setPendingMineAmount] = useState(1); // editable value

    const [multiplier, setMultiplier] = useState(0);
    const [cellMultipliers, setCellMultipliers] = useState<Record<number, number>>({});

    const [betAmount, setBetAmount] = useState(1);
    const [cashout, setCashout] = useState(0);

    const { sessionId, balance, setBalanceUI } = useSession();

    useEffect(() => {
        if (balance == null) return;

        // if current bet is higher than balance, reset it
        if (betAmount > balance) {
            setBetAmount(balance);
        }

        // if balance is zero, force bet to zero
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
        setMultiplier(data.multiplier);

        console.log("Starting game with data:", data);
    }

    async function updateBalanceUI(sessionId: string) {
        const { balance } = await getBalance(sessionId);
        setBalanceUI(balance);
    }

    async function cashoutGame() {
        if (!gameId || gameState !== "playing") return;

        if (!sessionId) return;

        const { cashout, state } = await cashoutMinesGame(sessionId, gameId);
        updateBalanceUI(sessionId);
        setGameState(state);
    }

    async function handleClick(index: number) {
        if (!sessionId || !gameId || gameState !== "playing") return;

        if (!sessionId) return;

        const data = await cellClickedMinesGame(sessionId, gameId, index);
        setRevealed(new Set(data.revealed));

        if (data.state === "lost") {
            updateBalanceUI(sessionId);
            setMines(prev => new Set([...prev, index]));
        }

        if (data.state === "won") {
            updateBalanceUI(sessionId);
        }

        setGameState(data.state);
        setMultiplier(data.multiplier);
        setCashout(data.cashout);

        setCellMultipliers(prev => ({
            ...prev,
            [index]: data.multiplier,
        }));
    }

    return (
        <div className={style.mainContent}>
            <div className={style.gridSettings}>
                <div className="inputGroup">
                    <input
                        id="gridSizeInput"
                        type="number"
                        min={5}
                        max={10}
                        disabled={gameState === "playing"}
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
                        disabled={gameState === "playing"}
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
                        disabled={gameState === "playing"}
                        value={Math.round(betAmount)}
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

                <button
                    disabled={gameState === "playing"}
                    onClick={startGame}
                    className={style.startButton}
                >
                    Start Game
                </button>
            </div>

            {(gameState === "playing") && (
                <>
                    <button
                        disabled={gameState !== "playing"}
                        onClick={cashoutGame}
                    >
                        Cashout ${cashout}
                    </button>
                    <div>
                        Multiplier: {multiplier}x
                    </div>
                </>

            )}
            {(gameState === "won" || gameState === "lost") && (
                <div className={style.winMessage}>
                    <h2>{gameState === "won" ? "You Win!" : "You hit a mine!"}</h2>
                </div>
            )}

            <div
                className={style.grid}
                style={{ gridTemplateColumns: `repeat(${pendingGridSize}, 100px)` }}
            >
                {Array.from({ length: pendingGridSize * pendingGridSize }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handleClick(i)}
                        disabled={revealed.has(i) || gameState !== "playing"}
                        className={`${style.gridCell} 
                            ${revealed.has(i) ? style.gridCellRevealed : ""} 
                            ${mines.has(i) ? style.gridCellMineRevealed : ""}`}
                    >
                        {revealed.has(i) ? (
                            <span className={style.multiplierText}>{cellMultipliers[i]}x</span>
                        ) : (
                            "")}
                    </button>
                ))}
            </div>
        </div>
    );
}
