import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SiderbarPage from "./SidebarPage.jsx";
import DesktopPlayerBar from "../components/DesktopPlayerBar.jsx";
import LyricsOverlay from "../components/LyricsOverlay.jsx";
import LyricsPage from "./lyrics/LyricsPage.jsx";

import { useMusicPlayer } from "../context/MusicContext.jsx";
import { usePageStack } from "../router/usePageStack.jsx";
import { PageRouter} from "../router/PageRouter.jsx";

export default function DesktopPlayer() {
  const navigate = useNavigate();
  const {
    showLyrics,
    setShowLyrics,
    showLyricsOverlay,
    setShowLyricsOverlay,
    currentTrack,
    currentTime,
    isPlaying,
  } = useMusicPlayer();
  const { stack, current, push, pop } = usePageStack();
  const [lyricsTrack, setLyricsTrack] = useState(null);
  const [overlayTrack, setOverlayTrack] = useState(null);

  // 检查登录状态（仅在组件初始化时检查一次）
  useEffect(() => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (!showLyrics) {
      setLyricsTrack(null);
      return;
    }
    if (currentTrack) {
      setLyricsTrack(currentTrack);
    }
  }, [showLyrics, currentTrack]);

  useEffect(() => {
    if (!showLyricsOverlay) {
      setOverlayTrack(null);
      return;
    }
    if (currentTrack) {
      setOverlayTrack(currentTrack);
    }
  }, [showLyricsOverlay, currentTrack]);

  const switchRootPage = (pageType) => {
    push({ type: pageType });
  }

  return (
    <div className="w-screen h-screen bg-warm-bg text-warm-text flex flex-col overflow-hidden">

      {/* <TitleBar />   */}

      {/* 上方主区域：左侧导航 + 中间内容 */}
      <div className="flex flex-1 overflow-hidden">

        <SiderbarPage
            currentPage={current.type}
            switchRootPage={switchRootPage}
        />

        {/* 中间内容区 */}
        <main className="flex-1 p-4 overflow-auto">
            <PageRouter
              stack={stack}
              current={current}
              push={push}
              pop={pop}
            />
        </main>

      </div>

      {/* 底部播放器条 */}
      <DesktopPlayerBar />

      {showLyrics && lyricsTrack && (
        <LyricsPage
          currentTrack={lyricsTrack}
          currentTime={currentTime}
          onClose={() => setShowLyrics(false)}
        />
      )}

      {showLyricsOverlay && overlayTrack && (
        <LyricsOverlay
          currentTrack={overlayTrack}
          currentTime={currentTime}
          isPlaying={isPlaying}
          onClose={() => setShowLyricsOverlay(false)}
        />
      )}
    </div>
  );
}