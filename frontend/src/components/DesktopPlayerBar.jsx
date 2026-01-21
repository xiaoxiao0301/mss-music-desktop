import { useFavorite, useMusicPlayer } from "../context/MusicContext";
import Tooltip from "./Tooltip.jsx";

export default function DesktopPlayerBar() {
  const { 
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
    repeatMode,
    shuffleMode,
    toggleRepeat,
    toggleShuffle,
    setShowLyrics,
    formatTime
  } = useMusicPlayer();
  
  const { isLiked, toggleLike } = useFavorite();

  const RepeatIcon = () => {
    if (repeatMode === "one") {
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="currentColor" d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
          <text x="12" y="16" fontSize="8" textAnchor="middle" fill="currentColor">1</text>
        </svg>
      );
    }
    if (repeatMode === "all") {
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="currentColor" d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path fill="currentColor" d="M4 4h16v2H4zm0 6h10v2H4zm0 6h16v2H4z"/>
      </svg>
    );
  };

  const ShuffleIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4h2.5l3.5 5-3.5 5H4l3-5-3-5zm6 0h2l8 10v2h-2l-8-10V4zm0 10h2l3 4h-2l-3-4zM18 4h2v4h-2V4zM18 16h2v4h-2v-4z"/>
    </svg>
  );

  const PlayIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <path fill="currentColor" d="M8 5v14l11-7z"/>
    </svg>
  );

  const PauseIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <path fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z"/>
    </svg>
  );

  const PrevIcon = () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="currentColor" d="M6 6h2v12H6zm3 6l9 6V6z"/>
    </svg>
  );

  const NextIcon = () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      <path fill="currentColor" d="M18 6h-2v12h2zm-3 6L6 18V6z"/>
    </svg>
  );

  const LyricsIcon = () => (
    <span className="px-1.5 py-0.5 border border-amber-300 text-amber-200 text-sm rounded">
        词
    </span>
  );


  const PlaylistIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <path fill="currentColor" d="M3 6h14v2H3zm0 4h14v2H3zm0 4h10v2H3zm14 0v4l4-2z"/>
    </svg>
  );

  const VolumeIcon = ({ volume }) => {
    // 计算 5 条声波的渐变程度（0~1）
    const level1 = Math.min(volume / 20, 1);          // 0~20
    const level2 = Math.min((volume - 20) / 20, 1);   // 20~40
    const level3 = Math.min((volume - 40) / 20, 1);   // 40~60
    const level4 = Math.min((volume - 60) / 20, 1);   // 60~80
    const level5 = Math.min((volume - 80) / 20, 1);   // 80~100

    return (
        <svg
        className="w-6 h-6 transition-all duration-200"
        viewBox="0 0 24 24"
        fill="currentColor"
        >
        {/* 喇叭主体 */}
        <path d="M5 9v6h4l5 5V4l-5 5H5z" />

        {/* 声波 1（最短） */}
        <path
            d="M14.5 12a2.5 2.5 0 0 0-1.2-2.2v4.4A2.5 2.5 0 0 0 14.5 12z"
            style={{
            opacity: level1,
            transform: `scale(${0.6 + level1 * 0.4})`,
            transformOrigin: "center",
            transition: "all 0.25s ease"
            }}
        />

        {/* 声波 2 */}
        <path
            d="M16 12a4 4 0 0 0-2-3.4v6.8A4 4 0 0 0 16 12z"
            style={{
            opacity: level2,
            transform: `scale(${0.6 + level2 * 0.4})`,
            transformOrigin: "center",
            transition: "all 0.25s ease"
            }}
        />

        {/* 声波 3 */}
        <path
            d="M17.5 12a5.5 5.5 0 0 0-2.5-4.7v9.4A5.5 5.5 0 0 0 17.5 12z"
            style={{
            opacity: level3,
            transform: `scale(${0.6 + level3 * 0.4})`,
            transformOrigin: "center",
            transition: "all 0.25s ease"
            }}
        />

        {/* 声波 4 */}
        <path
            d="M19 12a7 7 0 0 0-3-6v12a7 7 0 0 0 3-6z"
            style={{
            opacity: level4,
            transform: `scale(${0.6 + level4 * 0.4})`,
            transformOrigin: "center",
            transition: "all 0.25s ease"
            }}
        />

        {/* 声波 5（最长） */}
        <path
            d="M20.5 12a8.5 8.5 0 0 0-3.5-7.2v14.4A8.5 8.5 0 0 0 20.5 12z"
            style={{
            opacity: level5,
            transform: `scale(${0.6 + level5 * 0.4})`,
            transformOrigin: "center",
            transition: "all 0.25s ease"
            }}
        />
        </svg>
    );
   };




  return (
    <footer className="h-28 bg-gradient-to-t from-amber-900 via-amber-800 to-amber-900 px-6 flex items-center justify-between border-t border-amber-700">

  {/* 左侧：歌曲信息 */}
  <div className="flex items-center gap-4 w-80 min-w-[320px]">
    <img 
      src={currentTrack.cover} 
      className="w-16 h-16 rounded-lg object-cover shadow-lg" 
    />

    <div className="flex-1 min-w-0">
      <p className="font-semibold text-base text-white truncate">{currentTrack.name}</p>
      <p className="text-sm text-amber-200 truncate">{currentTrack.artist}</p>
    </div>
  </div>

  {/* 中间：播放控制 */}
  <div className="flex flex-col items-center flex-1 max-w-2xl px-8">
    <div className="flex items-center gap-8 mb-3">
    <Tooltip text="随机播放">
      <button 
        onClick={toggleShuffle}
        className={`transition-all duration-200 hover:scale-110 ${
          shuffleMode ? 'text-amber-300' : 'text-amber-200 hover:text-white'
        }`}
      >
        <ShuffleIcon />
      </button>
    </Tooltip>

    <Tooltip text="上一首">    
      <button onClick={playPrev} className="text-amber-200 hover:text-white hover:scale-110 transition-all duration-200">
        <PrevIcon />
      </button>
    </Tooltip>  

    <Tooltip text="播放/暂停">  
      <button 
        onClick={togglePlay} 
        className="w-14 h-14 rounded-full bg-white hover:bg-amber-100 text-black flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
    </Tooltip>  

    <Tooltip text="下一首">  
      <button onClick={playNext} className="text-amber-200 hover:text-white hover:scale-110 transition-all duration-200">
        <NextIcon />
      </button>
    </Tooltip>

    <Tooltip text="播放列表"> 
      {/* 播放列表 */}
      <button className="text-amber-200 hover:text-white hover:scale-110 transition-all duration-200">
        <PlaylistIcon />
      </button>  
    </Tooltip>  

      {/* <button 
        onClick={toggleRepeat}
        className={`transition-all duration-200 hover:scale-110 ${
          repeatMode !== 'off' ? 'text-amber-300' : 'text-amber-200 hover:text-white'
        }`}
      >
        <RepeatIcon />
      </button> */}
    </div>

    {/* 进度条 */}
    <div className="flex items-center gap-3 w-full">
      <span className="text-xs text-amber-200 w-10 text-right tabular-nums">
        {formatTime(currentTime)}
      </span>

      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={(e) => seekTo(Number(e.target.value))}
        className="flex-1 h-1 bg-amber-700 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(currentTime / duration) * 100}%, #78350f ${(currentTime / duration) * 100}%, #78350f 100%)`
        }}
      />

      <span className="text-xs text-amber-200 w-10 tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  </div>

  {/* 右侧：歌词 + 音量 + 收藏 + 播放列表 */}
  <div className="flex items-center gap-6 w-80 min-w-[320px] justify-end">

    {/* 歌词 */}
    <button 
      onClick={() => setShowLyrics(true)}
      className="text-amber-200 hover:text-white hover:scale-110 transition-all duration-20"
    >
      <LyricsIcon />
    </button>

    {/* 音量图标（桌面版 SVG） */}
    <div className="text-amber-200">
      <VolumeIcon volume={volume} />
    </div>

    {/* 音量条 */}
    <input
      type="range"
      min="0"
      max="100"
      value={volume}
      onChange={(e) => setVolume(Number(e.target.value))}
      className="w-28 h-1 bg-amber-700 rounded-lg appearance-none cursor-pointer"
      style={{
        background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${volume}%, #78350f ${volume}%, #78350f 100%)`
      }}
    />

    {/* 收藏按钮移到右侧 */}
    <button 
      onClick={() => toggleLike(currentTrack)} 
      className="text-2xl hover:scale-110 transition-transform duration-200"
    >
      {isLiked(currentTrack.id) ? "❤️" : "🤍"}
    </button>

    
  </div>
</footer>

  );
}
