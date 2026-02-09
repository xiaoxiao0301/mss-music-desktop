import { useEffect, useState } from "react";
import { GetFavoriteArtists } from "../../../wailsjs/go/backend/FavoriteBridge";
import { GetArtistDetail } from "../../../wailsjs/go/backend/ArtistBridge";

export default function FavoriteArtistsPage({ pushPage, onBack }) {
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      setLoading(false);
      return;
    }
    loadFavoriteArtists();
  }, []);

  const loadFavoriteArtists = async () => {
    try {
      setLoading(true);
      const mids = await GetFavoriteArtists();
      console.log("Favorite artists MIDs:", mids);
      
      if (!mids || mids.length === 0) {
        setArtists([]);
        setLoading(false);
        return;
      }
      
      // 获取每个歌手的详细信息
      const artistPromises = mids.map(async (mid) => {
        try {
          const res = await GetArtistDetail(mid, 1);
          const data = JSON.parse(res);
          console.log(`Artist detail for ${mid}:`, data);
          if (data.code === 20000 && data.data?.singer_info) {
            const artist = data.data.singer_info;
            return {
              id: artist.id,
              mid: artist.mid,
              name: artist.name,
              cover: artist.mid ? `https://y.gtimg.cn/music/photo_new/T001R300x300M000${artist.mid}.jpg` : "",
              songCount: data.data.total_song || 0,
              albumCount: data.data.total_album || 0
            };
          }
        } catch (error) {
          console.error(`Failed to load artist detail for ${mid}:`, error);
        }
        return null;
      });

      const artistDetails = await Promise.all(artistPromises);
      const filteredArtists = artistDetails.filter(a => a !== null);
      console.log("Filtered artists:", filteredArtists);
      setArtists(filteredArtists);
    } catch (error) {
      console.error("Failed to load favorite artists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArtistClick = (artist) => {
    pushPage({ type: "artistDetail", artistMid: artist.mid });
  };

  return (
    <div className="flex flex-col h-full overflow-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🎤 关注的歌手</h1>

      {loading && <p className="text-warm-subtext">加载中...</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {artists.map(artist => (
          <div
            key={artist.mid}
            className="card p-3 flex flex-col items-center cursor-pointer hover:bg-warm-secondary/40 transition rounded-xl"
            onClick={() => handleArtistClick(artist)}
          >
            <img
              src={artist.cover}
              className="w-full aspect-square rounded-full object-cover shadow mb-2"
            />
            <p className="font-bold text-center line-clamp-1">{artist.name}</p>
            <div className="flex gap-3 text-xs text-warm-subtext mt-1">
              <span>{artist.songCount} 首歌</span>
              <span>{artist.albumCount} 张专辑</span>
            </div>
          </div>
        ))}
      </div>

      {!loading && artists.length === 0 && (
        <div className="text-center text-warm-subtext py-10">
          <p>还没有关注的歌手</p>
        </div>
      )}
    </div>
  );
}
