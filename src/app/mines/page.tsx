"use client";

import style from "./Mines.module.css";
import { useState } from "react";

type GameState = "playing" | "lost" | "won";

export default function MinesPage() {
    const size = 5; // 5x5 board
    const mineCount = 3;

    const [gameId, setGameId] = useState<string | null>(null);
    const [revealed, setRevealed] = useState<Set<number>>(new Set());
    const [mines, setMines] = useState<Set<number>>(new Set());
    const [gameState, setGameState] = useState<GameState>("playing");

    const startEndpoint = "/api/mines/start";
    const clickEndpoint = "/api/mines/click";

    async function startGame() {
        setRevealed(new Set());
        setMines(new Set());
        setGameState("playing");

        const res = await fetch(startEndpoint, {
            method: "POST",
            body: JSON.stringify({ size, mineCount }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        setGameId(data.gameId);
    }

    async function handleClick(index: number) {
        if (!gameId || gameState !== "playing") return;

        const res = await fetch(clickEndpoint, {
            method: "POST",
            body: JSON.stringify({ gameId, cell: index }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (data.result === "mine") {
            setRevealed((prev) => new Set([...prev, index]));
            setMines(new Set([...mines, index]));
            setGameState("lost");
        } else {
            setRevealed(new Set(data.revealed));
            if (data.hasWon) {
                setGameState("won");
            }
        }
    }

    return (
        <div>
            {!gameId ? (
                <button onClick={startGame} className={style.startButton}>
                    Start Game
                </button>
            ) : (
                <>
                    <div className={style.grid}>
                        {Array.from({ length: size * size }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handleClick(i)}
                                disabled={revealed.has(i) || gameState !== "playing"}
                                className={style.gridCell}
                            >
                                {revealed.has(i)
                                    ? mines.has(i)
                                        ? "💣"
                                        : "✅"
                                    : ""}
                            </button>
                        ))}
                    </div>

                    {gameState !== "playing" && (
                        <div style={{ marginTop: "20px" }}>
                            <h2>
                                {gameState === "lost"
                                    ? "You hit a mine!"
                                    : "You win!"}
                            </h2>
                            <button onClick={startGame} className={style.restartButton}>
                                Restart
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
