import { useEffect, useState, useRef } from "react";
import { message } from "antd";
import { GetArtistTypes, GetArtistListByFilters } from "../../../wailsjs/go/backend/ArtistBridge";

export default function SingerPage() {
  const [filterMeta, setFilterMeta] = useState({
    area: [],
    genre: [],
    index: [],
    sex: [],
  });

  const [filters, setFilters] = useState({
    area: -100,
    genre: -100,
    index: -100,
    sex: -100,
  });

  const [page, setPage] = useState(1);
  const [size] = useState(80);
  const [total, setTotal] = useState(0);

  const [hotlist, setHotlist] = useState([]);
  const [singerlist, setSingerlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const scrollRef = useRef(null);

  // 加载筛选元数据
  useEffect(() => {
    async function loadFilterMeta() {
      try {
        const res = await GetArtistTypes();
        console.log("Fetched artist types:", res);
        const data = typeof res === "string" ? JSON.parse(res) : res;
        console.log("Fetched artist types:", data);
        if (data.code === 20000) {
          setFilterMeta(data.data);
        } else {
          message.error("获取歌手筛选数据失败");
        }
      } catch (e) {
        console.error(e);
        message.error("网络连接超时");
      }
    }
    loadFilterMeta();
  }, []);

  const loadSingerList = async () => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        const res = await GetArtistListByFilters(page, filters.area, filters.genre, filters.sex, filters.index);
        console.log("Fetched artist list:", res);
        const data = typeof res === "string" ? JSON.parse(res) : res;
        console.log("Fetched artist list-d:", data);
        if (data.code !== 20000) {
          message.error("获取歌手列表失败");
          return;
        }

        const d = data.data;
        setTotal(d.total || 0);
        setHotlist(d.hotlist || []);

        if (page === 1) {
          setSingerlist(d.singerlist || []);
        } else {
          setSingerlist(prev => [...prev, ...(d.singerlist || [])]);
        }

        const loadedCount = (page - 1) * size + (d.singerlist?.length || 0);
        setHasMore(loadedCount < d.total);
      } catch (e) {
        console.error(e);
        message.error("网络连接超时");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
  }

  // 加载歌手列表
  useEffect(() => {
    loadSingerList();
  }, [filters, page]);

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
        setPage(prev => prev + 1);
      }
    }

    target.addEventListener("scroll", handleScroll, { passive: true });
    return () => target.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };

  const formatConcern = num => {
    if (!num) return "";
    if (num > 100000000) return (num / 100000000).toFixed(1) + " 亿关注";
    if (num > 10000) return (num / 10000).toFixed(1) + " 万关注";
    return num + " 关注";
  };

  const renderFilterGroup = (label, key, list) => (
    <div className="flex items-center py-2 border-b border-gray-100">
      <div className="w-16 text-gray-500 text-sm">{label}</div>
      <div className="flex flex-wrap gap-2">
        {list.map(item => (
          <button
            key={item.id}
            onClick={() => { console.log(label, key, "click");handleFilterChange(key, item.id)}}
            className={`px-3 py-1 rounded-lg text-sm transition ${
              filters[key] === item.id
                ? "bg-warm-primary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full overflow-y-auto bg-white" ref={scrollRef}>
      {/* 顶部标题 */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">歌手</h1>
        <p className="text-xs text-gray-500">共 {total} 位歌手</p>
      </div>

      {/* 筛选区 */}
      <div className="px-4 pt-4">
        <div className="bg-white rounded-lg border shadow-sm">
          {renderFilterGroup("地区", "area", filterMeta.area || [])}
          {renderFilterGroup("流派", "genre", filterMeta.genre || [])}
          {/* {renderFilterGroup("字母", "index", filterMeta.index || [])} */}
          {renderFilterGroup("性别", "sex", filterMeta.sex || [])}
        </div>
      </div>

      {/* 热门歌手 */}
      {hotlist && hotlist.length > 0 && (
        <div className="px-4 mt-6">
          <h2 className="text-sm font-semibold mb-3">热门歌手</h2>
          <div className="grid grid-cols-6 gap-4">
            {hotlist.map(s => {
              const pic =
                s.singer_pic ||
                `https://y.qq.com/music/photo_new/T001R300x300M000${s.singer_mid}.jpg`;
              return (
                <div
                  key={s.singer_id}
                  className="flex flex-col items-center text-center cursor-pointer group"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mb-2">
                    <img
                      src={pic}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-sm font-medium truncate w-full">{s.singer_name}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {formatConcern(s.concernNum)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 歌手列表 */}
      <div className="px-4 mt-6 pb-10">
        <h2 className="text-sm font-semibold mb-3">全部歌手</h2>

        {loading && page === 1 ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-warm-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {singerlist.map(s => {
              const pic =
                s.singer_pic ||
                `https://y.qq.com/music/photo_new/T001R300x300M000${s.singer_mid}.jpg`;
              return (
                <div
                  key={s.singer_id}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <img
                    src={pic}
                    className="w-12 h-12 rounded-full object-cover bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.singer_name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                      {formatConcern(s.concernNum)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 加载更多 / 没有更多 */}
        {loadingMore && (
          <div className="text-center py-4 text-gray-500 text-sm">加载中...</div>
        )}
        {!hasMore && !loading && (
          <div className="text-center py-4 text-gray-400 text-xs">没有更多了</div>
        )}
      </div>
    </div>
  );
}
