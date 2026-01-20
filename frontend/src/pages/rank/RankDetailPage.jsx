import { useEffect, useState } from "react";
import { rankLists } from "../../mock/rank";
import TopNavBar from "../../components/TopNavBar";

export default function RankDetailPage({ rankName, onBack }) {
  const [rankData, setRankData] = useState(null);

  useEffect(() => {
    setRankData(rankLists[rankName] || rankLists["热歌榜"]);
  }, [rankName]);

  if (!rankData) return <div>加载中...</div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">

      <TopNavBar onBack={onBack} />

      {/* 顶部：封面 + 信息 */}
      <div className="card p-6 mb-4 flex gap-6 items-center">
        <img
          src={rankData.cover}
          className="w-40 h-40 rounded-xl object-cover shadow-lg"
        />

        <div className="flex flex-col justify-between">

          <h1 className="text-2xl font-bold mt-3">{rankName}</h1>
          <p className="text-warm-subtext mt-1">共 {rankData.songs.length} 首歌曲</p>

          <button className="mt-4 px-4 py-2 bg-warm-primary text-white rounded-lg hover:bg-warm-primary/80">
            ▶ 播放全部
          </button>
        </div>
      </div>

      {/* 下方：歌曲列表 */}
      <div className="flex-1 overflow-auto card p-4">
        {rankData.songs.map((song, index) => (
          <div
            key={song.id}
            className="flex items-center justify-between py-3 border-b border-warm-secondary/40 hover:bg-warm-secondary/40 px-2 rounded-lg transition"
          >
            <div className="flex items-center gap-4">
              <span className="text-warm-subtext w-6 text-right">{index + 1}</span>

              <div>
                <p className="font-medium">{song.name}</p>
                <p className="text-sm text-warm-subtext">{song.artist}</p>
              </div>
            </div>

            <span className="text-sm text-warm-subtext">{song.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}