import React from "react";
import styles from "./StartGameButton.module.css"

interface StartGameButtonProps {
    onStartGame: () => void;
    disabled: boolean;
}

export default function CashoutButton({ onStartGame, disabled }: StartGameButtonProps) {
    return (
        <button
            className={styles.startGameButton}
            onClick={onStartGame}
            disabled={disabled}
        >
            Start Game
        </button>
    );
}