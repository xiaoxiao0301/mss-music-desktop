import { useEffect, useState, useRef } from "react";
import { GetRankingDetail } from "../../../wailsjs/go/backend/RankingBridge";
import TopNavBar from "../../components/TopNavBar";
import { message } from "antd"

export default function RankDetailPage({ topId, onBack }) {
  const [rankData, setRankData] = useState(null);
  const [showFullIntro, setShowFullIntro] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);


  const scrollRef = useRef(null);

  // Reset pagination when switching to a new榜单
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setLoadingMore(false);
    setRankData(null);
    setInitialLoading(true)
    if (!topId) {
      setInitialLoading(false)
    }
  }, [topId]);

  useEffect(() => {
    if (!topId) return;

    async function fetchRankDetail() {
      try {
        console.log(`Fetching ranking detail for topId: ${topId}, page: ${page}`);
        const detail = await GetRankingDetail(topId, page);
        const data = JSON.parse(detail);
        console.log("Ranking detail data:", data);
        const songs = Array.isArray(data.data.song) ? data.data.song : [];
        if (page === 1) {
          setRankData(data.data);
        } else {
          setRankData((prev) => ({
            ...prev,
            song: [...prev.song, ...data.data.song],
          }));
        }
        if (songs.length < 100) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching ranking detail:", error);
        message.error("网络连接超时");
        onBack();
      } finally {
        setLoadingMore(false);
        setInitialLoading(false);
      }
    }
    fetchRankDetail();
  }, [topId, page]);

  useEffect(() => {
    const el = scrollRef.current;
    const target = el || window;

    function handleScroll() {
      if (loadingMore || !hasMore) return;
      const threshold = 200;
      const scrollTop = el ? el.scrollTop : window.scrollY || document.documentElement.scrollTop;
      const clientHeight = el ? el.clientHeight : window.innerHeight;
      const scrollHeight = el ? el.scrollHeight : document.documentElement.scrollHeight;
      const nearBottom = scrollTop + clientHeight >= scrollHeight - threshold;
      if (nearBottom) {
        setLoadingMore(true);
        setPage((prev) => prev + 1);
      }
    }
    target.addEventListener("scroll", handleScroll, { passive: true });
    return () => target.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore, topId]);


  if (initialLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-warm-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!rankData) {
    return null;
  }

  const {
    title,
    intro,
    listenNum,
    totalNum,
    frontPicUrl,
    song = [],
  } = rankData;

  const formatListenNum = (num) => {
    if (num > 100000000) return (num / 100000000).toFixed(1) + " 亿";
    if (num > 10000) return (num / 10000).toFixed(1) + " 万";
    return num;
  };


  return (
    <div className="w-full h-full overflow-y-auto bg-white" ref={scrollRef}>

      {/* 顶部栏 */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b p-4 flex items-center justify-between">
        <TopNavBar onBack={onBack} />
        <p className="font-bold">{title}</p>
        <div className="w-6" />
      </div>

      {/* 榜单头部信息 */}
      <div className="p-4">
        <p className="text-sm text-gray-500 mt-1">
          播放量：{formatListenNum(listenNum)}
        </p>

        {/* 简介（可折叠） */}
        {/* <div className="mt-3 text-sm text-gray-700">
          <div
            className={`transition-all ${
              showFullIntro ? "max-h-[500px]" : "max-h-[60px] overflow-hidden"
            }`}
            dangerouslySetInnerHTML={{ __html: intro }}
          />
          <button
            className="text-warm-primary mt-1"
            onClick={() => setShowFullIntro(!showFullIntro)}
          >
            {showFullIntro ? "收起" : "展开全部"}
          </button>
        </div> */}

        {/* 播放全部按钮 */}
        <div className="mt-4">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-warm-primary text-white rounded-lg hover:bg-warm-primary/90 transition"
            onClick={() => console.log("播放全部")}
          >
            {/* 圆形播放按钮 SVG（与你播放器一致） */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="12" r="12" fill="white" opacity="0.2" />
              <path d="M10 8v8l6-4z" fill="white" />
            </svg>
            播放全部
          </button>
        </div>
      </div>

      {/* 歌曲列表 */}
      <div className="px-4 pb-10">
        <p className="text-sm text-gray-500 mb-3">
          共 {totalNum} 首歌曲
        </p>

        {song.map((s) => {
          const coverUrl =
            s.cover ||
            `https://y.gtimg.cn/music/photo_new/T002R300x300M000${s.albumMid}.jpg`;

          return (
            <div
              key={s.songId}
              className="grid grid-cols-[80px_1fr_120px] items-center py-2 border-b hover:bg-gray-100 transition cursor-pointer gap-3"
            >
              {/* 左侧：排名 + 封面 */}
              <div className="flex items-center gap-2">
                <div className="w-6 text-right text-lg font-semibold text-gray-700">
                  {s.rank}
                </div>
                <img
                  src={coverUrl}
                  className="w-10 h-10 rounded-md object-cover shadow-sm"
                />
              </div>

              {/* 中间：歌曲名 + 歌手名 */}
              <div className="flex flex-col truncate">
                <p className="font-medium text-[15px] truncate">{s.title}</p>
                <p className="text-xs text-gray-500 truncate">{s.singerName}</p>
              </div>

              {/* 右侧：三个按钮 */}
              <div className="flex items-center justify-between text-gray-600">
                {/* 播放 */}
                <button
                  className="w-8 h-8 flex items-center justify-center hover:text-warm-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("播放歌曲:", s.songId);
                  }}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="12" fill="currentColor" opacity="0.15" />
                    <path d="M10 8v8l6-4z" fill="currentColor" />
                  </svg>
                </button>

                {/* 收藏 */}
                <button
                  className="w-8 h-8 flex items-center justify-center hover:text-warm-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("收藏歌曲:", s.songId);
                  }}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
                  </svg>
                </button>

                {/* 添加 */}
                <button
                  className="w-8 h-8 flex items-center justify-center hover:text-warm-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("加入歌单:", s.songId);
                  }}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {loadingMore && (
        <div className="text-center py-4 text-gray-500">加载中...</div>
      )}

      {!hasMore && (
        <div className="text-center py-4 text-gray-400">没有更多了</div>
      )}

    </div>
  );
}