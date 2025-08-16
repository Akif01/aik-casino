"use client";

import style from "./Mines.module.css";
import { useState } from "react";

type GameState = "waiting" | "playing" | "lost" | "won";

export default function MinesPage() {
    const mineCount = 3;

    const [gameId, setGameId] = useState<string | null>(null);
    const [revealed, setRevealed] = useState<Set<number>>(new Set());
    const [mines, setMines] = useState<Set<number>>(new Set());
    const [gameState, setGameState] = useState<GameState>("waiting");
    const [gridSize, setGridSize] = useState(5); // default 5x5

    const startEndpoint = "/api/mines/start";
    const clickEndpoint = "/api/mines/click";

    async function startGame() {
        setRevealed(new Set());
        setMines(new Set());
        setGameState("playing");

        const res = await fetch(startEndpoint, {
            method: "POST",
            body: JSON.stringify({ gridSize, mineCount }),
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
        <div className={style.mainContent}>
            <div className={style.gridSettings}>
                <label htmlFor="gridSizeInput">Grid Size</label>
                <input name="gridSizeInput"
                    type="number"
                    min="5"
                    max="10"
                    disabled={gameState === "playing"}
                    value={gridSize}
                    onChange={(e) => setGridSize(Number(e.target.value))}
                />
                <button disabled={gameState === "playing"} onClick={startGame} className={style.startButton}>
                    Start Game
                </button>
            </div>
            {gameState === "won" || gameState === "lost" && (
                // win UI
                <div></div>
            )}
            {gameState !== "waiting" && (
                <div className={style.grid}
                    style={{ gridTemplateColumns: `repeat(${gridSize}, 100px)` }}>
                    {Array.from({ length: gridSize * gridSize }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handleClick(i)}
                            disabled={revealed.has(i) || gameState !== "playing"}
                            className={`${style.gridCell} 
                                ${revealed.has(i) ? style.gridCellRevealed : " "} 
                                ${mines.has(i) ? style.gridCellMineRevealed : " "}`}
                        >
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
