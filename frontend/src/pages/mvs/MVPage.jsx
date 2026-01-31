import { useEffect, useState } from "react";
import { GetMVCategories, GetMVListByCategory } from "../../../wailsjs/go/backend/MVBridge";
import { message } from "antd";
import { fixUrl, formatTime } from "../../utils/helper";
import SlidePage from "../../components/SlidePage";
import MVDetailPage from "./MVDetailPage";

export default function MVPage() {
  const [categories, setCategories] = useState(null);

  const [area, setArea] = useState(15);     // 默认全部
  const [version, setVersion] = useState(7); // 默认全部

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [mvList, setMvList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentVid, setCurrentVid] = useState(null);


  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadMVList();
  }, [area, version, page]);

  const loadCategories = async () => {
    try {
      const res = await GetMVCategories();
      const data = typeof res === "string" ? JSON.parse(res) : res;

      if (data.code !== 20000) {
        message.error("获取 MV 分类失败");
        return;
      }
      console.log("MV 分类数据：", data);
      setCategories(data.data);
    } catch (e) {
      console.error(e);
      message.error("网络错误");
    }
  };

  const loadMVList = async () => {
    try {
      setLoading(true);

      const res = await GetMVListByCategory(area, version, page);
      const data = typeof res === "string" ? JSON.parse(res) : res;

      if (data.code !== 20000) {
        message.error("获取 MV 列表失败");
        return;
      }
      console.log("MV 分类列表数据：", data);
      const listData = data.data;
      setTotal(listData.total || 0);

      if (page === 1) {
        setMvList(listData.list || []);
      } else {
        setMvList((prev) => [...prev, ...(listData.list || [])]);
      }
    } catch (e) {
      console.error(e);
      message.error("网络错误");
    } finally {
      setLoading(false);
    }
  };

  const resetPageAndLoad = (setter, value) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-white">

      {/* Loading 遮罩层 */}
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-[999] flex flex-col items-center justify-center pointer-events-none">
          <div className="animate-spin w-8 h-8 border-4 border-warm-primary border-t-transparent rounded-full"></div>
          <p className="text-sm text-warm-subtext mt-2">加载中...</p>
        </div>
      )}

      <div className="flex-1 overflow-auto p-4">

        {/* 分类筛选 */}
        {categories && (
          <div className="card p-4 mb-4">
            <p className="text-sm font-bold mb-2">MV 筛选</p>

            <FilterRow
              title="地区"
              list={categories.area}
              selected={area}
              onSelect={(v) => resetPageAndLoad(setArea, v)}
            />

            <FilterRow
              title="类型"
              list={categories.version}
              selected={version}
              onSelect={(v) => resetPageAndLoad(setVersion, v)}
            />
          </div>
        )}

        {/* MV 列表 */}
        <div className="grid grid-cols-3 gap-4">
          {mvList.map((mv) => (
            <MVCard key={mv.mvid} mv={mv} onClick={() => setCurrentVid(mv.vid)} />
          ))}
        </div>

        {/* 加载更多 */}
        {mvList.length < total && (
          <div className="text-center py-6">
            <button
              className="px-4 py-2 bg-warm-primary text-white rounded-lg"
              onClick={() => setPage((p) => p + 1)}
            >
              加载更多
            </button>
          </div>
        )}
      </div>

        <SlidePage show={!!currentVid}>
          <MVDetailPage
            vid={currentVid}
            onBack={() => setCurrentVid(null)}
          />
        </SlidePage>
    </div>
  );
}

/* ------------------ 子组件：筛选行 ------------------ */
function FilterRow({ title, list, selected, onSelect }) {
  return (
    <div className="flex items-center mb-3">
      <span className="w-16 text-sm text-warm-subtext">{title}</span>
      <div className="flex gap-2 flex-wrap">
        {list.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`px-3 py-1 rounded-lg text-sm ${
              selected === item.id
                ? "bg-warm-primary text-white"
                : "bg-warm-secondary hover:bg-warm-secondary/70"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------ 子组件：MV 卡片 ------------------ */
function MVCard({ mv, onClick }) {
  return (
    <div 
      className="cursor-pointer hover:bg-warm-secondary/40 p-2 rounded-lg transition"
      onClick={onClick}
    >
      <img
        src={fixUrl(mv.picurl)}
        className="w-full h-28 object-cover rounded-lg shadow"
      />

      <p className="text-sm font-bold mt-2 truncate">{mv.title}</p>

      <p className="text-xs text-warm-subtext truncate">
        {mv.singers.map((s) => s.name).join(" / ")}
      </p>

      <p className="text-xs text-warm-subtext mt-1">
        播放：{mv.playcnt}
      </p>

      <p className="text-xs text-warm-subtext">
        时长：{formatTime(mv.duration)}
      </p>
    </div>
  );
}
