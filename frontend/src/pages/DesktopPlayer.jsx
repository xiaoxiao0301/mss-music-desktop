import { useState } from "react";
import { currentTrack, playQueue } from "../mock/player";
import SiderbarPage from "./SidebarPage.jsx";
import TitleBar from "./TitleBar.jsx";
import ArtistPage from "./artist/ArtistPage.jsx";
import PlaylistCategoryPage from "./playlist/PlaylistCategoryPage.jsx";
import RankPage from "./rank/RankPage.jsx";
import RadioPage from "./radio/RadioPage.jsx";

export default function DesktopPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState("discover");


  return (
    <div className="w-screen h-screen bg-warm-bg text-warm-text flex flex-col overflow-hidden">

      <TitleBar />  

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
            {currentPage === "my" && <MyMusicPage />}
            {currentPage === "local" && <LocalPage />}
            {currentPage === "settings" && <SettingsPage />}
        </main>

      </div>

      {/* 底部播放器条 */}
      <footer className="h-24 flex-shrink-0 bg-warm-card shadow-[0_-4px_10px_rgba(0,0,0,0.05)] px-4 flex items-center justify-between">

        {/* 左侧：当前歌曲信息 */}
        <div className="flex items-center gap-3 w-1/4">
          <img
            src={currentTrack.cover}
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div>
            <p className="font-medium text-sm">{currentTrack.name}</p>
            <p className="text-xs text-warm-subtext">{currentTrack.artist}</p>
          </div>
        </div>

        {/* 中间：播放控制 + 进度条 */}
        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center gap-6 mb-2">
            <button className="text-xl">⏮</button>
            <button
              className="text-3xl"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? "⏸" : "▶️"}
            </button>
            <button className="text-xl">⏭</button>
          </div>

          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-warm-subtext">0:00</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="w-full"
            />
            <span className="text-xs text-warm-subtext">4:30</span>
          </div>
        </div>

        {/* 右侧：音量等控制 */}
        <div className="flex items-center justify-end gap-3 w-1/4">
          <span className="text-lg">🔊</span>
          <input type="range" min="0" max="100" defaultValue="70" />
        </div>
      </footer>
    </div>
  );
}

function DiscoverPage() { return <div>发现音乐页面</div>; }
function MyMusicPage() { return <div>我的音乐</div>; }
function LocalPage() { return <div>本地音乐</div>; }
function SettingsPage() { return <div>设置页面</div>; }
