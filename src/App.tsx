// src/App.tsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import YearInMusic from "./YearInMusic";
import Onboarding from "./onboarding/Onboarding";

import "./reset.css";
import "./theme.css";

interface AlbumRecommendation {
  album: string;
  artist: string;
  reason: string;
}

interface RecommendationResponse {
  summary: string;
  albums: AlbumRecommendation[];
}

const App: React.FC = () => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);

  console.log(recommendations);
  return (
    <BrowserRouter basename="/rsharma441.github.io">
      <Routes>
        <Route
          path="/"
          element={
            <Onboarding
              answers={answers}
              setAnswers={setAnswers}
              recommendations={recommendations}
              setRecommendations={setRecommendations}
            />
          }
        />

        <Route
          path="/music"
          element={<YearInMusic />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
