// src/onboarding/Onboarding.tsx
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";

import IntroSequence from "./IntroSequence";
import AmbientAlbumField from "./AmbientAlbumField";
import QuestionStep from "./QuestionStep";
import ProcessingScreen from "./ProcessingScreen";

import "./onboarding.css";

type Phase = "intro" | "ambient" | "questions" | "processing" | "done";

interface AlbumRecommendation {
  album: string;
  artist: string;
  reason: string;
}

interface RecommendationResponse {
  summary: string;
  albums: AlbumRecommendation[];
}


interface Props {
  recommendations: RecommendationResponse | null;
  setRecommendations: React.Dispatch<
    React.SetStateAction<RecommendationResponse | null>
  >;
  answers: string[];
  setAnswers: React.Dispatch<React.SetStateAction<string[]>>;
}


const QUESTION = {
  prompt: "Describe the music you love listening to.",
  subtext:
    "Artists, genres, moods, moments — anything helps personalize the recommendations.",
  placeholder: "e.g. late-night electronic, melancholy indie, jazz while working…",
};


const Onboarding: React.FC<Props> = ({
  recommendations,
  setRecommendations,
  answers,
  setAnswers,
}) => {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("intro");
  const [albums, setAlbums] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);

  /* Load album corpus for ambient field */
  useEffect(() => {
    fetch("/assets/full_albums.csv")
      .then((r) => r.text())
      .then((csv) => {
        const parsed = Papa.parse<{ album: string; artist: string }>(csv, {
          header: true,
          skipEmptyLines: true,
        });

        const unique = Array.from(
          new Set(parsed.data.map((r) => `${r.album} — ${r.artist}`))
        );

        setAlbums(unique);
      });
  }, []);

  /* Fetch recommendations */
  useEffect(() => {
    if (phase !== "processing") return;

    (async () => {
      const res = await fetch(
        "https://backend-crimson-grass-8357.fly.dev/get-recommendations/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        }
      );

      const data = await res.json();
      setRecommendations(data.recommendations);
      setPhase("done");
    })();
  }, [phase, answers, setRecommendations]);

  /* Final handoff */
  useEffect(() => {
    if (phase === "done") {
      navigate("/music", { state: { recommendations } });
    }
  }, [phase, navigate, recommendations]);

  return (
    <main className="onboarding-root">
      {phase === "intro" && (
          <IntroSequence onComplete={() => setPhase("ambient")} />
        )}

        {phase === "ambient" && (
          <AmbientAlbumField
            albums={albums}
            onComplete={() => setPhase("questions")}
          />
        )}
      {phase === "questions" && (
        <QuestionStep
          question={QUESTION}
          onSubmit={(answer) => {
            setAnswers([answer]);
            setPhase("processing");
          }}
        />
      )}


{phase === "processing" && (
  <ProcessingScreen
    onSkip={() => {
      setRecommendations(null);
      setPhase("done");
    }}
  />
)}

    </main>
  );
};

export default Onboarding;
