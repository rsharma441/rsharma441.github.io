// src/types.d.ts

export interface Album {
    rank: string;
    albumName: string;
    artist: string;
    genre: string;
    review: string;
    greatIfYouLike: string;
    linkToListen: string;
    albumCover: string;
    recommendation?: string;
  }
  
  export interface Song {
    title: string;
    artist: string;
    link: string;
    genre: string;
    description: string;
    spotifyid: string;
  }
  