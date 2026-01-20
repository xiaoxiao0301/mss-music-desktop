import { useState } from "react";
import SlidePage from "../../components/SlidePage";
import RankDetailPage from "./RankDetailPage";
import {
  rankCategories,
  rankSubCategories,
  rankLists,
} from "../../mock/rank";

export default function RankPage() {
  const [currentCategory, setCurrentCategory] = useState("官方榜");
  const [currentSub, setCurrentSub] = useState("热歌榜");
  const [currentDetail, setCurrentDetail] = useState(null);

  const currentList = rankLists[currentSub];

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* 列表页（淡出） */}
      <div
        className={`transition-opacity duration-300 ${
          currentDetail ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* 上：筛选区 */}
        <div className="card p-4 mb-4">
          <div className="mb-4">
            <p className="text-sm font-bold mb-2">排行榜分类</p>
            <div className="flex flex-wrap gap-2">
              {rankCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCurrentCategory(cat);
                    setCurrentSub(rankSubCategories[cat][0]);
                  }}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    currentCategory === cat
                      ? "bg-warm-primary text-white"
                      : "bg-warm-secondary hover:bg-warm-secondary/70"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold mb-2">榜单</p>
            <div className="flex flex-wrap gap-2">
              {rankSubCategories[currentCategory].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setCurrentSub(sub)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    currentSub === sub
                      ? "bg-warm-primary text-white"
                      : "bg-warm-secondary hover:bg-warm-secondary/70"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 下：榜单封面 */}
        <div className="grid grid-cols-4 gap-4">
          <div
            onClick={() => setCurrentDetail(currentSub)}
            className="cursor-pointer card p-4 hover:bg-warm-secondary/40 transition rounded-xl"
          >
            <img
              src={currentList.cover}
              className="w-full h-40 object-cover rounded-lg shadow"
            />
            <p className="mt-3 font-bold">{currentSub}</p>
            <p className="text-sm text-warm-subtext">
              {currentList.songs.length} 首歌曲
            </p>
          </div>
        </div>
      </div>

      {/* 详情页（右侧滑入） */}
      <SlidePage show={!!currentDetail}>
        <RankDetailPage
          rankName={currentDetail}
          onBack={() => setCurrentDetail(null)}
        />
      </SlidePage>
    </div>
  );
}
