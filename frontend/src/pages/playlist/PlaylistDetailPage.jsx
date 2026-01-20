import { mockPlaylists, mockSongs } from "../../mock/playlists";
import TopNavBar from "../../components/TopNavBar";

export default function PlaylistDetailPage({ playlistId, onBack }) {
  const playlist = mockPlaylists.find((p) => p.id === playlistId) || mockPlaylists[0];
  return (
    <div>
      <TopNavBar
        onBack={onBack}
      />

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
        {mockSongs.map((song) => (
          <div key={song.id} className="list-item">
            <span>{song.name}</span>
            <span className="text-sm text-warm-subtext">{song.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
