import { useState, useEffect } from "react";
import SlidePage from "../../components/SlidePage";
import PlaylistDetailPage from "./PlaylistDetailPage";
import { GetPlaylistTypes, GetPlaylistCategoriesList } from "../../../wailsjs/go/backend/PlaylistBridge";
import { message } from "antd";
import { fixUrl, normalizeJson } from "../../utils/helper";

const pageSize = 20;

export default function PlaylistCategoryPage() {
  const [pageStack, setPageStack] = useState([{ type: "home" }]);
  const currentPage = pageStack[pageStack.length - 1];
  const pushPage = (page) => setPageStack((prev) => [...prev, page]);
  const popPage = () => setPageStack((prev) => prev.slice(0, -1));

  // const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({ id: 10000000, name: "全部" } );
  const [playlists, setPlaylists] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    loadCategoriesLists(selectedCategory.id);
  }, [selectedCategory, page]);

  const loadCategories = async () => {
    try {
        const res = await GetPlaylistTypes();
        const data = normalizeJson(res);

        if (data.code !== 20000) {
          message.error("获取歌单分类失败");
          return;
        }
        console.log("Fetched playlist categories:", data);      
        setCategories(data.data);

        // const hot = data.data.find(g => g.type === "热门"); 
        // if (hot && hot.list.length > 0) { 
        //   setSelectedCategory(hot.list[0]); // { id: 10000000, name: "全部" } 
        // }

    } catch (e) {
      console.error(e); 
      message.error("网络连接超时");
    }
  }

  const loadCategoriesLists = async (categoryId) => {
    try {
        const res = await GetPlaylistCategoriesList(categoryId, page);
        const data = normalizeJson(res);

        if (data.code !== 20000) {
          message.error("获取歌单列表失败");
          return;
        }
        console.log("Fetched playlist categories lists:", data);
        const list = data.data.list || [];
        const total = data.data.total || 0;
        const noMore = page * pageSize >= total;
        setHasMore(!noMore);
        if (page === 1) {
          setPlaylists(list);        
        }  else {
          setPlaylists(prev => [...prev, ...list]);
        }       

    } catch (e) {
      console.error(e); 
      message.error("网络连接超时");
    }
  }

  return (
  <div className="w-full h-full flex flex-col overflow-hidden">

    {/* ⭐ 修改点 1：把顶部栏 + 内容区 包成一个 flex-1 relative 容器 */}
    <div className="flex-1 relative overflow-hidden flex flex-col">

      {/* 顶部栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <span className="text-lg font-bold">{selectedCategory.name || "全部"}</span>

        {/* 分类图标 */}
        <svg
          viewBox="0 0 24 24"
          className="w-8 h-8 text-gray-700 cursor-pointer hover:text-warm-primary transition"
          onClick={() => setShowCategoryPanel(true)}
        >
          <path
            fill="currentColor"
            d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z"
          />
        </svg>
      </div>

      {/* ⭐ 内容区（列表） */}
      <div className="flex-1 overflow-y-auto px-4 mt-4">
        <div className="grid grid-cols-4 gap-4">
          {playlists.map(pl => (
            <div
              key={pl.dissid}
              onClick={() => pushPage({ type: "playlistDetail", playlistId: pl.dissid, initialData: null })}
              className="card p-4 cursor-pointer hover:bg-warm-secondary/40 transition"
            >
              <img
                src={fixUrl(pl.imgurl)}
                className="w-full h-40 rounded-lg object-cover"
              />
              <p className="mt-3 font-bold truncate">{pl.dissname}</p>
            </div>
          ))}
        </div>

        {/* 加载更多 */}
        <div className="text-center py-6">
          {hasMore ? (
            <button
              className="px-4 py-2 bg-warm-primary text-white rounded-lg"
              onClick={() => setPage(prev => prev + 1)}
            >
              加载更多
            </button>
          ) : (
            <p className="text-gray-400 text-sm">没有更多了</p>
          )}
        </div>
      </div>

      {/* ⭐ 修改点 2：分类面板必须放在这个 flex-1 relative 容器里 */}
      {showCategoryPanel && (
        <>
          {/* 遮罩 */}
          <div
            className="absolute inset-0 bg-black/40 z-[999]"
            onClick={() => setShowCategoryPanel(false)}
          />

          {/* 分类面板 */}
          <div className="absolute top-0 left-0 right-0 bg-white z-[1000] p-4 shadow-lg max-h-[70%] overflow-y-auto">
            {categories.map(group => (
              <div key={group.type} className="mb-4">
                <p className="text-sm font-bold mb-2">{group.type}</p>
                <div className="flex flex-wrap gap-2">
                  {group.list.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setPage(1);
                        setSelectedCategory(item);
                        setShowCategoryPanel(false);
                      }}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        selectedCategory?.id === item.id
                          ? "bg-warm-primary text-white"
                          : "bg-warm-secondary hover:bg-warm-secondary/70"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ⭐ 修改点 3：SlidePage 必须放在这里（覆盖顶部栏 + 列表） */}
      <SlidePage show={currentPage.type === "playlistDetail"}>
        <PlaylistDetailPage
          playlistId={currentPage.playlistId}
          initialData={currentPage.initialData}
          onBack={popPage}
        />
      </SlidePage>

    </div>
  </div>
);



}
