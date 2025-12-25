// src/YearInMusic.tsx
import React, { useEffect, useState } from "react";
import { Album, Song } from "./types.d";
import { loadCsv } from "./utils/csvLoader";

import Intro from "./sections/Intro";
import AlbumsSection from "./sections/AlbumsSection";
import SongsSection from "./sections/SongsSection";
import { useLocation } from "react-router-dom";


interface AlbumRecommendation {
  album: string;
  artist: string;
  reason: string;
}

const YearInMusic: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [view, setView] = useState<"albums" | "songs">("albums");
  const location = useLocation();
  const recommendations = location.state?.recommendations ?? null;

const recommendationMap = React.useMemo(() => {
  if (!recommendations || !Array.isArray(recommendations.albums)) {
    return {};
  }

  return Object.fromEntries(
    recommendations.albums.map((r: AlbumRecommendation) => [
      `${r.album.toLowerCase()}::${r.artist.toLowerCase()}`,
      r.reason,
    ])
  );
}, [recommendations]);

  useEffect(() => {
    const loadData = async () => {
      const [albumsData, songsData] = await Promise.all([
        loadCsv<Album>("/assets/top_albums.csv"),
        loadCsv<Song>("/assets/top_songs.csv"),
      ]);
      setAlbums(albumsData);
      setSongs(songsData);
    };

    loadData();
  }, []);


//sort the albums in reverse 
  return (
    <main>
      <Intro />
      <div className="section-toggle">
        <button
          className={`toggle-btn ${view === "albums" ? "active" : ""}`}
          onClick={() => setView("albums")}
        >
          Top Albums
        </button>

        <button
          className={`toggle-btn ${view === "songs" ? "active" : ""}`}
          onClick={() => setView("songs")}
        >
          Top Songs
        </button>

        <div
          className={`toggle-indicator ${view}`}
        />
      </div>
      {view === "albums" && (
        <AlbumsSection
          albums={[...albums].reverse()}
          recommendationMap={recommendationMap}
        />
      )}


      {view === "songs" && (
        <SongsSection songs={songs} />
      )}

    </main>
  );
};

export default YearInMusic;
