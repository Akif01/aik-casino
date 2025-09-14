"use client";
import styles from "./BalanceHeader.module.css"
import { useSession } from "@/lib/sessionContext";
import OverlayPanel from "./OverlayPanel";
import { useState, useEffect, useRef } from "react";
import { topUpBalance } from "@/services/balanceRequesterService";

export default function BalanceHeader() {
    const { balance, refreshBalance } = useSession();
    const [showOverlay, setShowOverlay] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState<number>(1);
    const [topUpInProgress, setTopUpInProgress] = useState(false);

    // Animation states
    const [displayBalance, setDisplayBalance] = useState<number | null>(balance);
    const [floatingAmount, setFloatingAmount] = useState<number | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const animationRef = useRef<number | null>(null);
    const prevBalanceRef = useRef<number | null>(balance);

    useEffect(() => {
        if (balance !== null && prevBalanceRef.current !== null && balance !== prevBalanceRef.current) {
            const difference = balance - prevBalanceRef.current;
            if (difference !== 0) {
                setFloatingAmount(difference);
                setIsAnimating(true);

                animateBalanceCount(prevBalanceRef.current, balance);

                setTimeout(() => {
                    setFloatingAmount(null);
                    setIsAnimating(false);
                }, 2000);
            } else {
                setDisplayBalance(balance);
            }
        } else if (balance !== null) {
            setDisplayBalance(balance);
        }

        prevBalanceRef.current = balance;
    }, [balance]);

    const animateBalanceCount = (startValue: number, endValue: number) => {
        const duration = 1500; // 1.5 seconds
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (endValue - startValue) * easeOut;

            setDisplayBalance(currentValue);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayBalance(endValue);
            }
        };

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        animationRef.current = requestAnimationFrame(animate);
    };

    // Cleanup animation on unmount
    useEffect(() => {
        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

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
            <span className={styles.balanceContainer}>
                <span className={styles.balanceText}>
                    {displayBalance !== null ? `Balance: $${displayBalance.toFixed(2)}` : "Loading..."}
                </span>
                {floatingAmount !== null && (
                    <span className={`${styles.floatingAmount} ${floatingAmount < 0 ? styles.negative : styles.positive} ${isAnimating ? styles.animate : ''}`}>
                        {floatingAmount > 0 ? '+' : ''}${floatingAmount.toFixed(2)}
                    </span>
                )}
            </span>
            <button
                className={styles.topUpButton}
                title="Top Up Balance"
                onClick={handleShowTopUpOverlay}
                disabled={topUpInProgress || showOverlay}>
                <span className="material-symbols-outlined">credit_card</span>
            </button>
            {showOverlay && <OverlayPanel headerText="Top Up Blanace" onClose={handleCloseTopUpOverlay} children={renderTopUpContent()} />}
        </div>
    );
}