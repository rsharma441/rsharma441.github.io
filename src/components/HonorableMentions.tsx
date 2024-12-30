import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles.css'

const HonorableMentions = () => {
  const navigate = useNavigate()

  const handleNext = () => {
    navigate('?album=0')
  }

  return (
    <div className="honorable-mentions" style={{ justifyContent: 'center' }}>
      <h2>Honorable Mentions</h2>
      <ul>
        <li>BETA - Peter Cat Recording Co</li>
        <li>For Your Consideration - Empress Of</li>
        <li>Phantasy & Reality - Lynn Avery, Cole Pulice</li>
        <li>Wall of Eyes - The Smile</li>
        <li>Tiger’s Blood - Waxahatchee</li>
      </ul>
      <button className="carousel-button " onClick={handleNext}>
        Next
      </button>
    </div>
  )
}

export default HonorableMentions
