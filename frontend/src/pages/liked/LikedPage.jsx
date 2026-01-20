import { useFavorite } from "../../context/MusicContext";

export default function LikedPage() {
  const { likedSongs, toggleLike } = useFavorite();

  return (
    <div className="flex flex-col h-full overflow-auto">

      <h1 className="text-2xl font-bold mb-4">❤️ 喜欢的音乐</h1>

      <div className="flex flex-col gap-3">
        {likedSongs.map(song => (
          <div
            key={song.id}
            className="card p-3 flex items-center gap-4 hover:bg-warm-secondary/40 transition rounded-xl cursor-pointer"
          >
            <img
              src={song.cover}
              className="w-14 h-14 rounded-lg object-cover shadow"
            />

            <div className="flex-1">
              <p className="font-bold">{song.name}</p>
              <p className="text-sm text-warm-subtext">{song.artist}</p>
            </div>

            <button onClick={() => toggleLike(song)}
                className="text-xl text-red-500 hover:scale-110 transition"
            >
                ❤️
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
