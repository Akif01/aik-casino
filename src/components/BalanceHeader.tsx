"use client";

import styles from "./BalanceHeader.module.css"
import { useSession } from "@/lib/sessionContext";
import OverlayPanel from "./OverlayPanel";
import { useState } from "react";
import { topUpBalance } from "@/services/balanceRequesterService";

export default function BalanceHeader() {
    const { balance, refreshBalance } = useSession();
    const [showOverlay, setShowOverlay] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState<number>(1);
    const [topUpInProgress, setTopUpInProgress] = useState(false);

    function handleShowTopUpOverlay() {
        setShowOverlay(true);
    }

    function handleCloseTopUpOverlay() {
        setShowOverlay(false);
        setTopUpAmount(1);
    }

    function handleTopUpAmoundChange(e: React.ChangeEvent<HTMLInputElement>) {
        setTopUpAmount(Number(e.target.value));
    }

    async function handleTopUp() {
        const amount = topUpAmount;
        try {
            setTopUpInProgress(true);
            await topUpBalance(amount);
            refreshBalance();
            setTopUpInProgress(false);
        }
        catch (err) {

        }
        finally {
            setTopUpInProgress(false);
            handleCloseTopUpOverlay();
        }
    }

    function renderTopUpContent() {
        return (
            <div className={styles.topUpOverlayPanelChildrenContainer}>
                <div className="inputGroup">
                    <input
                        id="amount"
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder=""
                        value={topUpAmount}
                        onChange={handleTopUpAmoundChange}
                        disabled={topUpInProgress}
                    />
                    <label htmlFor="amount">Amount</label>
                </div>
                <button
                    className={styles.topUpOverlayPanelTopUpButton}
                    onClick={handleTopUp}
                    disabled={topUpInProgress}
                >
                    {topUpInProgress ? "Processing..." : "Top Up"}
                </button>
            </div>
        );
    }

    return (
        <div className={styles.balance}>
            <span className={styles.balanceText}>{balance !== null ? `Balance: $${balance.toFixed(2)}` : "Loading..."}</span>
            <button className={styles.topUpButton} title="Top Up Balance" onClick={handleShowTopUpOverlay}>
                <span className="material-symbols-outlined">credit_card</span>
            </button>
            {showOverlay && <OverlayPanel headerText="Top Up Blanace" onClose={handleCloseTopUpOverlay} children={renderTopUpContent()} />}
        </div>
    );
}
