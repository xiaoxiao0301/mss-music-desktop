import React, { useEffect, useMemo, useRef, useState } from "react";
import { WindowSetAlwaysOnTop } from "../../wailsjs/runtime/runtime";

function hexToRgb(hex) {
  if (!hex) return { r: 0, g: 0, b: 0 };
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized
        .split("")
        .map((c) => c + c)
        .join("")
    : normalized;
  const num = parseInt(value, 16);
  if (Number.isNaN(num)) return { r: 0, g: 0, b: 0 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export default function LyricsOverlay({ currentTrack, currentTime, isPlaying, onClose }) {
  const [position, setPosition] = useState({ x: 80, y: 80 });
  const [dragging, setDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const lyricsContainerRef = useRef(null);
  const activeLineRef = useRef(null);

  const [fontSize, setFontSize] = useState(18);
  const [textColor, setTextColor] = useState("#F8E3C7");
  const [backgroundColor, setBackgroundColor] = useState("#1B1F2A");
  const [backgroundAlpha, setBackgroundAlpha] = useState(0.85);
  const [showSettings, setShowSettings] = useState(false);

  const title = currentTrack?.name || "";
  const artist = currentTrack?.artist || "";

  const lyrics = useMemo(() => {
    if (!currentTrack?.lyrics || currentTrack.lyrics.length === 0) {
      return [{ time: 0, text: "No lyrics available" }];
    }
    return currentTrack.lyrics;
  }, [currentTrack]);

  const activeLineIndex = useMemo(() => {
    if (!lyrics.length) return 0;
    const index = lyrics.findIndex((line, i) => {
      const nextLine = lyrics[i + 1];
      return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });
    return index === -1 ? 0 : index;
  }, [currentTime, lyrics]);

  useEffect(() => {
    WindowSetAlwaysOnTop(true);
    return () => {
      WindowSetAlwaysOnTop(false);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    if (activeLineRef.current && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const activeLine = activeLineRef.current;
      const containerHeight = container.clientHeight;
      const activeLineOffsetTop = activeLine.offsetTop;
      const activeLineHeight = activeLine.clientHeight;
      const scrollPosition = activeLineOffsetTop - (containerHeight / 2) + (activeLineHeight / 2);
      container.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [activeLineIndex, isPlaying]);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (event) => {
      setPosition({
        x: event.clientX - dragOffsetRef.current.x,
        y: event.clientY - dragOffsetRef.current.y,
      });
    };
    const handleUp = () => setDragging(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragging]);

  const handleDragStart = (event) => {
    setDragging(true);
    dragOffsetRef.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
  };

  const { r, g, b } = hexToRgb(backgroundColor);
  const overlayBackground = `rgba(${r}, ${g}, ${b}, ${backgroundAlpha})`;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        className="absolute pointer-events-auto w-[720px] max-w-[92vw] shadow-2xl rounded-full border border-white/10 backdrop-blur"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          backgroundColor: overlayBackground,
        }}
      >
        <div
          className="flex items-center gap-4 px-5 py-3 cursor-move select-none"
          onMouseDown={handleDragStart}
        >
          <div className="flex flex-col min-w-0 w-48">
            <span className="text-sm font-semibold text-white truncate">{title || "Unknown Track"}</span>
            <span className="text-xs text-white/70 truncate">{artist || "Unknown Artist"}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div
              ref={lyricsContainerRef}
              className="h-12 overflow-y-auto"
            >
              {lyrics.map((line, index) => (
                <p
                  key={`${line.time}-${index}`}
                  ref={index === activeLineIndex ? activeLineRef : null}
                  className={`transition-all duration-300 truncate ${
                    index === activeLineIndex ? "font-semibold" : "opacity-60"
                  }`}
                  style={{
                    color: textColor,
                    fontSize: `${fontSize}px`,
                    textShadow: index === activeLineIndex ? "0 2px 10px rgba(0,0,0,0.35)" : "none",
                    lineHeight: "1.4",
                  }}
                >
                  {line.text}
                </p>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isPlaying && (
              <span className="text-[10px] uppercase text-white/70">Paused</span>
            )}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setShowSettings((prev) => !prev);
              }}
              className="text-xs px-2 py-1 rounded bg-white/10 text-white hover:bg-white/20"
            >
              Aa
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onClose?.();
              }}
              className="text-xs px-2 py-1 rounded bg-white/10 text-white hover:bg-white/20"
            >
              Close
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="absolute right-4 top-full mt-2 w-64 rounded-xl border border-white/10 bg-black/70 backdrop-blur p-3 text-xs text-white/80 pointer-events-auto">
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                Font
                <input
                  type="range"
                  min="14"
                  max="28"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                />
              </label>
              <label className="flex flex-col gap-1">
                Text
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-7 w-full rounded"
                />
              </label>
              <label className="flex flex-col gap-1">
                Background
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-7 w-full rounded"
                />
              </label>
              <label className="flex flex-col gap-1">
                Alpha
                <input
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.05"
                  value={backgroundAlpha}
                  onChange={(e) => setBackgroundAlpha(Number(e.target.value))}
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
