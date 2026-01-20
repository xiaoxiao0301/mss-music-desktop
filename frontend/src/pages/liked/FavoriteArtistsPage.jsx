import { useFavorite } from "../../context/MusicContext";

export default function FavoriteArtistsPage() {
  const { favoriteArtists, toggleFavoriteArtist } = useFavorite();

  return (
    <div className="flex flex-col h-full overflow-auto">

      <h1 className="text-2xl font-bold mb-4">❤️ 收藏的歌手</h1>

      <div className="grid grid-cols-6 gap-6">
        {favoriteArtists.map(ar => (
          <div
            key={ar.id}
            className="flex flex-col items-center p-4 card hover:bg-warm-secondary/40 transition rounded-xl"
          >
            <img src={ar.avatar} className="w-24 h-24 rounded-full object-cover shadow mb-3" />
            <p className="font-bold text-center">{ar.name}</p>

            <button
              onClick={() => toggleFavoriteArtist(ar)}
              className="text-red-500 text-sm mt-2"
            >
              ❤️ 取消收藏
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
