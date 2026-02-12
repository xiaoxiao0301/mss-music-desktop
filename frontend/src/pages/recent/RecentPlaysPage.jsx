import { useEffect, useState, useMemo } from "react";
import { message } from "antd";
import { useFavorite, useMusicPlayer } from "../../context/MusicContext";
import { GetPlayHistory, ClearPlayHistory } from "../../../wailsjs/go/backend/PlayHistoryBridge";
import { GetSongDetail } from "../../../wailsjs/go/backend/SongBridge";
import { getCoverUrl, normalizeJson } from "../../utils/helper";
import SongListDesktop from "../../components/SongList";

export default function RecentPlaysPage() {
  const { toggleLike, isLiked } = useFavorite();
  const { playTrackWithURL } = useMusicPlayer();
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentPlays();
  }, []);

  const loadRecentPlays = async () => {
    try {
      setLoading(true);
      const res = await GetPlayHistory(50, 0);
      const data = normalizeJson(res);
      const list = data?.data?.list || [];
      if (!Array.isArray(list)) {
        setRecent([]);
        return;
      }

      const details = await Promise.all(
        list.map(async (item) => {
          try {
            const detailRes = await GetSongDetail(item.song_id);
            const detailData = normalizeJson(detailRes);
            const track = detailData?.data?.track_info;
            if (!track) return null;
            return {
              id: track.id,
              mid: track.mid,
              name: track.title,
              artist: track.singer?.map((s) => s.name).join("/") || "未知歌手",
              albumname: track.album?.name || "未知专辑",
              albummid: track.album?.mid || "",
              duration: track.interval,
              cover: track.album?.mid ? getCoverUrl(track.album.mid) : "",
              playedAt: item.played_at,
            };
          } catch (err) {
            return null;
          }
        })
      );

      const filtered = details.filter(Boolean);
      const seen = new Set();
      const unique = [];
      for (const item of filtered) {
        if (seen.has(item.mid)) continue;
        seen.add(item.mid);
        unique.push(item);
      }
      setRecent(unique);
    } catch (err) {
      message.error("加载最近播放失败");
      setRecent([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClear = async () => {
    try {
      await ClearPlayHistory();
      setRecent([]);
    } catch (err) {
      message.error("清空失败");
    }
  };

  const normalizedSongs = useMemo(() => {
      if (!recent || !recent.length) return [];
  
      return recent.map((song) => ({
        id: song.id,
        mid: song.mid,
        name: song.name,
        artist: song.artist,
        albumname: song.albumname,
        albummid: song.albummid,
        duration: song.duration,
        cover: song.cover,
      }));
    }, [recent]);

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-bold">最近播放（{recent.length}）</div>
        <div className="flex gap-2">
          <button onClick={handleClear} className="px-3 py-1 rounded bg-warm-secondary">清空</button>
        </div>
      </div>

      <div className="card flex-1 overflow-y-auto">
        {loading && <div className="p-6 text-center text-warm-subtext">加载中...</div>}
        {!loading && recent.length === 0 && <div className="p-6 text-center text-warm-subtext">暂无播放记录</div>}
        {!loading && recent.length > 0 && (
          <>
            <SongListDesktop
              songs={normalizedSongs}
              onPlay={(song) => playTrackWithURL(song)}
              onLike={(song) => toggleLike(song)}
              likedChecker={(id) => isLiked(id)}
              onSongClick={(song) => pushPage?.({ type: "songDetail", songMid: song.mid })}
              onAlbumClick={(song) => pushPage?.({ type: "albumDetail", albumMid: song.albummid })}
            />
          </>
        )
      }   
      </div>
    </div>
  );
}
