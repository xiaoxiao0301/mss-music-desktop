import { useEffect, useState } from "react";
import { useFavorite, useMusicPlayer } from "../../context/MusicContext";
import { GetFavoriteSongs } from "../../../wailsjs/go/backend/FavoriteBridge";
import { GetSongDetail } from "../../../wailsjs/go/backend/SongBridge";
import { SkeletonList } from "../../components/SkeletonCard";
import SongListDesktop from "../../components/SongList";
import { getCoverUrl } from "../../utils/helper";

export default function LikedPage({ pushPage }) {
  const { likedSongMids, toggleLike } = useFavorite();
  const { playTrackWithURL } = useMusicPlayer();
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    loadFavoriteSongs();
  }, []);

  // 监听 context 中的 likedSongMids 变化，如果有变化则重新加载列表
  useEffect(() => {
    // 只有在初始列表都加载完后才监听变化
    if (songs.length > 0 || loading === false) {
      loadFavoriteSongs();
    }
  }, [likedSongMids.length]);

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
              albumname: track.album?.name || "未知专辑",
              albummid: track.album?.mid || "",
              duration: track.interval,
              cover: track.album?.mid ? getCoverUrl(track.album.mid) : ""
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
      <h1 className="text-2xl font-bold mb-4">喜欢的音乐</h1>

      {loading && <SkeletonList count={8} />}

      {!loading && songs.length === 0 && (
        <div className="text-center text-warm-subtext py-10">
          <p>还没有喜欢的音乐</p>
        </div>
      )}

      {!loading && songs.length > 0 && (
        <SongListDesktop
          songs={songs}
          onPlay={(song) => playTrackWithURL(song)}
          onLike={(song) => {
            toggleLike(song);
            setSongs(songs.filter(s => s.mid !== song.mid));
          }}
          likedChecker={() => true}
          onSongClick={(song) => pushPage?.({ type: "songDetail", songMid: song.mid })}
          onAlbumClick={(song) => pushPage?.({ type: "albumDetail", albumMid: song.albummid })}
        />
      )}
    </div>
  );
}
