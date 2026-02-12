import { useEffect, useState, useMemo } from "react";
import { GetPlaylistCategoriesListDetail } from "../../../wailsjs/go/backend/PlaylistBridge";
import { AddFavorite, RemoveFavorite, GetFavoritePlaylists } from "../../../wailsjs/go/backend/FavoriteBridge";
import { message } from "antd";
import { fixUrl, formatPlaylistAuthor, formatNumber, getCoverUrl, normalizeJson } from "../../utils/helper";
import { useMusicPlayer, useFavorite } from "../../context/MusicContext";
import SongListDesktop from "../../components/SongList";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function PlaylistDetailPage({ playlistId, initialData, onBack, pushPage }) {
  const realID = playlistId;
  const [detail, setDetail] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [isPlaylistFavorited, setIsPlaylistFavorited] = useState(false);

  const { playTrackWithURL, playQueueFromList } = useMusicPlayer();
  const { isLiked, toggleLike } = useFavorite();

  useEffect(() => {
    if (initialData) return;
    setLoading(true);
    loadListDetail(realID);
  }, [realID]);

  useEffect(() => {
    if (detail?.disstid) {
      checkIfFavorited(detail.disstid);
    }
  }, [detail?.disstid]);

  const checkIfFavorited = async (disstid) => {
    try {
      const userID = localStorage.getItem("userID");
      if (!userID) {
        setIsPlaylistFavorited(false);
        return;
      }
      const favorites = await GetFavoritePlaylists();
      const isFav = (favorites || []).includes(String(disstid));
      setIsPlaylistFavorited(isFav);
    } catch (error) {
      console.error("Failed to check if favorited:", error);
    }
  };

  const normalizedSongs = useMemo(() => {
    if (!detail || !detail.songlist) return [];
    return detail.songlist.map((song) => ({
      id: song.songid,
      mid: song.songmid,
      name: song.songname,
      artist: song.singer.map((s) => s.name).join(" / "),
      albumname: song.albumname,
      albummid: song.albummid,
      duration: song.interval,
      cover: getCoverUrl(song.albummid),
    }));
  }, [detail]);

  const loadListDetail = async (disstid) => {
    try {
      const res = await GetPlaylistCategoriesListDetail(disstid);
      const data = normalizeJson(res);

      if (data.code !== 20000) {
        message.error("获取歌单分类详情失败");
        return;
      }
      setDetail(data.data);
    } catch (err) {
      console.error(err);
      message.error("获取歌单详情失败");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!detail) return;
    try {
      if (isPlaylistFavorited) {
        await RemoveFavorite(detail.disstid, "playlist");
        setIsPlaylistFavorited(false);
        message.success("取消收藏");
      } else {
        await AddFavorite(detail.disstid, "playlist");
        setIsPlaylistFavorited(true);
        message.success("收藏成功");
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      message.error("操作失败");
    }
  };

  const handlePlayAll = async () => {
    if (!normalizedSongs.length) {
      message.warning("歌单暂无歌曲");
      return;
    }
    await playQueueFromList(normalizedSongs, 0);
  };

  if (loading) return <PlaylistDetailSkeleton />;
  if (!detail) return null;

  return (
    <div className="w-full h-full flex flex-col bg-[#FAF7F2] text-[#2B2B2B] overflow-y-auto">

      {/* 顶部栏 */}
      <div className="flex items-center px-4 py-3 border-b border-[#EDE7E2] bg-white">
        <button onClick={onBack} className="text-lg font-bold text-[#2B2B2B] hover:text-[#FF8A3D]">
          ←
        </button>
        <span className="ml-3 font-bold text-lg">歌单详情</span>
      </div>

      {/* Header 区域 */}
      <HeaderSection detail={detail} fixUrl={fixUrl} />

      {/* Stats 区域 */}
      <StatsSection detail={detail} />

      {/* ActionBar */}
      <ActionBar
        isPlaylistFavorited={isPlaylistFavorited}
        onToggleFavorite={handleToggleFavorite}
        onPlayAll={handlePlayAll}
        canPlayAll={normalizedSongs.length > 0}
      />

      {/* 歌曲列表 */}
      <SongListDesktop
        songs={normalizedSongs}
        onPlay={(song) => playTrackWithURL(song)}
        onLike={(song) => toggleLike(song)}
        likedChecker={(mid) => isLiked(mid)}
        onSongClick={(song) => pushPage?.({ type: "songDetail", songMid: song.mid })}
        onAlbumClick={(song) => pushPage?.({ type: "albumDetail", albumMid: song.albummid })}
      />
    </div>
  );
}

/* ---------------- Header ---------------- */

function HeaderSection({ detail, fixUrl }) {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm m-4 border border-[#EDE7E2]">
      <img
        src={fixUrl(detail.logo)}
        className="w-32 h-32 rounded-lg object-cover shadow"
      />

      <div className="flex-1 flex flex-col justify-between">
        <p className="text-xl font-bold leading-snug">{detail.dissname}</p>

        <div className="flex items-center gap-2 mt-2">
          <img src={fixUrl(detail.logo)} className="w-6 h-6 rounded-full" />
          <span className="text-sm text-[#6B6B6B]">{formatPlaylistAuthor(detail)}</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {detail.tags?.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 bg-[#FFF3E8] text-[#6B6B6B] border border-[#FFE8D6] rounded text-xs"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Stats ---------------- */

function StatsSection({ detail }) {
  return (
    <div className="px-4 py-2 text-sm text-[#6B6B6B] flex gap-4 border-b border-[#EDE7E2] bg-white">
      <span>播放量：{formatNumber(detail.visitnum)}</span>
      <span>歌曲数：{detail.songnum}</span>
    </div>
  );
}

/* ---------------- ActionBar ---------------- */

function ActionBar({ isPlaylistFavorited, onToggleFavorite, onPlayAll, canPlayAll }) {
  return (
    <div className="flex gap-4 px-4 py-3 border-b border-[#EDE7E2] bg-white">
      <button
        onClick={onPlayAll}
        disabled={!canPlayAll}
        className={`px-4 py-2 rounded-lg shadow ${
          canPlayAll
            ? "bg-[#FF8A3D] text-white hover:bg-[#FF7A1F]"
            : "bg-[#FFE8D6] text-[#6B6B6B] cursor-not-allowed"
        }`}
      >
        播放全部
      </button>

      <button 
        onClick={onToggleFavorite}
        className={`px-4 py-2 rounded-lg transition ${
          isPlaylistFavorited
            ? "bg-[#FF8A3D] text-white"
            : "bg-[#FFE8D6] text-[#2B2B2B] hover:bg-[#FFDCC2]"
        }`}
      >
        {isPlaylistFavorited ? "❤️ 已收藏" : "🤍 收藏"}
      </button>

      {/* <button className="px-4 py-2 rounded-lg bg-[#FFE8D6] text-[#2B2B2B] hover:bg-[#FFDCC2]">
        分享
      </button> */}
    </div>
  );
}

/* ---------------- Skeleton ---------------- */

function PlaylistDetailSkeleton() {
  return (
    <div className="p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="w-32 h-32 bg-[#F2EBE5] rounded-lg" />
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-[#F2EBE5] rounded" />
          <div className="h-4 bg-[#F2EBE5] rounded w-1/2" />
          <div className="h-4 bg-[#F2EBE5] rounded w-1/3" />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-4 bg-[#F2EBE5] rounded w-1/4" />
        <div className="h-4 bg-[#F2EBE5] rounded w-1/3" />
      </div>
    </div>
  );
}
