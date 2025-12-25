// src/onboarding/ProcessingScreen.tsx
import { motion } from "framer-motion";

export default function ProcessingScreen() {
  return (
    <motion.section
      className="processing-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <p>Generating personalized recommendations...</p>
      <p className="muted">Hold on for a moment!</p>
    </motion.section>
  );
}
