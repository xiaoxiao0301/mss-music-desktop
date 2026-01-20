import { useState, useEffect } from "react";
import {
  WindowMinimise,
  WindowMaximise,
  WindowUnmaximise,
  Quit,
  WindowIsMaximised,
  Environment
} from "wailsjs/runtime";

export default function TitleBar() {
  const [isMax, setIsMax] = useState(false);
  const [isMac, setIsMac] = useState(true);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    WindowIsMaximised().then(setIsMax);
    Environment().then((env) => {
      setIsMac(env.platform === "darwin");
    });
  }, []);

  const toggleMax = async () => {
    const max = await WindowIsMaximised();
    if (max) {
      WindowUnmaximise();
    } else {
      WindowMaximise();
    }
    setIsMax(!max);
  };

  return (
    <div
      className="w-full h-12 flex items-center justify-between px-3 bg-warm-card"
      style={{ WebkitAppRegion: "drag" }}
    >
      {/* macOS: 左侧按钮 */}
      {isMac ? (
        <>
          <div
            className="flex items-center gap-2 pl-2"
            style={{ WebkitAppRegion: "no-drag" }}
          >
            <button
              onClick={() => Quit()}
              onMouseEnter={() => setHovered('close')}
              onMouseLeave={() => setHovered(null)}
              className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#FF5F56]/90 border border-[#E0443E]/20 cursor-pointer transition-all duration-150 flex items-center justify-center group"
              aria-label="关闭"
            >
              {hovered === 'close' && (
                <span className="text-[#4d0000] text-[8px] font-bold leading-none">✕</span>
              )}
            </button>
            <button
              onClick={() => WindowMinimise()}
              onMouseEnter={() => setHovered('min')}
              onMouseLeave={() => setHovered(null)}
              className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/90 border border-[#DEA123]/20 cursor-pointer transition-all duration-150 flex items-center justify-center"
              aria-label="最小化"
            >
              {hovered === 'min' && (
                <span className="text-[#995700] text-[10px] font-bold leading-none">−</span>
              )}
            </button>
            <button
              onClick={toggleMax}
              onMouseEnter={() => setHovered('max')}
              onMouseLeave={() => setHovered(null)}
              className="w-3 h-3 rounded-full bg-[#27C93F] hover:bg-[#27C93F]/90 border border-[#1AAB29]/20 cursor-pointer transition-all duration-150 flex items-center justify-center"
              aria-label="最大化/还原"
            >
              {hovered === 'max' && (
                <span className="text-[#006500] text-[8px] font-bold leading-none">
                  {isMax ? '−' : '+'}
                </span>
              )}
            </button>
          </div>
          <div className="text-sm font-medium text-warm-text select-none">
            沐音
          </div>
          <div className="w-[60px]"></div>
        </>
      ) : (
        /* Windows/Linux: 右侧按钮 */
        <>
          <div className="w-[60px]"></div>
          <div className="text-sm font-medium text-warm-text select-none">
            沐音
          </div>
          <div
            className="flex items-center gap-1"
            style={{ WebkitAppRegion: "no-drag" }}
          >
            <button
              onClick={() => WindowMinimise()}
              className="w-10 h-8 flex items-center justify-center hover:bg-warm-secondary/60 transition-colors"
              aria-label="最小化"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" className="text-warm-text">
                <rect x="0" y="5" width="12" height="2" fill="currentColor"/>
              </svg>
            </button>
            <button
              onClick={toggleMax}
              className="w-10 h-8 flex items-center justify-center hover:bg-warm-secondary/60 transition-colors"
              aria-label="最大化/还原"
            >
              {isMax ? (
                <svg width="12" height="12" viewBox="0 0 12 12" className="text-warm-text">
                  <rect x="2" y="0" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1"/>
                  <rect x="0" y="2" width="10" height="10" fill="currentColor"/>
                  <rect x="1" y="3" width="8" height="8" fill="var(--warm-card)"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" className="text-warm-text">
                  <rect x="0" y="0" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1"/>
                </svg>
              )}
            </button>
            <button
              onClick={() => Quit()}
              className="w-10 h-8 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
              aria-label="关闭"
            >
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="M 1 1 L 11 11 M 11 1 L 1 11" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
