import React from "react";
import styles from "./StartGameButton.module.css"

interface StartGameButtonProps {
    text: string;
    onStartGame: () => void;
    disabled: boolean;
}

export default function CashoutButton({ text, onStartGame, disabled }: StartGameButtonProps) {
    return (
        <button
            className={styles.startGameButton}
            onClick={onStartGame}
            disabled={disabled}
        >
            {text}
        </button>
    );
}