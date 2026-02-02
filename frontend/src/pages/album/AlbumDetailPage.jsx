import React from "react";
import TopNavBar from "../../components/TopNavBar";

export default function AlbumDetailPage({ album, onBack }) {
  if (!album) return null;
  console.log("专辑详情数据：", album);
  const coverUrl = `https://y.qq.com/music/photo_new/T002R300x300M000${album.mid}.jpg`;
  const singers = album.singers?.map(s => s.name).join(" / ");

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

      {/* 专辑信息 */}
      <h1 className="text-2xl font-bold mb-2">{album.name}</h1>

      <p className="text-lg text-warm-subtext mb-1">{singers}</p>

      <p className="text-sm text-gray-400 mb-4">
        发布时间：{album.release_time}
      </p>

      {/* 其他信息 */}
      <div className="mt-4 text-sm text-gray-600">
        <p>语言：{album.language}</p>
        <p>类型：{album.genre}</p>
        <p>地区：{album.area}</p>
        <p>公司：{album.company?.name}</p>
      </div>

    </div>
  );
}
