import { useState, useRef, useEffect } from "react";

import SiderbarPage from "./SidebarPage.jsx";
import DiscoverPage from "./DiscoverPage.jsx";
import ArtistPage from "./artist/ArtistPage.jsx";
import PlaylistCategoryPage from "./playlist/PlaylistCategoryPage.jsx";
import RankPage from "./rank/RankPage.jsx";
import RadioPage from "./radio/RadioPage.jsx";
import LikedPage from "./liked/LikedPage.jsx";
import PlayerBar from "../components/PlayerBar.jsx";
import LyricsFullScreen from "../components/LyricsFullScreen.jsx";

import { mockTracks } from "../mock/player";
import FavoritePlaylistsPage from "./liked/FavoritePlaylistsPage.jsx";
import FavoriteArtistsPage from "./liked/FavoriteArtistsPage.jsx";
import RecentPlaysPage from "./recent/RecentPlaysPage.jsx";

export default function DesktopPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPage, setCurrentPage] = useState("discover");

  const [trackIndex, setTrackIndex] = useState(0); 
  const [currentTrack, setCurrentTrack] = useState(mockTracks[0]); 
  const [currentTime, setCurrentTime] = useState(0); 
  const [duration, setDuration] = useState(0); 
  const [volume, setVolume] = useState(70); 
  const [showLyrics, setShowLyrics] = useState(false); 
  const audioRef = useRef(new Audio(currentTrack.url)); 

  useEffect(() => { 
    const audio = audioRef.current; 
    audio.src = currentTrack.url; 
    audio.volume = volume / 100; 
    audio.onloadedmetadata = () => setDuration(audio.duration); 
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime); 
    if (isPlaying) audio.play(); 
  }, [currentTrack]); 

  const togglePlay = () => { 
    const audio = audioRef.current; 
    if (isPlaying) audio.pause(); else audio.play(); 
    setIsPlaying(!isPlaying); 
  }; 

  const playNext = () => { 
    const next = (trackIndex + 1) % mockTracks.length; 
    setTrackIndex(next); 
    setCurrentTrack(mockTracks[next]); 
  }; 

  const playPrev = () => { 
    const prev = (trackIndex - 1 + mockTracks.length) % mockTracks.length; 
    setTrackIndex(prev); setCurrentTrack(mockTracks[prev]); 
  }; 

  const seekTo = (value) => { 
    audioRef.current.currentTime = value; 
    setCurrentTime(value); 
  }; 
  
  const formatTime = (sec) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

  return (
    <div className="w-screen h-screen bg-warm-bg text-warm-text flex flex-col overflow-hidden">

      {/* <TitleBar />   */}

      {/* 上方主区域：左侧导航 + 中间内容 */}
      <div className="flex flex-1 overflow-hidden">

        <SiderbarPage
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
        />

        {/* 中间内容区 */}
        <main className="flex-1 p-4 overflow-auto">
            {currentPage === "discover" && <DiscoverPage />}
            {currentPage === "playlist" && <PlaylistCategoryPage />}
            {currentPage === "artist" && <ArtistPage />}
            {currentPage === "rank" && <RankPage />}
            {currentPage === "radio" && <RadioPage />}
            {currentPage === "fav" && <LikedPage />}
            {currentPage === "fav-playlist" && <FavoritePlaylistsPage />}
            {currentPage === "fav-artist" && <FavoriteArtistsPage />}
            {currentPage === "recent" && <RecentPlaysPage />}
        </main>

      </div>

      {/* 底部播放器条 */}
      <PlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        playNext={playNext}
        playPrev={playPrev}
        currentTime={currentTime}
        duration={duration}
        seekTo={seekTo}
        volume={volume}
        setVolume={setVolume}
        setShowLyrics={setShowLyrics}
        formatTime={formatTime}
      />

      {showLyrics && (
        <LyricsFullScreen
          currentTrack={currentTrack}
          currentTime={currentTime}
          onClose={() => setShowLyrics(false)}
        />
      )}
    </div>
  );
}