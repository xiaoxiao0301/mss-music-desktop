import { mockRecommendSongs, mockRecommendPlaylists, mockRecommendArtists } from "../mock/recommend";
import { useMusicPlayer } from "../context/MusicContext";

export default function DiscoverPage() {
  const { playTrack } = useMusicPlayer();

  return (
    <div className="flex flex-col gap-6">

      {/* 每日推荐歌曲 */}
      <section>
        <h2 className="text-xl font-bold mb-3">每日推荐</h2>
        <div className="grid grid-cols-5 gap-4">
          {mockRecommendSongs.map(song => (
            <div 
              key={song.id} 
              className="card p-3 hover:bg-warm-secondary/40 transition rounded-xl cursor-pointer"
              onClick={() => playTrack(song, mockRecommendSongs)}
            >
              <img src={song.cover} className="w-full h-40 object-cover rounded-lg shadow" />
              <p className="mt-2 font-bold">{song.name}</p>
              <p className="text-sm text-warm-subtext">{song.artist}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 推荐歌单 */}
      <section>
        <h2 className="text-xl font-bold mb-3">推荐歌单</h2>
        <div className="grid grid-cols-5 gap-4">
          {mockRecommendPlaylists.map(pl => (
            <div key={pl.id} className="card p-3 hover:bg-warm-secondary/40 transition rounded-xl cursor-pointer">
              <img src={pl.cover} className="w-full h-40 object-cover rounded-lg shadow" />
              <p className="mt-2 font-bold">{pl.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 推荐歌手 */}
      <section>
        <h2 className="text-xl font-bold mb-3">推荐歌手</h2>
        <div className="grid grid-cols-6 gap-6">
          {mockRecommendArtists.map(ar => (
            <div key={ar.id} className="flex flex-col items-center cursor-pointer p-4 card hover:bg-warm-secondary/40 transition rounded-xl">
              <img src={ar.avatar} className="w-20 h-20 rounded-full object-cover shadow mb-3" />
              <p className="font-bold text-center">{ar.name}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
