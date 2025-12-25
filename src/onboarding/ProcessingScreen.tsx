// src/onboarding/ProcessingScreen.tsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  onSkip: () => void;
}

export default function ProcessingScreen({ onSkip }: Props) {
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanSkip(true);
    }, 20000); // 20 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.section
      className="processing-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <p>Generating personalized recommendations…</p>
      <p className="muted">Hold on for a moment!</p>

      {canSkip && (
        <motion.button
          className="skip-btn"
          onClick={onSkip}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Continue without recommendations
        </motion.button>
      )}
    </motion.section>
  );
}
