import SiderbarPage from "./SidebarPage.jsx";
import DesktopPlayerBar from "../components/DesktopPlayerBar.jsx";
import LyricsFullScreen from "../components/LyricsFullScreen.jsx";

import { useMusicPlayer } from "../context/MusicContext.jsx";
import { usePageStack } from "../router/usePageStack.jsx";
import { PageRouter} from "../router/PageRouter.jsx";

export default function DesktopPlayer() {
  const { showLyrics, setShowLyrics, currentTrack} = useMusicPlayer();
  const { stack, current, push, pop } = usePageStack();

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

      {showLyrics && (
        <LyricsFullScreen
          currentTrack={currentTrack}
          onClose={() => setShowLyrics(false)}
        />
      )}
    </div>
  );
}