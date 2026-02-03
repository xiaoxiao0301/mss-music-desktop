import { useEffect, useState } from "react";
import { message } from "antd";
import { GetAlbumDetail, GetAlbumSongLists } from "../../../wailsjs/go/backend/AlbumBridge";
import { AlbumTypeMap, formatTime } from "../../utils/helper";
import TopNavBar from "../../components/TopNavBar";

export default function AlbumDetailPage({ albumMid, onBack }) {
  const [detail, setDetail] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <AlbumDetailSkeleton />;
  if (!detail) return null;

  return (
    <div className="w-full h-full bg-gray-50 overflow-y-auto">

      {/* 顶部栏 */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b p-4">
        <TopNavBar onBack={onBack} />
      </div>

      <div className="p-4 space-y-4">

        {/* 卡片 1：沉浸式头部 */}
        <AlbumHeroCard detail={detail} />

        {/* 卡片 2：Stats */}
        <AlbumStatsCard detail={detail} />

        {/* 卡片 3：进度条 */}
        <AlbumProgressCard
          total={detail.basicInfo.albumDuration}
          published={songs.length}
        />

        {/* 卡片 4：操作区 */}
        <AlbumActionCard />

        {/* 卡片 5：歌曲列表 */}
        <AlbumSongListCard songs={songs} />
      </div>
    </div>
  );
}

/* ---------------- 卡片 1：沉浸式头部 ---------------- */

function AlbumHeroCard({ detail }) {
  const coverUrl = `https://y.qq.com/music/photo_new/T002R300x300M000${detail.basicInfo.albumMid}.jpg`;

  return (
    <div className="relative rounded-xl overflow-hidden shadow bg-white">

      {/* 背景模糊 */}
      <img
        src={coverUrl}
        className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60 pointer-events-none"
      />

      {/* 前景内容 */}
      <div className="relative z-10 flex items-center gap-4 p-6">
        <img
          src={coverUrl}
          className="w-36 h-36 rounded-xl shadow-xl object-cover"
        />

        <div className="flex-1 text-white drop-shadow">
          <p className="text-2xl font-bold leading-snug">
            {detail.basicInfo.albumName}
          </p>

          <p className="text-sm mt-2 opacity-90">
            {detail.singer?.singerList?.map((s) => s.name).join(" / ")}
          </p>

          <p className="text-xs mt-3 opacity-80">
            发行时间：{detail.basicInfo.publishDate}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 卡片 2：Stats ---------------- */

function AlbumStatsCard({ detail }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 text-sm text-gray-600 flex gap-6">
      <span>类型：{AlbumTypeMap[detail.basicInfo.albumType]}</span>
      <span>语言：{detail.basicInfo.language}</span>
      <span>曲目数：{detail.basicInfo.albumDuration}</span>
    </div>
  );
}

/* ---------------- 卡片 3：进度条 ---------------- */

function AlbumProgressCard({ total, published }) {
  const percent = total > 0 ? (published / total) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>已发布 {published} / {total} 首</span>
        <span className="font-medium text-warm-primary">{Math.round(percent)}%</span>
      </div>

      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out
                     bg-gradient-to-r from-warm-primary to-orange-400"
          style={{ width: `${percent}%` }}
        />

        <div
          className="absolute top-0 left-0 h-full rounded-full opacity-40
                     bg-white blur-md animate-pulse"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/* ---------------- 卡片 4：操作区 ---------------- */

function AlbumActionCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
      <button className="px-5 py-2.5 bg-warm-primary text-white rounded-lg shadow hover:opacity-90 transition">
        播放全部
      </button>

      <button className="px-5 py-2.5 bg-warm-secondary rounded-lg shadow hover:bg-warm-secondary/70 transition">
        收藏
      </button>
    </div>
  );
}

/* ---------------- 卡片 5：歌曲列表 ---------------- */

function AlbumSongListCard({ songs }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {songs.map((song, index) => (
        <div
          key={song.id}
          className="flex items-center py-3 border-b last:border-none hover:bg-gray-100 transition cursor-pointer rounded"
        >
          <span className="w-6 text-gray-400">{index + 1}</span>

          <div className="flex-1">
            <p className="font-medium">{song.title}</p>
            <p className="text-xs text-gray-500">
              {song.singer.map((s) => s.name).join(" / ")}
            </p>
          </div>

          <span className="text-xs text-gray-400">
            {formatTime(song.interval)}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Skeleton（卡片式） ---------------- */

function AlbumDetailSkeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse">

      {/* 卡片 1 */}
      <div className="h-64 bg-gray-200 rounded-xl" />

      {/* 卡片 2 */}
      <div className="h-16 bg-gray-200 rounded-xl" />

      {/* 卡片 3 */}
      <div className="h-20 bg-gray-200 rounded-xl" />

      {/* 卡片 4 */}
      <div className="h-16 bg-gray-200 rounded-xl" />

      {/* 卡片 5 */}
      <div className="h-48 bg-gray-200 rounded-xl" />
    </div>
  );
}
