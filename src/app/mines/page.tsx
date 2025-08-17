"use client";

import { getBalance, updateBalance } from "@/services/balanceService";
import style from "./Mines.module.css";
import { useEffect, useState } from "react";
import { getSessionId } from "@/services/sessionService";
import { useSession } from "@/lib/sessionContext";

type GameState = "waiting" | "playing" | "lost" | "won";

export default function MinesPage() {
    const startEndpoint = "/api/mines/start";
    const clickEndpoint = "/api/mines/click";

    const [gameId, setGameId] = useState<string | null>(null);
    const [revealed, setRevealed] = useState<Set<number>>(new Set());
    const [mines, setMines] = useState<Set<number>>(new Set());
    const [gameState, setGameState] = useState<GameState>("waiting");

    const [gridSize, setGridSize] = useState(5);
    const [pendingGridSize, setPendingGridSize] = useState(5); // editable value

    const [mineAmount, setMineAmount] = useState(1);
    const [pendingMineAmount, setPendingMineAmount] = useState(1); // editable value

    const [multiplier, setMultiplier] = useState(0);

    const [betAmount, setBetAmount] = useState(1);
    const [cashout, setCashout] = useState(0);

    const { sessionId, balance, setBalanceUI } = useSession();

    async function startGame() {
        setRevealed(new Set());
        setMines(new Set());

        const res = await fetch(startEndpoint, {
            method: "POST",
            body: JSON.stringify({ size: pendingGridSize, mineCount: pendingMineAmount, betAmount: betAmount }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        setGameId(data.gameId);
        setGridSize(data.size);
        setMineAmount(data.mineCount);
        setGameState(data.state); // use server state

        console.log("Starting game with data:", data);

    }

    async function cashoutGame() {
        if (!gameId || gameState !== "playing") return;

        if (!sessionId) return;

        const { balance } = await updateBalance(sessionId, cashout);
        setBalanceUI(balance);
        setGameState("won");

        console.log("Cashout game with cashout:" + cashout);
    }

    async function handleClick(index: number) {
        if (!gameId || gameState !== "playing") return;

        if (!sessionId) return;

        const res = await fetch(clickEndpoint, {
            method: "POST",
            body: JSON.stringify({ gameId, cell: index }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        setRevealed(new Set(data.revealed));

        if (data.state === "lost") {
            setMines(prev => new Set([...prev, index]));
            const { balance } = await updateBalance(sessionId, -data.betAmount);
            setBalanceUI(balance);
        }

        if (data.state === "won") {
            const { balance } = await updateBalance(sessionId, data.betAmount);
            setBalanceUI(balance);
        }

        setGameState(data.state);
        setMultiplier(data.multiplier);
        setCashout(data.cashout);

        console.log("Click with data:", data);
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
                    <label htmlFor="gridSizeInput">Grid Size</label>
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
                        min={1}
                        max={balance!}
                        disabled={gameState === "playing"}
                        value={betAmount}
                        onChange={(e) => {
                            let value = Number(e.target.value);

                            if (value < 1) value = 1;
                            if (value > balance!) value = balance!;
                            console.log("BetAmountInput:" + betAmount);
                            console.log("BetAmountInput_Balance:" + balance);
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
                    <div>
                        Multiplier: {multiplier}x
                    </div>
                    <button
                        disabled={gameState !== "playing"}
                        onClick={cashoutGame}
                    >
                        Cashout ${cashout}
                    </button>
                </>

            )}
            {(gameState === "won" || gameState === "lost") && (
                <div className={style.winMessage}>
                    <h2>{gameState === "won" ? "You Win!" : "You hit a mine!"}</h2>
                </div>
            )}

            {gameState !== "waiting" && (
                <div
                    className={style.grid}
                    style={{ gridTemplateColumns: `repeat(${gridSize}, 100px)` }}
                >
                    {Array.from({ length: gridSize * gridSize }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handleClick(i)}
                            disabled={revealed.has(i) || gameState !== "playing"}
                            className={`${style.gridCell} 
                                ${revealed.has(i) ? style.gridCellRevealed : ""} 
                                ${mines.has(i) ? style.gridCellMineRevealed : ""}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
