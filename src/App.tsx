import React, { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import YearInMusic from "./YearInMusic";
import Onboarding from "./onboarding/Onboarding";

import "./reset.css";
import "./theme.css";

const App: React.FC = () => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState(null);

  return (
    <HashRouter>
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
        <Route path="/music" element={<YearInMusic />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
