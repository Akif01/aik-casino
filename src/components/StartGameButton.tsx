import React, { useState } from "react";
import styles from "./StartGameButton.module.css"

interface StartGameButtonProps {
    text: string;
    onStartGame: () => Promise<void> | void;
    disabled: boolean;
}

export default function CashoutButton({ text, onStartGame, disabled }: StartGameButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const onClicked = async () => {
        try {
            setIsLoading(true);
            await onStartGame();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            className={styles.startGameButton}
            onClick={onClicked}
            disabled={disabled || isLoading}
        >
            {isLoading ? "Loading..." : text}
        </button>
    );
}