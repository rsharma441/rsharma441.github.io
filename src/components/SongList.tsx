import React, { useState, useEffect } from 'react'
import { Song } from '../types'
import LazySpotifyIframe from './LazySpotifyIframe'
import { motion } from 'framer-motion'

const SongList: React.FC<{ songs: Song[] }> = ({ songs }) => {
  const [selectedSongs, setSelectedSongs] = useState<{
    [key: string]: boolean
  }>({})
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null)
  const [modalMessage, setModalMessage] = useState<string | null>(null)

  const handleSongToggle = (song: Song) => {
    if (!spotifyToken) {
      authenticateWithSpotify(false, '/music/songs')
      return
    }

    setSelectedSongs((prev) => ({
      ...prev,
      [song.title]: !prev[song.title]
    }))
  }

  const authenticateWithSpotify = (
    reAuthenticate: boolean = false,
    redirectTo: string = '/music/songs'
  ) => {
    const clientId = '271a48aad534474aa6cf785645191b1c'
    const redirectUri = 'http://localhost:3000/music/songs'
    const scope = 'playlist-modify-public'
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(redirectTo)}`

    setModalMessage(
      reAuthenticate
        ? 'We had to reauthenticate you with Spotify, please try again.'
        : 'We had to authenticate you with Spotify, sorry please try again.'
    )

    window.location.href = authUrl
  }

  const createPlaylist = async () => {
    if (!spotifyToken) {
      authenticateWithSpotify()
      return
    }

    try {
      const userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${spotifyToken}` }
      })

      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          authenticateWithSpotify(true)
        }
        console.error('Failed to fetch user data:', await userResponse.text())
        return
      }

      const userData = await userResponse.json()
      const userId = userData.id

      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: "Rishi's 2024 Top Songs",
            description: "Created from Rishi's web app",
            public: true
          })
        }
      )

      if (!playlistResponse.ok) {
        console.error(
          'Failed to create playlist:',
          await playlistResponse.text()
        )
        return
      }

      const playlistData = await playlistResponse.json()

      const uris = songs
        .filter((song) => selectedSongs[song.title])
        .map((song) => `spotify:track:${song.spotifyid}`)

      const addTracksResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ uris })
        }
      )

      if (!addTracksResponse.ok) {
        console.error(
          'Failed to add tracks to playlist:',
          await addTracksResponse.text()
        )
        return
      }

      setModalMessage(
        `Your playlist has been created. Check Spotify for 'Rishi's 2024 Top Songs'.`
      )
    } catch (error) {
      console.error('Error creating playlist:', error)
      setModalMessage(
        'Experiencing some error with Spotify, please contact rsharma441@gmail.com.'
      )
    }
  }

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.substring(1))
    const token = hash.get('access_token')
    const state = new URLSearchParams(window.location.search).get('state')

    if (token) {
      setSpotifyToken(token)
      localStorage.setItem('spotifyToken', token)
      setModalMessage(
        'We have authenticated you with Spotify, please continue.'
      )

      // Redirect to the original location
      if (state) {
        window.history.replaceState({}, document.title, state)
      } else {
        window.history.replaceState({}, document.title, '/')
      }
    } else {
      const storedToken = localStorage.getItem('spotifyToken')
      if (storedToken) {
        setSpotifyToken(storedToken)
      }
    }
  }, [])

  useEffect(() => {
    const storedSelections = localStorage.getItem('selectedSongs')
    if (storedSelections) {
      setSelectedSongs(JSON.parse(storedSelections))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('selectedSongs', JSON.stringify(selectedSongs))
  }, [selectedSongs])

  return (
    <section className="song-list">
      <div className="instructions">
        To create your own playlist, select songs below and then click Create
        Playlist. You will need a Spotify account.
      </div>
      <div className="header">
        <button
          className="create-playlist-btn"
          onClick={createPlaylist}
          disabled={!Object.values(selectedSongs).some((selected) => selected)}
        >
          Create Playlist
        </button>
        <a
          href="https://open.spotify.com/playlist/70kDCsIcEKTGuSz0GnO3GI?si=b5b526edfb4f49be&pt=d3cbd130565f6533bd25eda8e93e2bd3"
          target="_blank"
          rel="noopener noreferrer"
          className="see-full-playlist-btn"
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = '#e20c79')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = '#3c4da2')
          }
        >
          Full Playlist
        </a>
      </div>

      <ul>
        {songs.map((song, index) => (
          <React.Fragment key={index}>
            <motion.li
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              style={{
                padding: '10px',
                backgroundColor: selectedSongs[song.title]
                  ? '#3c4da2'
                  : 'transparent'
              }}
            >
              <div>
                {/* Lazy loaded Spotify iframe */}
                <LazySpotifyIframe spotifyId={song.spotifyid} type="track" />
                <button
                  onClick={() => handleSongToggle(song)}
                  style={{
                    backgroundColor: selectedSongs[song.title]
                      ? '#e20c79'
                      : '#3c4da2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    padding: '3px 8px',
                    marginBottom: '10px'
                  }}
                >
                  {selectedSongs[song.title] ? '−' : '+'}
                </button>
                <span>
                  {' '}
                  ({song.genre}) {song.description}
                </span>
              </div>
            </motion.li>
          </React.Fragment>
        ))}
      </ul>
      {modalMessage && (
        <div className="modal">
          <div className="modal-content">
            <h2>Notice</h2>
            <p>{modalMessage}</p>
            <button onClick={() => setModalMessage(null)}>Close</button>
          </div>
        </div>
      )}
    </section>
  )
}

export default SongList
