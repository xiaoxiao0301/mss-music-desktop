import React from "react";
import TopNavBar from "../../components/TopNavBar";

export default function SongDetailPage({ song, onBack }) {
  if (!song) return null;
  console.log("歌曲详情数据：", song);
  const coverUrl = `https://y.qq.com/music/photo_new/T002R300x300M000${song.mid}.jpg`;
  const singers = song.singer?.map(s => s.name).join(" / ");

  return (
    <div className="w-full h-full overflow-y-auto p-4">

    {/* 顶部栏 */}
    <TopNavBar onBack={onBack}/>


      {/* 封面 */}
      <div className="w-full flex justify-center mb-6">
        <img
          src={coverUrl}
          className="w-48 h-48 rounded-xl shadow-lg object-cover"
        />
      </div>

      {/* 歌曲信息 */}
      <h1 className="text-2xl font-bold mb-2">{song.title}</h1>

      <p className="text-lg text-warm-subtext mb-1">{singers}</p>

      <p className="text-sm text-gray-400 mb-4">
        发布时间：{song.time_public}
      </p>

      {/* 其他信息 */}
      <div className="mt-4 text-sm text-gray-600">
        <p>时长：{song.interval} 秒</p>
        <p>专辑：{song.album?.name}</p>
        <p>类型：{song.genre}</p>
      </div>

    </div>
  );
}
