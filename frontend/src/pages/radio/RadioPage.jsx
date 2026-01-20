import { useState } from "react";
import SlidePage from "../../components/SlidePage";
import RadioDetailPage from "./RadioDetailPage";
import { radioCategories, radioList } from "../../mock/radio";

export default function RadioPage() {
  const [currentCategory, setCurrentCategory] = useState("情绪电台");
  const [currentDetail, setCurrentDetail] = useState(null);

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* 列表页（淡出） */}
      <div
        className={`transition-opacity duration-300 ${
          currentDetail ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* 顶部 Banner */}
        <div className="mb-4 overflow-x-auto flex gap-4 pb-2">
          {radioList[currentCategory].map((item) => (
            <div
              key={item.id}
              onClick={() => setCurrentDetail(item)}
              className="min-w-[260px] h-36 rounded-xl overflow-hidden shadow cursor-pointer hover:scale-[1.02] transition"
            >
              <img src={item.cover} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* 分类 */}
        <div className="card p-4 mb-4">
          <p className="text-sm font-bold mb-2">电台分类</p>
          <div className="flex gap-2">
            {radioCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCurrentCategory(cat)}
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

        {/* 电台网格 */}
        <div className="grid grid-cols-4 gap-4">
          {radioList[currentCategory].map((item) => (
            <div
              key={item.id}
              onClick={() => setCurrentDetail(item)}
              className="card p-3 rounded-xl cursor-pointer hover:bg-warm-secondary/40 transition"
            >
              <img
                src={item.cover}
                className="w-full h-40 object-cover rounded-lg shadow"
              />
              <p className="mt-3 font-bold">{item.name}</p>
              <p className="text-sm text-warm-subtext">{item.desc}</p>
              <p className="text-xs text-warm-subtext mt-1">
                播放量：{item.plays}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 详情页（右侧滑入） */}
      <SlidePage show={!!currentDetail}>
        <RadioDetailPage
          radio={currentDetail}
          onBack={() => setCurrentDetail(null)}
        />
      </SlidePage>
    </div>
  );
}
