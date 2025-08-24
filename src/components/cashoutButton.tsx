import React from "react";
import styles from "./CashoutButton.module.css"

interface CashoutButtonProps {
    cashoutAmount: number;
    onCashout: () => void;
    disabled: boolean;
}

const CashoutButton: React.FC<CashoutButtonProps> = ({ cashoutAmount, onCashout, disabled }) => {
    return (
        <button
            className={styles.cashoutButton}
            onClick={onCashout}
            disabled={disabled}
        >
            Cashout ${cashoutAmount.toFixed(2)}
        </button>
    );
};

export default CashoutButton;