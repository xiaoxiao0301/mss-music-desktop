import { useEffect, useState } from "react";
import { GetFavoriteAlbums } from "../../../wailsjs/go/backend/FavoriteBridge";
import { GetAlbumDetail } from "../../../wailsjs/go/backend/AlbumBridge";
import { getCoverUrl, normalizeJson } from "../../utils/helper";

export default function FavoriteAlbumsPage({ pushPage, onBack }) {
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      setLoading(false);
      return;
    }
    loadFavoriteAlbums();
  }, []);

  const loadFavoriteAlbums = async () => {
    try {
      setLoading(true);
      const mids = await GetFavoriteAlbums();
      
      if (!mids || mids.length === 0) {
        setAlbums([]);
        setLoading(false);
        return;
      }
      
      // 获取每个专辑的详细信息
      const albumPromises = mids.map(async (mid) => {
        try {
          const res = await GetAlbumDetail(mid);
          const data = normalizeJson(res);
          if (data.code === 20000 && data.data) {
            const album = data.data.basicInfo;
            const cover = getCoverUrl(album.albumMid);
            const singerList = data.data.singer?.singerList || [];
            const artist = singerList.length
              ? singerList.map((s) => s.name || s.title).filter(Boolean).join(" / ")
              : "未知歌手";
            return {
              id: album.albumID || album.id,
              mid: album.albumMid || album.mid || mid,
              name: album.albumName || album.name || album.title || "未命名专辑",
              artist,
              cover,
              publishTime: album.publishDate || album.aDate || album.time_public || ""
            };
          }
        } catch (error) {
          console.error(`Failed to load album detail for ${mid}:`, error);
        }
        return null;
      });

      const albumDetails = await Promise.all(albumPromises);
      const filteredAlbums = albumDetails.filter(a => a !== null);
      setAlbums(filteredAlbums);
    } catch (error) {
      console.error("Failed to load favorite albums:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAlbumClick = (album) => {
    pushPage({ type: "albumDetail", albumMid: album.mid });
  };

  return (
    <div className="flex flex-col h-full overflow-auto p-4">
      <h1 className="text-2xl font-bold mb-4">💿 收藏的专辑</h1>

      {loading && <p className="text-warm-subtext">加载中...</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {albums.map(album => (
          <div
            key={album.mid}
            className="card p-3 flex flex-col items-center cursor-pointer hover:bg-warm-secondary/40 transition rounded-xl"
            onClick={() => handleAlbumClick(album)}
          >
            <img
              src={album.cover}
              className="w-full aspect-square rounded-lg object-cover shadow mb-2"
            />
            <p className="font-bold text-center line-clamp-2">{album.name}</p>
            <p className="text-sm text-warm-subtext text-center">{album.artist}</p>
            {album.publishTime && (
              <p className="text-xs text-warm-subtext mt-1">{album.publishTime}</p>
            )}
          </div>
        ))}
      </div>

      {!loading && albums.length === 0 && (
        <div className="text-center text-warm-subtext py-10">
          <p>还没有收藏的专辑</p>
        </div>
      )}
    </div>
  );
}
