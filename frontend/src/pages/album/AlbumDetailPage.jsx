import { useEffect, useState, useMemo } from "react";
import { message } from "antd";
import { GetAlbumDetail, GetAlbumSongLists } from "../../../wailsjs/go/backend/AlbumBridge";
import { AlbumTypeMap } from "../../utils/helper";
import { getCoverUrl} from "../../utils/helper";
import TopNavBar from "../../components/TopNavBar";
import SongListDesktop from "../../components/SongList";
import { useMusicPlayer, useFavorite } from "../../context/MusicContext";

export default function AlbumDetailPage({ albumMid, onBack }) {
  const [detail, setDetail] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { playTrack } = useMusicPlayer();
    const { isLiked, toggleLike } = useFavorite();

  useEffect(() => {
    if (!albumMid) return;
    setLoading(true);
    loadAlbumDetail(albumMid);
  }, [albumMid]);

  const loadAlbumDetail = async (mid) => {
    try {
      const res = await GetAlbumDetail(mid);
      const data = typeof res === "string" ? JSON.parse(res) : res;

      if (data.code !== 20000) {
        message.error("获取专辑详情失败");
        return;
      }

      const songRes = await GetAlbumSongLists(mid);
      const songData = typeof songRes === "string" ? JSON.parse(songRes) : songRes;

      if (songData.code !== 20000) {
        message.error("获取专辑歌曲失败");
        return;
      }

      setDetail(data.data);
      setSongs(songData.data.list);
    } catch (err) {
      console.error(err);
      message.error("加载专辑详情失败");
    } finally {
      setLoading(false);
    }
  };

  const normalizedSongs = useMemo(() => {
    if (!detail || !songs.length) return [];

    return songs.map((song) => ({
      id: song.id,
      mid: song.mid,
      name: song.title,
      artist: song.singer.map((s) => s.name).join(" / "),
      albumname: detail.basicInfo.albumName,
      albummid: detail.basicInfo.albumMid,
      duration: song.interval,
      cover: getCoverUrl(detail.basicInfo.albumMid),
    }));
  }, [detail, songs]);

  if (loading) return <AlbumDetailSkeleton />;
  if (!detail) return null;

  const album = detail.basicInfo;
  const singer = detail.singer?.singerList?.[0];
  const company = detail.company?.name || "未知";

  const coverUrl = getCoverUrl(album.albumMid);

  return (
    <div className="w-full h-full bg-[#FAF7F2] text-[#2B2B2B] overflow-y-auto">

      {/* 顶部栏 */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-[#EDE7E2] p-4">
        <TopNavBar onBack={onBack} />
      </div>

      <div className="p-4 space-y-4">

        {/* 头部卡片 */}
        <div className="relative rounded-xl overflow-hidden shadow bg-white border border-[#EDE7E2]">
          <img
            src={coverUrl}
            className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFE8D6]/70 to-[#FAF7F2]/70" />

          <div className="relative z-10 flex items-center gap-6 p-6">
            <img
              src={coverUrl}
              className="w-40 h-40 rounded-xl shadow-xl object-cover border border-white/40"
            />

            <div className="flex-1">
              <p className="text-2xl font-bold">{album.albumName}</p>

              <p className="text-sm mt-2 text-[#6B6B6B]">
                {singer?.name}
              </p>

              <p className="text-xs mt-3 text-[#8C8C8C]">
                发行时间：{album.publishDate}
              </p>
            </div>
          </div>
        </div>

        {/* 简介卡片 */}
        {detail.desc && (
          <div className="bg-white rounded-xl shadow-sm p-4 border border-[#EDE7E2]">
            <p className="font-bold text-lg mb-2">专辑简介</p>
            <p className="text-sm text-[#6B6B6B] leading-relaxed whitespace-pre-line">
              {detail.desc}
            </p>
          </div>
        )}

        {/* 信息卡片 */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-[#EDE7E2] text-sm text-[#6B6B6B] space-y-2">
          <p>类型：{AlbumTypeMap[album.albumType] || album.albumType}</p>
          <p>语言：{album.language}</p>
          <p>公司：{company}</p>

          {detail.genres?.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {detail.genres.map((g, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-[#FFF3E8] text-[#6B6B6B] border border-[#FFE8D6] rounded text-xs"
                >
                  {g.name || "未知"}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 歌曲列表（使用 SongListDesktop） */}
        <SongListDesktop
          songs={normalizedSongs}
          onPlay={(song) => playTrack(song)}
          onLike={(song) => toggleLike(song)}
          likedChecker={(id) => isLiked(id)}
        />
      </div>
    </div>
  );
}

/* ---------------- Skeleton（暖色） ---------------- */

function AlbumDetailSkeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      <div className="h-64 bg-[#F2EBE5] rounded-xl" />
      <div className="h-32 bg-[#F2EBE5] rounded-xl" />
      <div className="h-20 bg-[#F2EBE5] rounded-xl" />
      <div className="h-48 bg-[#F2EBE5] rounded-xl" />
    </div>
  );
}
