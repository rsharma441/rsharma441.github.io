// src/onboarding/IntroSequence.tsx
import { motion } from "framer-motion";

const lines = [
  "This my 17th Annual music review!",
  "This time...",
  "I reviewed 178 albums",
  "Thats over 35,000 mins",
  "Including...",
];

export default function IntroSequence({
  onComplete,
}: {
  onComplete: () => void;
}) {
  return (
    <section className="intro-sequence">
      {lines.map((line, i) => (
        <motion.p
          key={line}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 1.5 }}
            onAnimationComplete={
            i === lines.length - 1
                ? () => setTimeout(onComplete, 2000)
                : undefined
            }

        >
          {line}
        </motion.p>
      ))}
    </section>
  );
}
