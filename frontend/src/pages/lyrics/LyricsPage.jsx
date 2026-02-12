import React, { useRef, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useMusicPlayer } from "../../context/MusicContext";
import "../../styles/LyricsPage.css";

export default function LyricsPage({ currentTrack, currentTime, onClose }) {
  const lyricsContainerRef = useRef(null);
  const activeLineRef = useRef(null);
  const coverUrl = currentTrack.cover || "";
  const albumName = currentTrack.albumname || "";
  const artistName = currentTrack.artist || "";
  const trackName = currentTrack.name || "";
  const { playPrev, playNext } = useMusicPlayer();

  const PrevIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6">
      <path fill="currentColor" d="M6 6h2v12H6zm3 6l9 6V6z" />
    </svg>
  );

  const NextIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6">
      <path fill="currentColor" d="M18 6h-2v12h2zm-3 6L6 18V6z" />
    </svg>
  );

  const lyrics = useMemo(() => {
    if (!currentTrack.lyrics || currentTrack.lyrics.length === 0) {
      return [{ time: 0, text: '纯音乐，请欣赏' }];
    }
    return currentTrack.lyrics;
  }, [currentTrack.lyrics]);

  const activeLineIndex = useMemo(() => {
    let index = lyrics.findIndex((line, i) => {
      const nextLine = lyrics[i + 1];
      return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });
    return index === -1 ? 0 : index;
  }, [currentTime, lyrics]);


  useEffect(() => {
    if (activeLineRef.current && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const activeLine = activeLineRef.current;

      const containerHeight = container.clientHeight;
      const activeLineOffsetTop = activeLine.offsetTop;
      const activeLineHeight = activeLine.clientHeight;

      // Center the active line
      const scrollPosition = activeLineOffsetTop - (containerHeight / 2) + (activeLineHeight / 2);

      container.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      });
    }
    // 依赖项加入 trackName/coverUrl，切歌或点击图片时也能滚动
  }, [activeLineIndex, trackName, coverUrl]);

  return (
    <div className="lyrics-page fixed inset-0 z-40 text-white flex flex-col">
      {/* Background */}
      <div
        className="lyrics-page-background"
        style={{ backgroundImage: `url(${coverUrl})` }}
      />
      <div className="lyrics-page-overlay" />

      {/* Collapse Button */}
      <div className="lyrics-close-wrap">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose?.();
          }}
          className="lyrics-close-btn"
        >
          <ChevronDown size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-6 lg:p-12 z-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Column: Song Info */}
          <div className="flex flex-col items-center text-center">
            <div className="relative group w-64 h-64 lg:w-80 lg:h-80">
              <img
                src={coverUrl}
                alt={albumName}
                className="w-full h-full rounded-lg shadow-2xl object-cover"
              />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mt-6">{trackName}</h1>
            <p className="text-lg lg:text-xl text-amber-100/80 mt-2">
              {artistName}
            </p>
            <p className="text-sm lg:text-base text-amber-200/70 mt-1">
              专辑：{albumName || "未知专辑"}
            </p>
            <div className="mt-6 flex items-center gap-6">
              <button
                type="button"
                onClick={playPrev}
                className="p-3 rounded-full border border-amber-200/40 text-amber-100 hover:text-white hover:bg-amber-200/10 hover:scale-110 transition-all duration-200"
                aria-label="上一首"
              >
                <PrevIcon />
              </button>
              <button
                type="button"
                onClick={playNext}
                className="p-3 rounded-full border border-amber-200/40 text-amber-100 hover:text-white hover:bg-amber-200/10 hover:scale-110 transition-all duration-200"
                aria-label="下一首"
              >
                <NextIcon />
              </button>
            </div>
          </div>

          {/* Right Column: Lyrics */}
          <div
            ref={lyricsContainerRef}
            className="lyrics-container h-[40vh] lg:h-[60vh] flex justify-center items-center"
          >
            <div className="lyrics-scroll text-center">
              {lyrics.map((line, index) => (
                <p
                  key={line.time + '-' + index}
                  ref={index === activeLineIndex ? activeLineRef : null}
                  className={`lyric-line text-2xl lg:text-3xl p-2 transition-all duration-500 ${
                    index === activeLineIndex
                      ? "lyric-active font-bold text-orange-300"
                      : "lyric-idle text-gray-400"
                  }`}
                >
                  {line.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
