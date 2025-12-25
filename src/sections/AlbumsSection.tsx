// src/sections/AlbumsSection.tsx
import React from "react";
import { Album } from "../types";
import AlbumEntry from "./AlbumEntry";

interface Props {
  albums: Album[];
  recommendationMap?: Record<string, string>;

}

const AlbumsSection: React.FC<Props> = ({ albums, recommendationMap = {} }) => {
  console.log(recommendationMap);
  return (
    <section className="albums-section">
      {albums.map((album, index) => {
        const key = `${album.albumName.toLowerCase()}::${album.artist.toLowerCase()}`;
        const recommendation = recommendationMap[key];

        return (
          <AlbumEntry
            key={key}
            album={album}
            index={index}
            recommendation={recommendation}
          />
        );
      })}
    </section>
  );
};

export default AlbumsSection;