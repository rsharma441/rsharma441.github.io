// src/components/MusicTabs.tsx

import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import AlbumList from './AlbumList'
import SongList from './SongList'
import Surprise from './Surprise'
import { Album, Song } from '../types.d'
import { loadCsv } from '../utils/csvLoader'

interface MusicTabProps {
  answers: string[]
  setAnswers: React.Dispatch<React.SetStateAction<string[]>>
  recommendations: { rank: number; reason: string }[]
}

const MusicTabs: React.FC<MusicTabProps> = ({
  recommendations,
  answers,
  setAnswers
}) => {
  const location = useLocation()
  const [albums, setAlbums] = useState<Album[] | null>(null)
  const [songs, setSongs] = useState<Song[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [loadedAlbums, loadedSongs] = await Promise.all([
          loadCsv<Album>('../assets/top_albums.csv'),
          loadCsv<Song>('../assets/top_songs.csv')
        ])
        setAlbums(loadedAlbums)
        setSongs(loadedSongs)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  const renderLoadingOrError = () => {
    if (loading) return <p>Loading...</p>
    if (!albums && location.pathname === '/albums')
      return <p>No albums found.</p>
    if (!songs && location.pathname === '/songs') return <p>No songs found.</p>
    return null
  }

  return (
    <div>
      {/* Navigation Header */}
      <div className="tabs">
        <Link
          to="/music/albums"
          className={`tab-button ${location.pathname === '/music/albums' ? 'active-tab' : ''}`}
        >
          Albums
        </Link>
        <Link
          to="/music/songs"
          className={`tab-button ${location.pathname === '/music/songs' ? 'active-tab' : ''}`}
        >
          Songs
        </Link>
        <Link
          to="/music/surprise"
          className={`tab-button ${location.pathname === '/music/surprise' ? 'active-tab' : ''}`}
        >
          Extras
        </Link>
      </div>

      {/* Render Tab Content */}
      <div>
        {renderLoadingOrError()}
        <Routes>
          <Route
            path="albums"
            element={
              albums ? (
                <AlbumList albums={albums} recommendations={recommendations} />
              ) : null
            }
          />
          <Route
            path="songs"
            element={songs ? <SongList songs={songs} /> : null}
          />
          <Route
            path="surprise"
            element={<Surprise answers={answers} setAnswers={setAnswers} />}
          />
        </Routes>
      </div>
    </div>
  )
}

export default MusicTabs
