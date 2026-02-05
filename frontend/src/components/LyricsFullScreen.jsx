import { useEffect, useRef, useState } from "react";
import { useMusicPlayer } from "../context/MusicContext";

export default function LyricsFullScreen({ currentTrack, onClose }) {
  const { audioRef } = useMusicPlayer();

  const containerRef = useRef(null);
  const lineRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!currentTrack?.lyrics) return;

    let frameId;

    const update = () => {
      const time = audioRef.current?.currentTime || 0;

      // 找到当前行
      const index = currentTrack.lyrics.findIndex(
        (l, i) =>
          time >= l.time &&
          (i === currentTrack.lyrics.length - 1 ||
            time < currentTrack.lyrics[i + 1].time)
      );

      if (index !== -1 && index !== activeIndex) {
        setActiveIndex(index);

        // 自动滚动
        const activeEl = lineRefs.current[index];
        if (activeEl && containerRef.current) {
          const target =
            activeEl.offsetTop -
            containerRef.current.clientHeight / 2 +
            activeEl.clientHeight;

          containerRef.current.scrollTo({
            top: target,
            behavior: "smooth",
          });
        }
      }

      frameId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(frameId);
  }, [currentTrack, activeIndex]);

  return (
    <div className="fixed inset-0 bg-black/90 text-white flex flex-col items-center p-10 z-50">

      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-3xl opacity-70 hover:opacity-100"
      >
        ✖
      </button>

      <h2 className="text-3xl font-bold mb-1">{currentTrack.name}</h2>
      <p className="text-lg text-gray-400 mb-8">{currentTrack.artist}</p>

      <div
        ref={containerRef}
        className="w-full max-w-2xl text-center overflow-y-auto h-[70vh] no-scrollbar py-10"
      >
        {currentTrack.lyrics.length === 0 && (
          <p className="text-gray-400 text-xl">纯音乐，请欣赏</p>
        )}

        {currentTrack.lyrics.map((line, index) => (
          <div
            key={index}
            ref={(el) => (lineRefs.current[index] = el)}
            className={`transition-all duration-300 my-4 ${
              index === activeIndex
                ? "text-2xl font-bold text-white scale-110"
                : "text-xl text-gray-500 opacity-50"
            }`}
          >
            <p>{line.text}</p>

            {line.trans && (
              <p
                className={`text-base mt-1 transition-opacity ${
                  index === activeIndex ? "opacity-80" : "opacity-30"
                }`}
              >
                {line.trans}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
