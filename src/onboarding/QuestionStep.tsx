// src/onboarding/QuestionStep.tsx
import { useState } from "react";
import { motion } from "framer-motion";

export default function QuestionStep({
  question,
  onSubmit,
}: {
  question: {
    prompt: string;
    subtext?: string;
    placeholder: string;
  };
  onSubmit: (answer: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <motion.section
      className="question-step"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <p className="question-prompt">{question.prompt}</p>

      {question.subtext && (
        <p className="question-subtext">{question.subtext}</p>
      )}

      <textarea
        placeholder={question.placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) {
            e.preventDefault();
            onSubmit(value.trim());
          }
        }}
      />

      <button
        disabled={!value.trim()}
        onClick={() => onSubmit(value.trim())}
      >
        Continue
      </button>
    </motion.section>
  );
}
