"use client";

import { useState } from "react";

export default function HomePage() {
    const [chips, setChips] = useState(1000);
    const bet = 25;

    const spin = () => {
        const win = Math.random() < 0.47;
        setChips(c => c + (win ? bet : -bet));
    };

    return (
        <main>
            <h1>Casino Demo 🎰</h1>
            <p>Chips: {chips}</p>
            <button onClick={spin}>Spin</button>
        </main>
    );
}
