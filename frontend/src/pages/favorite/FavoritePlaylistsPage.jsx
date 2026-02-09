import { useEffect, useState } from "react";
import { GetFavoritePlaylists } from "../../../wailsjs/go/backend/FavoriteBridge";
import { GetPlaylistCategoriesListDetail } from "../../../wailsjs/go/backend/PlaylistBridge";
import { fixUrl, formatNumber, formatPlaylistAuthor, normalizeJson } from "../../utils/helper";
import { SkeletonGrid } from "../../components/SkeletonCard";

export default function FavoritePlaylistsPage({ pushPage, onBack }) {
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      setLoading(false);
      return;
    }
    loadFavoritePlaylists();
  }, []);

  const loadFavoritePlaylists = async () => {
    try {
      setLoading(true);
      const disstids = await GetFavoritePlaylists();
      
      if (!disstids || disstids.length === 0) {
        setPlaylists([]);
        setLoading(false);
        return;
      }
      
      // 获取每个歌单的详细信息
      const playlistPromises = disstids.map(async (disstid) => {
        try {
          const res = await GetPlaylistCategoriesListDetail(disstid);
          const data = normalizeJson(res);
          if (data.code === 20000 && data.data) {
            const playlist = data.data;
            const songCount = playlist.song_cnt || playlist.songnum || playlist.songlist?.length || 0;
            const listenCount = playlist.visitnum || playlist.listen_num || playlist.listenCount || 0;
            const coverUrl =
              playlist.logo ||
              playlist.cover_url_medium ||
              playlist.cover_url_small ||
              playlist.headurl ||
              "";
            return {
              id: playlist.disstid,
              disstid: playlist.disstid,
              name: playlist.dissname || playlist.title || "未命名歌单",
              creator: formatPlaylistAuthor(playlist) || "未知创建者",
              cover: fixUrl(coverUrl),
              songCount,
              listenCount
            };
          }
        } catch (error) {
          console.error(`Failed to load playlist detail for ${disstid}:`, error);
        }
        return null;
      });

      const playlistDetails = await Promise.all(playlistPromises);
      const filteredPlaylists = playlistDetails.filter(p => p !== null);
      setPlaylists(filteredPlaylists);
    } catch (error) {
      console.error("Failed to load favorite playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistClick = (playlist) => {
    pushPage({ type: "playlistDetail", playlistId: playlist.disstid });
  };

  return (
    <div className="flex flex-col h-full overflow-auto p-4">
      <h1 className="text-2xl font-bold mb-4">收藏的歌单</h1>

      {loading && <SkeletonGrid columns={5} count={10} />}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {playlists.map(playlist => (
          <div
            key={playlist.disstid}
            className="card p-3 flex flex-col items-center cursor-pointer hover:bg-warm-secondary/40 transition rounded-xl"
            onClick={() => handlePlaylistClick(playlist)}
          >
            <img
              src={playlist.cover}
              className="w-full aspect-square rounded-lg object-cover shadow mb-2"
            />
            <p className="font-bold text-center line-clamp-2">{playlist.name}</p>
            <p className="text-sm text-warm-subtext text-center">{playlist.creator}</p>
            <div className="flex gap-3 text-xs text-warm-subtext mt-1">
              <span>{playlist.songCount} 首</span>
              <span>{formatNumber(playlist.listenCount)} 播放</span>
            </div>
          </div>
        ))}
      </div>

      {!loading && playlists.length === 0 && (
        <div className="text-center text-warm-subtext py-10">
          <p>还没有收藏的歌单</p>
        </div>
      )}
    </div>
  );
}
