"use client";

import { createPortal } from "react-dom";

import styles from "./OverlayPanel.module.css"

type OverlayPanelProps = {
    headerText: string;
    children: React.ReactNode;
    onClose: () => void;
};

export default function OverlayPanel({ headerText, children, onClose }: OverlayPanelProps) {
    return createPortal(
        <div className={styles.overlayPanel}>
            <div className={styles.contentPanel}>
                <div className={styles.header}>
                    <span className={styles.headerText}>{headerText}</span>
                    <button onClick={onClose} className={styles.closeButton} title="Close">×</button>
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
}