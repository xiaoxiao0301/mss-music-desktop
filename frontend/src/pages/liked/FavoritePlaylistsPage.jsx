import { useFavorite } from "../../context/MusicContext";

export default function FavoritePlaylistsPage() {
  const { favoritePlaylists, toggleFavoritePlaylist } = useFavorite();  
  return (
    <div className="flex flex-col h-full overflow-auto">

      <h1 className="text-2xl font-bold mb-4">❤️ 收藏的歌单</h1>

      <div className="grid grid-cols-4 gap-4">
        {favoritePlaylists.map(pl => (
          <div
            key={pl.id}
            className="card p-4 cursor-pointer hover:bg-warm-secondary/40 transition rounded-xl"
          >
            <img src={pl.cover} className="w-full h-40 rounded-lg object-cover" />
            <p className="mt-3 font-bold">{pl.name}</p>
            <button onClick={() => toggleFavoritePlaylist(pl)}
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
