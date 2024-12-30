// src/App.tsx

import React, {useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Add these imports

import MusicTabs from "./components/MusicTabs";
import Onboarding from "./components/OnboardingComponent";
import "./styles.css";

const App: React.FC = () => {
  const [answers, setAnswers] = useState<string[]>(() => {
    // Retrieve answers from local storage or initialize to empty array if not available
    const savedAnswers = localStorage.getItem('answers');
    return savedAnswers ? JSON.parse(savedAnswers) : [];
  });

  const [recommendations, setRecommendations] = useState<{ rank: number; reason: string }[]>(() => {
    // Retrieve recommendations from local storage or initialize to empty array if not available
    const savedRecommendations = localStorage.getItem('recommendations');
    return savedRecommendations ? JSON.parse(savedRecommendations) : [];
  });

  // Effect to update local storage when answers change
  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);

  // Effect to update local storage when recommendations change
  useEffect(() => {
    localStorage.setItem('recommendations', JSON.stringify(recommendations));
  }, [recommendations]);

  
  return (
    <div className="animated-background">
    <div className="App">

      <main>
      <BrowserRouter>
        <Routes>
        <Route 
                path="/onboarding" 
                element={<Onboarding 
                          recommendations={recommendations}
                          setRecommendations={setRecommendations}
                          answers={answers}
                          setAnswers={setAnswers}
                        />} 
              />
              <Route 
                path="/music" 
                element={<MusicTabs recommendations={recommendations} answers={answers} setAnswers={setAnswers} />} 
              />
          <Route path="/music/*" element={<MusicTabs recommendations={recommendations} answers={answers} setAnswers={setAnswers} />}  />

        </Routes>
      </BrowserRouter>
      </main>
    </div>
    </div>
  );
};

export default App;
