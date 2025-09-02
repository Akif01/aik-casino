import React from "react";
import styles from "./CashoutButton.module.css"

type CashoutButtonProps = {
    cashoutAmount: number;
    onCashout: () => void;
    disabled: boolean;
}

export default function CashoutButton({ cashoutAmount, onCashout, disabled }: CashoutButtonProps) {
    return (
        <button
            className={styles.cashoutButton}
            onClick={onCashout}
            disabled={disabled}
        >
            Cashout ${cashoutAmount.toFixed(2)}
        </button>
    );
}