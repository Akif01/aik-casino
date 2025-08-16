"use client";
import { Typewriter } from 'react-simple-typewriter';
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div>
      <Typewriter
        words={[
          `Welcome to Aik Casino, the ultimate playground for thrill-seekers and high-rollers!
          Built with Next.js, our casino brings you fast, smooth, and secure gameplay right in your browser.
          Step inside, try your luck at our exciting games, and experience the neon-lit world of Aik Casino where fortune favors the bold.`
        ]}
        loop={1}          // number of times to loop
        cursor            // show blinking cursor
        cursorStyle="|"   // cursor style
        typeSpeed={30}    // typing speed in ms
        deleteSpeed={50}  // deletion speed if looping
      />
    </div>
  );
}
