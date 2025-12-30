// src/onboarding/AmbientAlbumField.tsx
import { useEffect, useState, useRef} from "react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_DELAY = 900;     // slower, calmer start
const MIN_DELAY = 120;          // cap speed (slightly gentler)
const SPEED_MULTIPLIER = 0.93; // slower acceleration

const vw = window.innerWidth;
const vh = window.innerHeight;

const maxX = vw * 0.4;
const maxY = vh * 0.3;


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
  const recentPositions = useRef<{ x: number; y: number }[]>([]);
const generatePosition = () => {
  const MAX_X = Math.min(window.innerWidth * 0.4, 260);
const MAX_Y = Math.min(window.innerHeight * 0.55, 320);

  let x = (Math.random() - 0.5) * MAX_X;
  let y = (Math.random() - 0.5) * MAX_Y;

  // repel from recent positions (in px)
  recentPositions.current.forEach((p) => {
    const dx = x - p.x;
    const dy = y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const MIN_DIST_X = 44;
    const MIN_DIST_Y = 72;

    if (Math.abs(dx) < MIN_DIST_X && Math.abs(dy) < MIN_DIST_Y) {
      x += dx * 0.4;
      y += dy * 0.9; // 👈 push harder vertically
    }

  });

  recentPositions.current.push({ x, y });

  if (recentPositions.current.length > 10) {
    recentPositions.current.shift();
  }

  return { x, y };
};


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
{visibleBatch.map((text) => {
  const { x, y } = generatePosition();

  return (
    <motion.span
      key={`${text}-${index}`}
      className="twinkle-item"
      style={{
        ["--x" as any]: `${x}px`,
        ["--y" as any]: `${y}px`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.45 + Math.random() * 0.25 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {text}
    </motion.span>
  );
})}


      </AnimatePresence>
    </section>
  );
}
