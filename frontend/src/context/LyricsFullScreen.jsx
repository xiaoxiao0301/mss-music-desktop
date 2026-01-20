export default function LyricsFullScreen({ currentTrack, currentTime, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/90 text-white flex flex-col items-center justify-center p-10 z-50">

      <button onClick={onClose} className="absolute top-6 right-6 text-3xl">✖</button>

      <h2 className="text-3xl font-bold mb-6">{currentTrack.name}</h2>
      <p className="text-lg text-gray-400 mb-10">{currentTrack.artist}</p>

      <div className="w-full max-w-2xl text-center space-y-4">
        {currentTrack.lyrics.map((line, index) => (
          <p
            key={index}
            className={`text-xl transition ${
              currentTime >= line.time ? "text-white font-bold" : "text-gray-500"
            }`}
          >
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
}
