"use client";
import styles from "./Mines.module.css"
import { useState } from "react";

type Cell = {
    id: number;
    isMine: boolean;
    revealed: boolean;
};

export default function Mines() {
    const [grid, setGrid] = useState<Cell[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [amountOfMines, setAmountOfMines] = useState(2);

    const initGame = () => {
        const cells: Cell[] = [];
        const mineIndices = new Set<number>();

        while (mineIndices.size < amountOfMines) {
            mineIndices.add(Math.floor(Math.random() * 25));
        }

        for (let i = 0; i < 25; i++) {
            cells.push({
                id: i,
                isMine: mineIndices.has(i),
                revealed: false,
            });
        }

        setGrid(cells);
        setGameOver(false);
        setWon(false);
    };

    const handleClick = (id: number) => {
        if (gameOver || won) return;

        setGrid((prev) =>
            prev.map((cell) =>
                cell.id === id ? { ...cell, revealed: true } : cell
            )
        );

        const clicked = grid.find((c) => c.id === id);
        if (clicked && clicked.isMine) {
            setGameOver(true);
            return;
        }

        // check for win
        const totalSafeCells = grid.filter((c) => !c.isMine).length;
        const revealedSafeCells = grid.filter(
            (c) => !c.isMine && (c.id === id ? true : c.revealed)
        ).length;

        if (revealedSafeCells === totalSafeCells) {
            setWon(true);
        }
    };

    if (grid.length === 0) initGame();

    return (
        <div>
            <div className={styles.grid}>
                {grid.map((cell) => (
                    <button
                        key={cell.id}
                        onClick={() => handleClick(cell.id)}
                        disabled={cell.revealed || gameOver || won}
                        className={styles.gridCell}
                    >
                        {cell.revealed ? (cell.isMine ? "💣" : "✅") : ""}
                    </button>
                ))}
            </div>

            {(gameOver || won) && (
                <div>
                    {gameOver && <p>Busted! 💥</p>}
                    {won && <p>You Win! 🎉</p>}
                    <button onClick={initGame}>Restart</button>
                </div>
            )}
        </div>
    );
}
