import { useState } from "react";
import SlidePage from "../../components/SlidePage";
import PlaylistDetailPage from "./PlaylistDetailPage";
import { mockPlaylists, playlistTags } from "../../mock/playlists";

export default function PlaylistCategoryPage() {
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);

  // 三个筛选条件
  const [tag, setTag] = useState("全部");
  const [scene, setScene] = useState("全部");
  const [mood, setMood] = useState("全部");

  // 筛选逻辑
  const filteredPlaylists = mockPlaylists.filter((pl) => {
    return (
      (tag === "全部" || pl.tag === tag) &&
      (scene === "全部" || pl.scene === scene) &&
      (mood === "全部" || pl.mood === mood)
    );
  });

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* 列表页 */}
      <div
        className={`transition-opacity duration-300 ${
          currentPlaylistId ? "opacity-0" : "opacity-100"
        }`}
      >

        {/* 筛选区 */}
        <div className="card p-4 mb-4">

          {/* 风格 */}
          <p className="text-sm font-bold mb-2">风格</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {playlistTags.风格.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  tag === t
                    ? "bg-warm-primary text-white"
                    : "bg-warm-secondary hover:bg-warm-secondary/70"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* 场景 */}
          <p className="text-sm font-bold mb-2">场景</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {playlistTags.场景.map((s) => (
              <button
                key={s}
                onClick={() => setScene(s)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  scene === s
                    ? "bg-warm-primary text-white"
                    : "bg-warm-secondary hover:bg-warm-secondary/70"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* 情绪 */}
          <p className="text-sm font-bold mb-2">情绪</p>
          <div className="flex flex-wrap gap-2">
            {playlistTags.情绪.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  mood === m
                    ? "bg-warm-primary text-white"
                    : "bg-warm-secondary hover:bg-warm-secondary/70"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

        </div>

        {/* 歌单网格 */}
        <div className="grid grid-cols-4 gap-4">
          {filteredPlaylists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => setCurrentPlaylistId(pl.id)}
              className="card p-4 cursor-pointer hover:bg-warm-secondary/40 transition"
            >
              <img
                src={pl.cover}
                className="w-full h-40 rounded-lg object-cover"
              />
              <p className="mt-3 font-bold">{pl.name}</p>
            </div>
          ))}
        </div>

      </div>

      {/* 详情页（滑入） */}
      <SlidePage show={!!currentPlaylistId}>
        <PlaylistDetailPage
          playlistId={currentPlaylistId}
          onBack={() => setCurrentPlaylistId(null)}
        />
      </SlidePage>

    </div>
  );
}
