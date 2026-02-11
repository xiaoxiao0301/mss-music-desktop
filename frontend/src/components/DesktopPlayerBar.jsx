import { useFavorite, useMusicPlayer } from "../context/MusicContext";
import { message } from "antd";
import Tooltip from "./Tooltip.jsx";
import React from "react";
import { SetSystemVolume } from "../../wailsjs/go/backend/SystemBridge";

function DesktopPlayerBar() {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    playNext, 
    playPrev,
    playQueue,
    playTrack,
    playTrackWithURL,
    currentTime,
    duration,
    seekTo,
    volume,
    setVolume,
    repeatMode,
    shuffleMode,
    toggleRepeat,
    toggleShuffle,
    openLyrics,
    openLyricsOverlay,
    formatTime,
    userPlaylists,
    playlistSongs,
    playlistPickerSong,
    playlistLoading,
    loadUserPlaylists,
    loadUserPlaylistDetail,
    closePlaylistPicker,
    createUserPlaylist,
    addSongToUserPlaylist,
    removeSongFromUserPlaylist
  } = useMusicPlayer();
  
  const { isLiked, toggleLike } = useFavorite();
  const [showVolume, setShowVolume] = React.useState(false);
  const [volumeToast, setVolumeToast] = React.useState("");
  const [showPlaylistDrawer, setShowPlaylistDrawer] = React.useState(false);
  const [activePlaylistTab, setActivePlaylistTab] = React.useState("queue");
  const [activeUserPlaylistId, setActiveUserPlaylistId] = React.useState(null);
  const [newPlaylistName, setNewPlaylistName] = React.useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = React.useState("");
  const volumePopoverRef = React.useRef(null);
  const toastTimerRef = React.useRef(null);
  const queueListRef = React.useRef(null);
  const queueItemRefs = React.useRef([]);

  const getTrackKey = (track) => track?.mid || track?.id;

  const activeQueueIndex = React.useMemo(() => {
    if (!currentTrack || !playQueue.length) return -1;
    const currentKey = getTrackKey(currentTrack);
    if (!currentKey) return -1;
    return playQueue.findIndex((track) => getTrackKey(track) === currentKey);
  }, [currentTrack, playQueue]);

  const highlightedIndex = React.useMemo(() => {
    if (!playQueue.length) return -1;
    if (activeQueueIndex >= 0 && playQueue[activeQueueIndex]) {
      return activeQueueIndex;
    }
    return 0;
  }, [activeQueueIndex, playQueue]);

  React.useEffect(() => {
    if (!showVolume) return undefined;
    const handleOutsideClick = (event) => {
      if (volumePopoverRef.current && !volumePopoverRef.current.contains(event.target)) {
        setShowVolume(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showVolume]);

  React.useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (showPlaylistDrawer) {
      loadUserPlaylists();
    }
  }, [showPlaylistDrawer]);

  React.useEffect(() => {
    if (activeUserPlaylistId) {
      loadUserPlaylistDetail(activeUserPlaylistId);
    }
  }, [activeUserPlaylistId]);

  React.useEffect(() => {
    if (playlistPickerSong) {
      loadUserPlaylists();
    }
  }, [playlistPickerSong]);

  React.useEffect(() => {
    if (!showPlaylistDrawer || activePlaylistTab !== "queue") return;
    if (!playQueue.length) return;
    const targetIndex = highlightedIndex >= 0 ? highlightedIndex : 0;
    const targetEl = queueItemRefs.current[targetIndex];
    if (targetEl && queueListRef.current) {
      requestAnimationFrame(() => {
        targetEl.scrollIntoView({ block: "center", behavior: "smooth" });
      });
    }
  }, [showPlaylistDrawer, activePlaylistTab, highlightedIndex, playQueue.length]);

  const handleAddSongToPlaylist = async (playlistId) => {
    if (!playlistPickerSong) return;
    const userId = localStorage.getItem("userID");
    if (!userId) {
      message.warning("请先登录");
      closePlaylistPicker();
      return;
    }
    try {
      await addSongToUserPlaylist(playlistId, playlistPickerSong);
    } finally {
      closePlaylistPicker();
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      message.warning("请输入歌单名称");
      return;
    }
    await createUserPlaylist(newPlaylistName.trim(), newPlaylistDescription.trim());
    setNewPlaylistName("");
    setNewPlaylistDescription("");
  };

  const handleVolumeChange = (value) => {
    const next = Math.min(100, Math.max(1, value));
    setVolume(next);
    SetSystemVolume(next).catch(() => {
      setVolumeToast("System volume unavailable");
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
      toastTimerRef.current = setTimeout(() => setVolumeToast(""), 1600);
    });
  };  

  /* ---------------------- 暖色系 · 高级空状态 ---------------------- */
  /* ---------------------- 暖色系 · 图标可见但禁用 ---------------------- */
  const emptyFooter = (
    <footer
      className="
        h-28 
        bg-gradient-to-t from-amber-950 via-amber-900/95 to-amber-800/90
        backdrop-blur-xl
        border-t border-amber-700/40
        px-6 flex items-center justify-between
        shadow-[0_-4px_20px_rgba(0,0,0,0.35)]
      "
    >
      {/* 左侧：封面占位 + 文本 */}
      <div className="flex items-center gap-4 w-80 min-w-[320px]">
        <div className="
          w-16 h-16 rounded-lg 
          bg-amber-700/30 
          backdrop-blur-md 
          shadow-inner shadow-black/40
        " />

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base text-amber-100 tracking-wide">
            未播放歌曲
          </p>
          <p className="text-sm text-amber-300/70 mt-0.5">
            请选择一首歌曲开始播放
          </p>
        </div>
      </div>

      {/* 中间：播放控制（图标可见但禁用） */}
      <div className="flex flex-col items-center flex-1 max-w-2xl px-8">
        <div className="flex items-center gap-8 mb-3 opacity-50 pointer-events-none">

          {/* 随机播放 */}
          <svg className="w-6 h-6 text-amber-200/60" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4h2.5l3.5 5-3.5 5H4l3-5-3-5zm6 0h2l8 10v2h-2l-8-10V4zm0 10h2l3 4h-2l-3-4zM18 4h2v4h-2V4zM18 16h2v4h-2v-4z"/>
          </svg>

          {/* 上一首 */}
          <svg className="w-7 h-7 text-amber-200/60" viewBox="0 0 24 24">
            <path fill="currentColor" d="M6 6h2v12H6zm3 6l9 6V6z"/>
          </svg>

          {/* 播放按钮 */}
          <div className="
            w-14 h-14 rounded-full 
            bg-amber-200/20 
            backdrop-blur-md 
            shadow-inner shadow-black/40
            flex items-center justify-center
          ">
            <svg className="w-8 h-8 text-amber-100/70" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8 5v14l11-7z"/>
            </svg>
          </div>

          {/* 下一首 */}
          <svg className="w-7 h-7 text-amber-200/60" viewBox="0 0 24 24">
            <path fill="currentColor" d="M18 6h-2v12h2zm-3 6L6 18V6z"/>
          </svg>

          {/* 播放列表 */}
          <svg className="w-8 h-8 text-amber-200/60" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 6h14v2H3zm0 4h14v2H3zm0 4h10v2H3zm14 0v4l4-2z"/>
          </svg>
        </div>

        {/* 进度条 */}
        <div className="flex items-center gap-3 w-full opacity-50 pointer-events-none">
          <span className="text-xs text-amber-200/60 w-10 text-right">0:00</span>
          <div className="flex-1 h-1 rounded-full bg-amber-700/40" />
          <span className="text-xs text-amber-200/60 w-10">0:00</span>
        </div>
      </div>

      {/* 右侧：歌词 + 音量 + 收藏（图标可见但禁用） */}
      <div className="flex items-center gap-6 w-80 min-w-[320px] justify-end opacity-50 pointer-events-none">
        <svg className="w-6 h-6 text-amber-200/60" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 3L2 9l10 6 10-6-10-6z"/>
        </svg>

        <svg className="w-6 h-6 text-amber-200/60" viewBox="0 0 24 24">
          <path fill="currentColor" d="M5 9v6h4l5 5V4l-5 5H5z"/>
        </svg>

        <div className="w-28 h-1 rounded bg-amber-700/40" />

        <svg className="w-6 h-6 text-amber-200/60" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5..."/>
        </svg>
      </div>
    </footer>
  );


  /* ---------------------- 正常播放状态（保持你的原逻辑） ---------------------- */

  const PlayIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <path fill="currentColor" d="M8 5v14l11-7z" />
    </svg>
  );

  const PauseIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <path fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  );

  const PrevIcon = () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="currentColor" d="M6 6h2v12H6zm3 6l9 6V6z" />
    </svg>
  );

  const NextIcon = () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="currentColor" d="M18 6h-2v12h2zm-3 6L6 18V6z" />
    </svg>
  );

  const PlaylistIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <path fill="currentColor" d="M3 6h14v2H3zm0 4h14v2H3zm0 4h10v2H3zm14 0v4l4-2z" />
    </svg>
  );

  const VolumeIcon = React.memo(({ volume }) => {
    const level1 = Math.min(volume / 20, 1);
    const level2 = Math.min((volume - 20) / 20, 1);
    const level3 = Math.min((volume - 40) / 20, 1);
    const level4 = Math.min((volume - 60) / 20, 1);
    const level5 = Math.min((volume - 80) / 20, 1);

    return (
      <svg className="w-6 h-6 transition-all duration-200" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 9v6h4l5 5V4l-5 5H5z" />
        <path d="M14.5 12a2.5 2.5 0 0 0-1.2-2.2v4.4A2.5 2.5 0 0 0 14.5 12z" style={{ opacity: level1 }} />
        <path d="M16 12a4 4 0 0 0-2-3.4v6.8A4 4 0 0 0 16 12z" style={{ opacity: level2 }} />
        <path d="M17.5 12a5.5 5.5 0 0 0-2.5-4.7v9.4A5.5 5.5 0 0 0 17.5 12z" style={{ opacity: level3 }} />
        <path d="M19 12a7 7 0 0 0-3-6v12a7 7 0 0 0 3-6z" style={{ opacity: level4 }} />
        <path d="M20.5 12a8.5 8.5 0 0 0-3.5-7.2v14.4A8.5 8.5 0 0 0 20.5 12z" style={{ opacity: level5 }} />
      </svg>
    );
  });

  return (
    <>
    {!currentTrack ? (
      emptyFooter
    ) : (
      <footer className="h-28 bg-gradient-to-t from-amber-900 via-amber-800 to-amber-900 px-6 flex items-center justify-between border-t border-amber-700">
      {/* 左侧歌曲信息 */}
      <div className="flex items-center gap-4 w-80 min-w-[320px]">
        <button
          type="button"
          onClick={openLyrics}
          className="shrink-0 p-2 -m-2"
          aria-label="打开歌词"
        >
          <img
            src={currentTrack.cover}
            alt={currentTrack.name}
            className="w-16 h-16 rounded-lg object-cover shadow-lg cursor-pointer"
          />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base text-white truncate">{currentTrack.name}</p>
          <p className="text-sm text-amber-200 truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* 中间播放控制 */}
      <div className="flex flex-col items-center flex-1 max-w-2xl px-8">
        <div className="flex items-center gap-8 mb-3">
          <Tooltip text="随机播放">
            <button onClick={toggleShuffle} className={`p-2 -m-2 transition-all duration-200 hover:scale-110 ${shuffleMode ? "text-amber-300" : "text-amber-200 hover:text-white"}`}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h2.5l3.5 5-3.5 5H4l3-5-3-5zm6 0h2l8 10v2h-2l-8-10V4zm0 10h2l3 4h-2l-3-4zM18 4h2v4h-2V4zM18 16h2v4h-2v-4z" />
              </svg>
            </button>
          </Tooltip>

          <Tooltip text="上一首">
            <button onClick={playPrev} className="p-2 -m-2 text-amber-200 hover:text-white hover:scale-110 transition-all duration-200">
              <PrevIcon />
            </button>
          </Tooltip>

          <Tooltip text="播放/暂停">
            <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-white hover:bg-amber-100 text-black flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200">
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
          </Tooltip>

          <Tooltip text="下一首">
            <button onClick={playNext} className="p-2 -m-2 text-amber-200 hover:text-white hover:scale-110 transition-all duration-200">
              <NextIcon />
            </button>
          </Tooltip>

          <Tooltip text="播放列表">
            <button
              onClick={() => {
                setShowPlaylistDrawer(true);
                setActivePlaylistTab("queue");
              }}
              className="p-2 -m-2 text-amber-200 hover:text-white hover:scale-110 transition-all duration-200"
            >
              <PlaylistIcon />
            </button>
          </Tooltip>
        </div>

        {/* 进度条 */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs text-amber-200 w-10 text-right tabular-nums">{formatTime(currentTime)}</span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seekTo(Number(e.target.value))}
            className="flex-1 h-1 bg-amber-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(currentTime / duration) * 100}%, #78350f ${(currentTime / duration) * 100}%, #78350f 100%)`,
            }}
          />

          <span className="text-xs text-amber-200 w-10 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 右侧：歌词 + 音量 + 收藏 */}
      <div className="flex items-center gap-6 w-80 min-w-[320px] justify-end">
        {volumeToast && (
          <div className="absolute bottom-32 right-8 bg-amber-900/95 border border-amber-700/60 text-amber-100 text-xs px-3 py-1.5 rounded-lg shadow-lg">
            {volumeToast}
          </div>
        )}
        <button
          type="button"
          onClick={openLyricsOverlay}
          className="p-2 -m-2 text-amber-200 hover:text-white hover:scale-110 transition-all duration-200"
          aria-label="歌词"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L2 9l10 6 10-6-10-6z" />
          </svg>
        </button>
        <div className="relative" ref={volumePopoverRef}>
          <button
            onClick={() => setShowVolume((prev) => !prev)}
            className="p-2 -m-2 text-amber-200 hover:text-white hover:scale-110 transition-all duration-200"
            aria-label="音量"
          >
            <VolumeIcon volume={volume} />
          </button>

          {showVolume && (
            <div className="absolute bottom-10 right-0 w-40 bg-amber-900/95 border border-amber-700/60 rounded-xl p-3 shadow-xl backdrop-blur">
              <div className="flex items-center justify-between text-xs text-amber-100 mb-2">
                <span>音量</span>
                <span className="tabular-nums">{volume}</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full h-1 bg-amber-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${volume}%, #78350f ${volume}%, #78350f 100%)`,
                }}
              />
            </div>
          )}
        </div>

        <button onClick={() => toggleLike(currentTrack)} className="p-2 -m-2 text-2xl hover:scale-110 transition-transform duration-200">
          {isLiked(currentTrack.id) ? "❤️" : "🤍"}
        </button>
      </div>
      </footer>
    )}

    {showPlaylistDrawer && (
      <div className="fixed inset-0 z-40">
        <div
          className="absolute inset-0 bg-black/30"
          onClick={() => setShowPlaylistDrawer(false)}
        />
        <div className="absolute bottom-28 right-6 w-96 h-[28rem] bg-amber-950/95 border border-amber-800/60 rounded-2xl shadow-2xl backdrop-blur p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePlaylistTab("queue")}
                className={`text-sm px-3 py-1 rounded-full ${
                  activePlaylistTab === "queue" ? "bg-amber-700 text-white" : "text-amber-200"
                }`}
              >
                播放列表
              </button>
            </div>
            <button
              onClick={() => setShowPlaylistDrawer(false)}
              className="text-amber-200 text-sm"
            >
              关闭
            </button>
          </div>

          {activePlaylistTab === "queue" && (
            <div className="flex-1 overflow-auto" ref={queueListRef}>
              {playQueue.length === 0 && (
                <div className="text-amber-200/70 text-sm py-6 text-center">播放队列为空</div>
              )}
              {playQueue.map((track, index) => (
                <button
                  key={`${track.id}-${index}`}
                  ref={(el) => {
                    queueItemRefs.current[index] = el;
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    index === highlightedIndex
                      ? "bg-amber-700/60 text-white"
                      : "hover:bg-amber-800/40"
                  }`}
                  onClick={() => playTrackWithURL(track, playQueue)}
                >
                  <div className={`text-sm truncate ${index === highlightedIndex ? "text-white" : "text-amber-100"}`}>{track.name}</div>
                  <div className={`text-xs truncate ${index === highlightedIndex ? "text-amber-100" : "text-amber-300/70"}`}>{track.artist}</div>
                </button>
              ))}
            </div>
          )}          
        </div>
      </div>
    )}

    {playlistPickerSong && (
      <div className="fixed inset-0 z-50">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => {
            closePlaylistPicker();
            setNewPlaylistName("");
            setNewPlaylistDescription("");
          }}
        />
        <div className="absolute top-1/2 left-1/2 w-[28rem] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 bg-amber-950/95 border border-amber-800/60 rounded-2xl shadow-2xl backdrop-blur p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-amber-100 text-sm">
              添加到歌单
            </div>
            <button
              onClick={() => {
                closePlaylistPicker();
                setNewPlaylistName("");
                setNewPlaylistDescription("");
              }}
              className="text-amber-200 text-sm"
            >
              关闭
            </button>
          </div>

          <div className="mb-3 text-amber-200 text-xs truncate">
            当前歌曲：{playlistPickerSong?.name || "未知"}
          </div>

          <div className="mb-4 space-y-2">
            <input
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="新歌单名称"
              className="w-full px-3 py-2 rounded-lg bg-amber-900/70 border border-amber-800/60 text-amber-100 text-sm outline-none focus:border-amber-600"
            />
            <input
              value={newPlaylistDescription}
              onChange={(e) => setNewPlaylistDescription(e.target.value)}
              placeholder="描述（可选）"
              className="w-full px-3 py-2 rounded-lg bg-amber-900/70 border border-amber-800/60 text-amber-100 text-sm outline-none focus:border-amber-600"
            />
            <button
              onClick={handleCreatePlaylist}
              className="w-full py-2 rounded-lg bg-amber-600 text-white text-sm hover:bg-amber-500 transition"
            >
              创建歌单
            </button>
          </div>

          <div className="max-h-64 overflow-auto">
            {playlistLoading && (
              <div className="text-amber-200/70 text-sm py-4 text-center">加载中...</div>
            )}
            {!playlistLoading && userPlaylists.length === 0 && (
              <div className="text-amber-200/70 text-sm py-4 text-center">还没有歌单</div>
            )}
            {!playlistLoading && userPlaylists.map((playlist) => (
              <button
                key={playlist.id}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-800/40 transition flex items-center justify-between"
                onClick={() => handleAddSongToPlaylist(playlist.id)}
              >
                <div className="min-w-0">
                  <div className="text-amber-100 text-sm truncate">{playlist.name}</div>
                  <div className="text-amber-300/70 text-xs truncate">{playlist.description || "暂无描述"}</div>
                </div>
                <div className="text-amber-200 text-xs">添加</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default React.memo(DesktopPlayerBar);
