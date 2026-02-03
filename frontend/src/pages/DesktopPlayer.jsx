import { useState } from "react";

import SiderbarPage from "./SidebarPage.jsx";
import DiscoverPage from "./DiscoverPage.jsx";
import ArtistPage from "./artist/ArtistPage.jsx";
import PlaylistCategoryPage from "./playlist/PlaylistCategoryPage.jsx";
import RankPage from "./rank/RankPage.jsx";
import RadioPage from "./radio/RadioPage.jsx";
import LikedPage from "./liked/LikedPage.jsx";
import DesktopPlayerBar from "../components/DesktopPlayerBar.jsx";
import LyricsFullScreen from "../components/LyricsFullScreen.jsx";
import FavoritePlaylistsPage from "./liked/FavoritePlaylistsPage.jsx";
import FavoriteArtistsPage from "./liked/FavoriteArtistsPage.jsx";
import RecentPlaysPage from "./recent/RecentPlaysPage.jsx";
import MVPage from "./mvs/MVPage.jsx";
import { useMusicPlayer } from "../context/MusicContext.jsx";

export default function DesktopPlayer() {
  const [currentPage, setCurrentPage] = useState("discover");
  const { showLyrics, setShowLyrics, currentTrack} = useMusicPlayer();

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
            {currentPage === "mv" && <MVPage />}
        </main>

      </div>

      {/* 底部播放器条 */}
      <DesktopPlayerBar />

      {showLyrics && (
        <LyricsFullScreen
          currentTrack={currentTrack}
          onClose={() => setShowLyrics(false)}
        />
      )}
    </div>
  );
}