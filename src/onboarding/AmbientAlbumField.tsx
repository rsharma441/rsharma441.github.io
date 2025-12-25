// src/onboarding/AmbientAlbumField.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_DELAY = 900;     // slower, calmer start
const MIN_DELAY = 90;          // cap speed (slightly gentler)
const SPEED_MULTIPLIER = 0.88; // slower acceleration


export default function AmbientAlbumField({
  albums,
  onComplete,
}: {
  albums: string[];
  onComplete: () => void;
}) {
  const [visibleBatch, setVisibleBatch] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [delay, setDelay] = useState(INITIAL_DELAY);

  useEffect(() => {
    if (!albums.length) return;

    const tick = () => {
      if (index >= albums.length) {
        setVisibleBatch([]);
        setTimeout(onComplete, 2000);
        return;
      }

      const BATCH_SIZE =
        index < 10 ? 1 :        // very calm start
        index < 30 ? 2 :        // easing in
        3;                      // your original density


      const batch = albums.slice(index, index + BATCH_SIZE);
    
      setVisibleBatch(batch);
      setIndex((i) => i + BATCH_SIZE);
      setDelay((d) => Math.max(MIN_DELAY, d * SPEED_MULTIPLIER));
    };

    const timeout = setTimeout(tick, delay);
    return () => clearTimeout(timeout);
  }, [albums, index, delay, onComplete]);

  return (
    <section className="twinkle-field">
      <AnimatePresence>
        {visibleBatch.map((text) => (
        <motion.span
        key={text}
        className="twinkle-item"
        style={{
            ["--x" as any]: `${(Math.random() - 0.5) * 400}px`,
            ["--y" as any]: `${(Math.random() - 0.5) * 300}px`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        >
        {text}
        </motion.span>

        ))}
      </AnimatePresence>
    </section>
  );
}
