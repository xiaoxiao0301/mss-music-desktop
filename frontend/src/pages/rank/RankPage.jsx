import { useState, useEffect } from "react";
import SlidePage from "../../components/SlidePage";
import RankDetailPage from "./RankDetailPage";
import { message } from "antd"
import { GetRankingLists } from "../../../wailsjs/go/backend/RankingBridge";

export default function RankPage() {
  const [groups, setGroups] = useState([]);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [currentTop, setCurrentTop] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [showSpinner, setShowSpinner] = useState(false);
  

  useEffect(() => { const timer = setTimeout(() => setShowSpinner(true), 150); return () => clearTimeout(timer); }, []);
  useEffect(() => {
    async function load() {
      try {
        const lists = await GetRankingLists();
        const data = JSON.parse(lists);
        setGroups(data.data);
        console.log("Fetched ranking lists:", data);
        if (data.data.length > 0) {
          setCurrentGroupId(data.data[0].groupId); // 修复 data(0)
        }
      } catch (error) {
        message.error("网络连接超时")
        console.error("Error fetching ranking lists:", error);
      } finally {
        setLoading(false); // 修复 setIsLoading
      }
    }

    load();
  }, []);

  if (loading) {
  return (
    <div className="p-4 flex justify-center items-center">
      {showSpinner && (
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-warm-primary border-t-transparent"></div>
      )}
    </div>
  );
}


  const currentGroup = groups.find((g) => g.groupId === currentGroupId);

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* 列表页 */}
      <div
        className={`transition-opacity duration-300 ${
          currentTop ? "opacity-0" : "opacity-100" // 修复 currentDetail
        }`}
      >
        {/* 分类 */}
        <div className="card p-4 mb-4">
          <p className="text-sm font-bold mb-2">排行榜分类</p>
          <div className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <button
                key={g.groupId}
                onClick={() => setCurrentGroupId(g.groupId)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentGroupId === g.groupId
                    ? "bg-warm-primary text-white"
                    : "bg-warm-secondary hover:bg-warm-secondary/70"
                }`}
              >
                {g.groupName}
              </button>
            ))}
          </div>
        </div>

        {/* 榜单列表 */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {currentGroup?.toplist?.map((top) => (
            <div
              key={top.topId}
              onClick={() => setCurrentTop(top)}
              className="cursor-pointer rounded-xl bg-warm-secondary/40 hover:bg-warm-secondary/60 transition-colors px-3 py-3 flex"
            >
              {/* 封面区域 */}
              <div className="mr-3 flex-shrink-0 flex items-center justify-center">
                <img
                  src={top.mbFrontLogoUrl}
                  className="w-18 h-18 md:w-20 md:h-20 object-cover rounded-lg shadow"
                />
              </div>

              {/* 右侧内容区域 */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                {/* 标题 */}
                <p className="font-bold text-sm md:text-base truncate mb-1">
                  {top.title}
                </p>

                {/* 歌曲列表（前三首） */}
                <div className="space-y-0.5 text-xs md:text-sm text-warm-subtext">
                  {top.song?.slice(0, 3).map((s, idx) => (
                    <div key={idx} className="flex gap-1 truncate">
                      <span className="text-warm-primary font-semibold w-4 text-right">
                        {idx + 1}.
                      </span>
                      <span className="truncate">
                        {s.title} - {s.singerName}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 底部：总歌曲数 */}
                <div className="mt-1 text-[11px] md:text-xs text-warm-subtext flex justify-between items-center">
                  <span>共 {top.totalNum} 首歌曲</span>
                  <span className="opacity-70" onClick={() => {setCurrentTop(top);}}>查看全部 &gt;</span>
                </div>
              </div>
            </div>
          ))}
        </div>        
      </div>

      {/* 详情页 */}
      <SlidePage show={!!currentTop}>
        <RankDetailPage
          topId={currentTop?.topId}
          onBack={() => setCurrentTop(null)}
        />
      </SlidePage>
    </div>
  );
}
