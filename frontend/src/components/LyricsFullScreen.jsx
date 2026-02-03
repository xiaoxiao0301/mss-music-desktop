import { useEffect, useRef } from "react";
import { useMusicPlayer } from "../context/MusicContext";

export default function LyricsFullScreen({ currentTrack, onClose }) {
  const { audioRef } = useMusicPlayer();

  const containerRef = useRef(null);
  const linesRef = useRef([]);

  useEffect(() => {
    if (!currentTrack?.lyrics) return;

    let frameId;

    const update = () => {
      const time = audioRef.current?.currentTime || 0;   // ⭐ 直接读取 audio.currentTime

      // 找到当前行
      const index = currentTrack.lyrics.findIndex(
        (l, i) =>
          time >= l.time &&
          (i === currentTrack.lyrics.length - 1 || time < currentTrack.lyrics[i + 1].time)
      );

      if (index !== -1) {
        // 高亮
        linesRef.current.forEach((el, i) => {
          if (!el) return;
          el.style.opacity = i === index ? "1" : "0.4";
          el.style.transform = i === index ? "scale(1.1)" : "scale(1)";
        });

        // 滚动
        const active = linesRef.current[index];
        if (active && containerRef.current) {
          containerRef.current.scrollTo({
            top: active.offsetTop - containerRef.current.clientHeight / 2 + 40,
            behavior: "smooth",
          });
        }
      }

      frameId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(frameId);
  }, [currentTrack]);   // ⭐ 不依赖 currentTime

  return (
    <div className="fixed inset-0 bg-black/90 text-white flex flex-col items-center p-10 z-50">

      <button onClick={onClose} className="absolute top-6 right-6 text-3xl">✖</button>

      <h2 className="text-3xl font-bold mb-2">{currentTrack.name}</h2>
      <p className="text-lg text-gray-400 mb-8">{currentTrack.artist}</p>

      <div
        ref={containerRef}
        className="w-full max-w-2xl text-center space-y-6 overflow-y-auto h-[70vh] no-scrollbar"
      >
        {currentTrack.lyrics.map((line, index) => (
          <p
            key={index}
            ref={(el) => (linesRef.current[index] = el)}
            className="text-xl transition-all duration-300 opacity-40"
          >
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
}
