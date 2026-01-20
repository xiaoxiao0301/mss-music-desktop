import { mockPlaylists, mockSongs } from "../../mock/playlists";
import TopNavBar from "../../components/TopNavBar";
import { useFavorite } from "../../context/MusicContext";

export default function PlaylistDetailPage({ playlistId, onBack }) {
  const playlist = mockPlaylists.find((p) => p.id === playlistId) || mockPlaylists[0];
  const songs = mockSongs.filter(s => s.playlistId === playlist.id);
  const { isLiked, toggleLike, isFavoritePlaylist, toggleFavoritePlaylist } = useFavorite();

  return (
    <div>
      <TopNavBar
        onBack={onBack}
      />

      <button
        onClick={() => toggleFavoritePlaylist(playlist)}
        className={`px-4 py-2 rounded-lg text-sm ${
            isFavoritePlaylist(playlist.id)
            ? "bg-red-500 text-white"
            : "bg-warm-secondary hover:bg-warm-secondary/70"
        }`}
        >
            {isFavoritePlaylist(playlist.id) ? "❤️ 已收藏" : "🤍 收藏歌单"}
        </button>


      <div className="flex gap-6 mb-6">
        <img
          src={playlist.cover}
          className="w-40 h-40 rounded-xl object-cover shadow-warm"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
          <p className="text-warm-subtext">{playlist.desc}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-3">歌曲列表</h2>

      <div className="card">
        {songs.map((song) => (
          <div key={song.id} className="list-item">
            <span>{song.name}</span>
            <span className="text-sm text-warm-subtext">{song.duration}</span>
            <button
              onClick={() => toggleLike(song)}
              className={`text-xl ${isLiked(song.id) ? "text-red-500" : "text-gray-400"}`}
              aria-label={isLiked(song.id) ? "取消喜欢" : "喜欢"}
            >
                {isLiked(song.id) ? "❤️" : "🤍"}              
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
