import { useState } from "react";

export default function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {/* Tooltip 气泡 */}
      <div
        className={`
          absolute -top-10 left-1/2 -translate-x-1/2
          px-2 py-1 rounded-md text-xs whitespace-nowrap
          bg-amber-800 text-amber-100 border border-amber-600 shadow-lg
          transition-opacity duration-200
          ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        {text}

        {/* 小三角形 */}
        <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 
                        w-0 h-0 border-l-6 border-r-6 border-t-6 
                        border-l-transparent border-r-transparent border-t-amber-800">
        </div>
      </div>
    </div>
  );
}
