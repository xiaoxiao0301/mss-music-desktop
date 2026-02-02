import { useEffect, useState } from "react";
import { GetPlaylistCategoriesListDetail } from "../../../wailsjs/go/backend/PlaylistBridge";
import { message } from "antd";
import { fixUrl, formatPlaylistAuthor } from "../../utils/helper";

export default function PlaylistDetailPage({ playlistId, onBack }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playlistId) return;
    setLoading(true);
    loadListDetail(playlistId)
  }, [playlistId]);

  const loadListDetail = async (disstid) => {
    try {
      const res = await GetPlaylistCategoriesListDetail(disstid);
      const data = typeof res === "string" ? JSON.parse(res) : res;
      
      if (data.code !== 20000) {
        message.error("获取歌单分类详情失败");
        return;
      }
      console.log("Fetched playlist categories detail:", data);
      setDetail(data.data);   
    } catch(err) {
      console.error(err);
      message.error("获取歌单详情失败");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <PlaylistDetailSkeleton />;
  if (!detail) return null;


  return (
    <div className="w-full h-full flex flex-col bg-white overflow-y-auto">

      {/* 顶部栏 */}
      <div className="flex items-center px-4 py-3 border-b">
        <button onClick={onBack} className="text-lg font-bold">
          ←
        </button>
        <span className="ml-3 font-bold text-lg">歌单详情</span>
      </div>

      {/* Header 区域 */}
      <HeaderSection detail={detail} fixUrl={fixUrl} />

      {/* Stats 区域 */}
      <StatsSection detail={detail} />

      {/* ActionBar */}
      <ActionBar detail={detail} />

      {/* 歌曲列表 */}
      <SongList songs={detail.songlist} />
    </div>
  );
}

/* ---------------- Header ---------------- */

function HeaderSection({ detail, fixUrl }) {
  return (
    <div className="flex gap-4 p-4">
      <img
        src={fixUrl(detail.logo)}
        className="w-32 h-32 rounded-lg object-cover shadow"
      />

      <div className="flex-1 flex flex-col justify-between">
        <p className="text-xl font-bold leading-snug">{detail.dissname}</p>

        <div className="flex items-center gap-2 mt-2">
          <img src={fixUrl(detail.logo)} className="w-6 h-6 rounded-full" />
          <span className="text-sm text-gray-500">{formatPlaylistAuthor(detail)}</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {detail.tags?.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 bg-warm-secondary rounded text-xs"
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
    <div className="px-4 py-2 text-sm text-gray-500 flex gap-4 border-b">
      <span>播放量：{formatNumber(detail.visitnum)}</span>
      <span>歌曲数：{detail.songnum}</span>
      {/* <span>创建时间：{formatDate(detail.ctime)}</span> */}
    </div>
  );
}

/* ---------------- ActionBar ---------------- */

function ActionBar({ detail }) {
  return (
    <div className="flex gap-4 px-4 py-3 border-b">
      <button className="px-4 py-2 bg-warm-primary text-white rounded-lg">
        播放全部
      </button>
      <button className="px-4 py-2 bg-warm-secondary rounded-lg">
        收藏
      </button>
      <button className="px-4 py-2 bg-warm-secondary rounded-lg">
        分享
      </button>
    </div>
  );
}

/* ---------------- SongList ---------------- */

function SongList({ songs }) {
  return (
    <div className="px-4 py-2">
      {songs.map((song, index) => (
        <div
          key={song.songid}
          className="flex items-center py-3 border-b cursor-pointer hover:bg-warm-secondary/40 transition"
        >
          <span className="w-6 text-gray-400">{index + 1}</span>

          <div className="flex-1">
            <p className="font-medium">{song.songname}</p>
            <p className="text-xs text-gray-500">
              {song.singer.map((s) => s.name).join(" / ")}
            </p>
          </div>

          <span className="text-xs text-gray-400">
            {formatDuration(song.interval)}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Skeleton ---------------- */

function PlaylistDetailSkeleton() {
  return (
    <div className="p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="w-32 h-32 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

/* ---------------- Utils ---------------- */

function formatNumber(num) {
  if (!num) return 0;
  if (num > 10000) return (num / 10000).toFixed(1) + "万";
  return num;
}

function formatDate(ts) {
  if (!ts) return "";
  const d = new Date(ts * 1000);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
