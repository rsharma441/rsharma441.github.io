import React, { useState, useEffect } from "react";
import "../styles/surprise.css";

interface SurpriseProps {
  answers: string[];
  setAnswers: React.Dispatch<React.SetStateAction<string[]>>;
}

const Surprise: React.FC<SurpriseProps> = ({ answers, setAnswers }) => {
  const [recommendation, setRecommendation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [recKey, setRecKey] = useState(0);  // To trigger animation

  // Initial setup for answers if less than three
  useEffect(() => {
    if (answers.length < 3) {
      const updatedAnswers = [...answers, ...Array(3 - answers.length).fill("")];
      setAnswers(updatedAnswers);
    }
  }, []); // Only runs once on component mount

  useEffect(() => {
    // Save the answers array to local storage whenever answers change
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);

  const fetchPersonalizedRecommendation = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch('https://backend-winter-pond-4834.fly.dev/surprise/get-recommendations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
      }

      const data = await response.json();
      setIsLoading(false); // End loading
      return data.recommendations || "";
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setIsLoading(false);
      return "There was an error getting your recommendation, try again or contact rsharma441@gmail.com";
    }
  };

  const handleUpdateClick = async () => {
    const newRecommendation = await fetchPersonalizedRecommendation();
    setRecommendation(newRecommendation);
    setRecKey(prevKey => prevKey + 1); // Increment key to trigger re-animation
  }

  return (
    <div className="surprise">
      <p className="title"> <span style={{ fontWeight: "bold" }}>
        
         AI Recommender: </span>Update your answers to the prompts below and use this tool to find more personal recs from my reviewed albums</p>
      <div className="recommendation" key={recKey} dangerouslySetInnerHTML={{ __html: recommendation }} />

      {answers.map((answer, index) => (
        <div className="question-container" key={index}>
          <label>{[`What songs, artists, genres always get you in a good mood?`, `What album or artist defined a special moment in your life?`, `What new types of music are you looking to explore?`][index]}</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswers(answers.map((ans, idx) => idx === index ? e.target.value : ans))}
          />
        </div>
      ))}

      <button className="update-button" onClick={handleUpdateClick} disabled={isLoading}>
        {isLoading ? "Loading..." : "Update"}
      </button>
    </div>
  );
};

export default Surprise;
