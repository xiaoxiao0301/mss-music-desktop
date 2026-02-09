import { useEffect, useState } from "react";
import { useFavorite } from "../../context/MusicContext";
import { GetFavoriteSongs } from "../../../wailsjs/go/backend/FavoriteBridge";
import { GetSongDetail } from "../../../wailsjs/go/backend/SongBridge";
import { SkeletonList } from "../../components/SkeletonCard";

export default function LikedPage({ pushPage }) {
  const { toggleLike } = useFavorite();
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    loadFavoriteSongs();
  }, []);

  const loadFavoriteSongs = async () => {
    try {
      setLoading(true);
      const mids = await GetFavoriteSongs();
      
      // 获取每首歌的详细信息
      const songPromises = mids.map(async (mid) => {
        try {
          const res = await GetSongDetail(mid);
          const data = JSON.parse(res);
          if (data.code === 20000 && data.data?.track_info) {
            const track = data.data.track_info;
            return {
              id: track.id,
              mid: track.mid,
              name: track.title,
              artist: track.singer?.map(s => s.name).join("/") || "未知歌手",
              duration: track.interval,
              cover: track.album?.mid ? `https://y.gtimg.cn/music/photo_new/T002R300x300M000${track.album.mid}.jpg` : ""
            };
          }
        } catch (error) {
          console.error(`Failed to load song detail for ${mid}:`, error);
        }
        return null;
      });

      const songDetails = await Promise.all(songPromises);
      setSongs(songDetails.filter(s => s !== null));
    } catch (error) {
      console.error("Failed to load favorite songs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto p-4">
      <h1 className="text-2xl font-bold mb-4">❤️ 喜欢的音乐</h1>

      {loading && <SkeletonList count={8} />}

      {!loading && songs.length === 0 && (
        <div className="text-center text-warm-subtext py-10">
          <p>还没有喜欢的音乐</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {songs.map(song => (
          <div
            key={song.id}
            className="card p-3 flex items-center gap-4 hover:bg-warm-secondary/40 transition rounded-xl"
          >
            <img
              src={song.cover}
              className="w-14 h-14 rounded-lg object-cover shadow"
            />

            <div className="flex-1">
              <p className="font-bold">{song.name}</p>
              <p className="text-sm text-warm-subtext">{song.artist}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => pushPage({ type: "songDetail", songMid: song.mid })}
                className="text-sm px-3 py-1 rounded bg-warm-secondary/60 text-warm-text hover:bg-warm-secondary transition"
              >
                详情
              </button>
              <button
                onClick={() => {
                  toggleLike(song);
                  setSongs(songs.filter(s => s.mid !== song.mid));
                }}
                className="text-xl text-red-500 hover:scale-110 transition"
              >
                ❤️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
