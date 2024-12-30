import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Papa from 'papaparse'
import '../styles/onboarding.css'

interface OnboardingProps {
  recommendations: { rank: number; reason: string }[]
  setRecommendations: React.Dispatch<
    React.SetStateAction<{ rank: number; reason: string }[]>
  >
  answers: string[]
  setAnswers: React.Dispatch<React.SetStateAction<string[]>>
}

const OnboardingIntro: React.FC<OnboardingProps> = ({
  recommendations,
  setRecommendations,
  answers,
  setAnswers
}) => {
  const [step, setStep] = useState(0)
  const [twinkleBatch, setTwinkleBatch] = useState<string[]>([])
  const [albums, setAlbums] = useState<string[]>([])
  // const [recommendations, setRecommendations] = useState<{ rank: number; reason: string }[]>([]);
  const [isFetchTimeout, setFetchTimeout] = useState(false) // For timeout
  const [fetchError, setFetchError] = useState(false) // For fetch errors

  const navigate = useNavigate()

  useEffect(() => {
    // Load the CSV file
    fetch('/assets/full_albums.csv')
      .then((response) => response.text())
      .then((data) => {
        const parsed = Papa.parse<{ album: string; artist: string }>(data, {
          header: true,
          skipEmptyLines: true
        })
        const albumList = parsed.data.map(
          (row) => `${row.album} - ${row.artist}`
        )
        const uniqueAlbums = Array.from(new Set(albumList))
        const albumListRandom50 = uniqueAlbums
          .sort(() => 0.5 - Math.random())
          .slice(0, 150)
        setAlbums(albumListRandom50)
      })
  }, [])

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1000),
      setTimeout(() => setStep(2), 2000),
      setTimeout(() => setStep(3), 3000),
      setTimeout(() => setStep(4), 4000),
      setTimeout(() => setStep(5), 5000),
      setTimeout(() => setStep(5.5), 7000),
      setTimeout(() => {
        setStep(6)
        let index = 0
        let speed = 500
        const batchSize = 3

        const twinkle = () => {
          if (index < albums.length) {
            const batch = albums.slice(index, index + batchSize)
            setTwinkleBatch(batch)
            index += batchSize
            speed = Math.max(100, speed * 0.85)
            setTimeout(twinkle, speed)
          } else {
            setTwinkleBatch([]) // Clear twinkle batch to end animation
            setTimeout(() => setStep(7), 2000) // Move to Step 7 after a pause
          }
        }

        twinkle()
      }, 9000)
    ]

    return () => timers.forEach(clearTimeout)
  }, [albums])

  useEffect(() => {
    if (step === 10 && answers.length >= 3) {
      const timeoutId = setTimeout(() => {
        setFetchTimeout(true) // Trigger timeout state after 15 seconds
      }, 15000)

      ;(async () => {
        try {
          const results = await fetchPersonalizedRecommendations(answers)
          clearTimeout(timeoutId) // Clear timeout if fetch succeeds
          setRecommendations(results)
        } catch (error) {
          clearTimeout(timeoutId) // Clear timeout if fetch fails
          setFetchError(true) // Set fetch error state
        }
      })()
    }
  }, [step, answers, setRecommendations])

  useEffect(() => {
    const savedAnswers = localStorage.getItem('answers')
    const savedRecommendations = localStorage.getItem('recommendations')
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }
    if (savedRecommendations) {
      setRecommendations(JSON.parse(savedRecommendations))
    }
  }, [setAnswers, setRecommendations])

  // Save answers and recommendations to local storage when they change
  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers))
    localStorage.setItem('recommendations', JSON.stringify(recommendations))
  }, [answers, recommendations])

  const handleAnswerSubmit = useCallback(
    (event: React.FormEvent | React.KeyboardEvent, answer: string) => {
      event.preventDefault()
      setAnswers((prev) => [...prev, answer]) // Append new answer without duplicates
      setStep((prev) => prev + 1) // Move to the next step
    },
    [setAnswers, setStep]
  ) // Include only necessary dependencies

  const fetchPersonalizedRecommendations = async (userAnswers: string[]) => {
    try {
      console.log('Fetching recommendations for answers:', userAnswers)
      const response = await fetch(
        'https://backend-winter-pond-4834.fly.dev/get-recommendations/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({ answers: userAnswers })
        }
      )

      if (!response.ok) {
        throw new Error(
          `Failed to fetch recommendations: ${response.statusText}`
        )
      }

      const data = await response.json()
      console.log('Recommendations fetched:', data.recommendations)
      return data.recommendations || []
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      return []
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#fff',
        overflow: 'hidden'
      }}
    >
      {/* Animation Steps */}
      {step < 6 && (
        <div
          style={{
            fontSize: '1.5rem',
            opacity: step === 5.5 ? 0 : 1,
            transition: 'opacity 2s'
          }}
        >
          Welcome! Time to learn what the best albums and songs of{' '}
          <span style={{ color: '#e20c79' }}>2024</span>
          {step >= 1 && (
            <span
              style={{
                opacity: step >= 1 ? 1 : 0, // Ensure opacity is explicitly set
                transition: 'opacity 1.5s', //
                animation: step === 1 ? 'fadeIn 1.5s forwards' : 'none' // Apply fadeIn only for step 1
              }}
            >
              {' '}
              This year, I listened to over{' '}
              <span style={{ color: '#e20c79' }}>240 albums</span>
            </span>
          )}
          {step >= 2 && (
            <span
              style={{
                opacity: step >= 2 ? 1 : 0, // Ensure opacity is explicitly set
                transition: 'opacity 1.5s', // Use transition for smooth appearance
                animation: step === 2 ? 'fadeIn 1.5s forwards' : 'none' // Apply fadeIn only for step 1
              }}
            >
              {' '}
              over <span style={{ color: '#e20c79' }}>30k minutes</span>
            </span>
          )}
          {step >= 3 && (
            <span
              style={{
                opacity: step >= 3 ? 1 : 0, // Ensure opacity is explicitly set
                transition: 'opacity 1.5s',
                animation: step === 3 ? 'fadeIn 1.5s forwards' : 'none' // Apply fadeIn only for step 1
              }}
            >
              {' '}
              something I haven’t done in{' '}
              <span style={{ color: '#e20c79' }}>10 years!!</span>
            </span>
          )}
        </div>
      )}

      {/* Twinkle Animation */}
      {step === 6 &&
        twinkleBatch.map((album, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              fontSize: `${Math.random() * 1.5 + 1}rem`,
              color: i % 2 === 0 ? '#fff' : '#e20c79',
              animation: 'fadeTwinkle 1s ease-in-out'
            }}
          >
            {album}
          </div>
        ))}

      {step >= 7 && step <= 9 && (
        <form
          style={{
            opacity: 1,
            animation:
              step === 7 || step === 8 || step === 9
                ? 'fadeIn 1.5s forwards'
                : 'none',
            textAlign: 'left'
          }}
          onSubmit={(event) => {
            event.preventDefault()
            const textarea = event.currentTarget.querySelector(
              'textarea'
            ) as HTMLTextAreaElement
            if (textarea) handleAnswerSubmit(event, textarea.value)
          }}
        >
          {step === 7 && (
            <>
              <p style={{ animation: 'fadeIn 1.5s forwards', opacity: 0 }}>
                Okay, so this year, the AI-guy in me is going to ask you some
                questions to recomemnd my reviews more meaningfully. Feel free
                to press Next if you don`&apos;`t care
              </p>
              <p style={{ animation: 'fadeIn 1.5s forwards', opacity: 0 }}>
                What songs, artists, genres always get you in a good mood?
              </p>
              <textarea
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault() // Prevent newline
                    handleAnswerSubmit(
                      event,
                      (event.target as HTMLTextAreaElement).value
                    )
                  }
                }}
                style={{
                  width: '80%',
                  height: '100px',
                  padding: '10px',
                  fontSize: '1rem',
                  animation: 'fadeIn 1.5s forwards',
                  opacity: 0
                }}
                placeholder="Don't Stop Believin', Journey, Arena Rock, etc."
              />
            </>
          )}
          {step === 8 && (
            <>
              <p style={{ animation: 'fadeIn 1.5s forwards', opacity: 0 }}>
                What album or artist defined a special moment in your life?
              </p>
              <textarea
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault() // Prevent newline
                    handleAnswerSubmit(
                      event,
                      (event.target as HTMLTextAreaElement).value
                    )
                  }
                }}
                style={{
                  width: '80%',
                  height: '100px',
                  padding: '10px',
                  fontSize: '1rem',
                  animation: 'fadeIn 1.5s forwards',
                  opacity: 0
                }}
                placeholder="Listening to Adele's 21 during my first breakup"
              />
            </>
          )}
          {step === 9 && (
            <>
              <p style={{ animation: 'fadeIn 1.5s forwards', opacity: 0 }}>
                What new types of music are you looking to explore?
              </p>
              <textarea
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault() // Prevent newline
                    handleAnswerSubmit(
                      event,
                      (event.target as HTMLTextAreaElement).value
                    )
                  }
                }}
                style={{
                  width: '80%',
                  height: '100px',
                  padding: '10px',
                  fontSize: '1rem',
                  animation: 'fadeIn 1.5s forwards',
                  opacity: 0
                }}
                placeholder="Music from other cultures, younger artists, jazz, etc."
              />
            </>
          )}
          <br />
          <button
            style={{
              animation: 'fadeIn 1.5s forwards',
              opacity: 0
            }}
            className="option-btn"
            type="submit"
          >
            Next
          </button>
        </form>
      )}

      {/* Step 10 */}
      {/* Step 10 */}
      {step === 10 && (
        <div
          style={{
            opacity: 0,
            animation: 'fadeIn 1.5s forwards',
            textAlign: 'left'
          }}
        >
          <h2 style={{ animation: 'fadeIn 1.5s forwards', opacity: 0 }}>
            Thank you!
          </h2>
          <p style={{ animation: 'fadeIn 1.5s forwards', opacity: 0 }}>
            This year, I am doing some new things!
          </p>
          <ul>
            {[
              'For one, I built this web app.',
              'I am also using your answers to create better music recommendations. So, pay attention to the recs under <span className="highlight">Great if you like...</span>',
              'Last, if you have Spotify, you can <span className="highlight">create your own sub-playlist.</span>',
              'The <span className="highlight">Extras</span> tab has some fun AI stuff, too',
              'I tried to keep the reviews short... mostly.'
            ].map((item, index) => (
              <li
                key={index}
                style={{
                  opacity: 0,
                  animation: `fadeIn ${1.5 + index * 0.5}s forwards`
                }}
                dangerouslySetInnerHTML={{ __html: item }}
              ></li>
            ))}
          </ul>

          <p style={{ animation: 'fadeIn 1.5s forwards', opacity: 0 }}>
            Thanks, hope you enjoy and please share your favorite music!
          </p>
          <button
            style={{
              animation: 'fadeIn 1.5s forwards',
              opacity:
                recommendations.length > 0 ||
                answers.every((a) => a.trim() === '')
                  ? 1
                  : 0.5, // Greyed out only if answers are not skipped and no recommendations
              pointerEvents:
                recommendations.length > 0 ||
                answers.every((a) => a.trim() === '')
                  ? 'auto'
                  : 'none', // Enable interaction for skipped answers or when recommendations are ready
              backgroundColor:
                recommendations.length > 0 ||
                answers.every((a) => a.trim() === '')
                  ? '#e20c79'
                  : '#ccc', // Change background color when enabled
              color: '#fff',
              padding: '10px 20px',
              fontSize: '1rem',
              border: 'none',
              borderRadius: '5px',
              cursor:
                recommendations.length > 0 ||
                answers.every((a) => a.trim() === '')
                  ? 'pointer'
                  : 'not-allowed',
              transition: 'all 0.3s ease'
            }}
            className="option-btn"
            onClick={() => navigate('/music', { state: { recommendations } })}
          >
            {isFetchTimeout || fetchError
              ? "Let's go!! (AI is being a little wonky)"
              : recommendations.length > 0
                ? "Let's go!!"
                : 'Just waiting for our AI to work its magic...'}
          </button>
        </div>
      )}
    </div>
  )
}

export default OnboardingIntro
