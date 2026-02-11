import { useFavorite } from "../context/MusicContext";

export default function PlayerBar({
  currentTrack,
  isPlaying,
  togglePlay,
  playNext,
  playPrev,
  currentTime,
  duration,
  seekTo,
  volume,
  setVolume,
  openLyrics,
  formatTime
}) {
  const { isLiked, toggleLike } = useFavorite();

  return (
    <footer className="h-24 bg-warm-card px-6 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">

      {/* 左侧：歌曲信息 */}
      <div className="flex items-center gap-4 w-1/4">
        <img src={currentTrack.cover} className="w-14 h-14 rounded-lg object-cover" />
        <div>
          <p className="font-medium text-sm">{currentTrack.name}</p>
          <p className="text-xs text-warm-subtext">{currentTrack.artist}</p>
        </div>

        <button onClick={() => toggleLike(currentTrack)} className="text-xl">
          {isLiked(currentTrack.id) ? "❤️" : "🤍"}
        </button>
      </div>

      {/* 中间：播放控制 */}
      <div className="flex flex-col items-center w-2/4">
        <div className="flex items-center gap-6 mb-2">
          <button onClick={playPrev} className="text-2xl">⏮️</button>
          <button onClick={togglePlay} className="text-4xl">
            {isPlaying ? "⏸️" : "▶️"}
          </button>
          <button onClick={playNext} className="text-2xl">⏭️</button>

          <button onClick={openLyrics} className="text-xl">📃</button>
        </div>

        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-warm-subtext">{formatTime(currentTime)}</span>

          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => seekTo(e.target.value)}
            className="w-full"
          />

          <span className="text-xs text-warm-subtext">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 右侧：音量 */}
      <div className="flex items-center gap-3 w-1/4 justify-end">
        <span>🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        />
      </div>
    </footer>
  );
}
