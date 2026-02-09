import { useEffect, useState, useRef, useMemo } from "react";
import { GetRankingDetail } from "../../../wailsjs/go/backend/RankingBridge";
import TopNavBar from "../../components/TopNavBar";
import SongListDesktop from "../../components/SongList";
import { message } from "antd";
import { useFavorite, useMusicPlayer } from "../../context/MusicContext";

export default function RankDetailPage({ topId, onBack, pushPage }) {
  const [rankData, setRankData] = useState(null);
  const [showFullIntro, setShowFullIntro] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const { isLiked, toggleLike } = useFavorite();
  const { playTrack } = useMusicPlayer();
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

  // 格式化为 SongListDesktop 需要的格式
  const normalizedSongs = useMemo(() => {
    if (!rankData?.song) return [];
    return rankData.song.map((s) => ({
      id: s.songId,
      mid: s.songMid,
      name: s.title,
      artist: s.singerName,
      albumname: s.albumName,
      albummid: s.albumMid,
      duration: s.interval,
      cover: s.cover || `https://y.gtimg.cn/music/photo_new/T002R300x300M000${s.albumMid}.jpg`,
    }));
  }, [rankData]);


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

        <SongListDesktop
          songs={normalizedSongs}
          onPlay={(song) => playTrack(song, normalizedSongs)}
          onLike={(song) => toggleLike(song)}
          likedChecker={(id) => isLiked(id)}
          onSongClick={(song) => pushPage?.({ type: "songDetail", songMid: song.mid })}
          onAlbumClick={(song) => pushPage?.({ type: "albumDetail", albumMid: song.albummid })}
        />
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