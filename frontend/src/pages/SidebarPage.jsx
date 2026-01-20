import { useState } from "react";

export default function Sidebar({ currentPage, setCurrentPage }) {
  const [collapsed, setCollapsed] = useState(false);

  const randomAvatar = `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`;
  const randomName = ["小明", "阿杰", "星河旅人", "音乐探索者", "夜行者"][Math.floor(Math.random() * 5)];

  return (
    <aside
      className={`
        bg-warm-card shadow-warm flex-shrink-0 flex flex-col p-4
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-60"}
      `}
    >
      {/* 顶部：用户信息 + 折叠按钮 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 overflow-hidden transition-all duration-300">
          <img src={randomAvatar} className="w-10 h-10 rounded-full" />

          {/* 昵称：收缩时隐藏 */}
          {!collapsed && (
            <div className="transition-opacity duration-300">
              <p className="font-bold">{randomName}</p>
              <p className="text-xs text-warm-subtext">未登录</p>
            </div>
          )}
        </div>

        {/* 折叠按钮 */}
        {/* <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-lg text-warm-subtext hover:text-warm-text transition"
        >
          {collapsed ? "➡️" : "⬅️"}
        </button> */}
      </div>

      {/* 导航内容（可滚动） */}
      <div className="flex-1 overflow-auto pr-1">
        <SectionTitle collapsed={collapsed}>音乐馆</SectionTitle>
        <NavItem label="推荐" active={currentPage === "discover"} collapsed={collapsed} onClick={() => setCurrentPage("discover")} />
        <NavItem label="歌单" active={currentPage === "playlist"} collapsed={collapsed} onClick={() => setCurrentPage("playlist")} />
        <NavItem label="歌手" active={currentPage === "artist"} collapsed={collapsed} onClick={() => setCurrentPage("artist")} />
        <NavItem label="排行榜" active={currentPage === "rank"} collapsed={collapsed} onClick={() => setCurrentPage("rank")} />
        <NavItem label="电台" active={currentPage === "radio"} collapsed={collapsed} onClick={() => setCurrentPage("radio")} />

        <SectionTitle collapsed={collapsed}>我的音乐</SectionTitle>
        <NavItem label="喜欢的音乐" active={currentPage === "fav"} collapsed={collapsed} onClick={() => setCurrentPage("fav")} />
        <NavItem label="收藏的歌单" active={currentPage === "fav-playlist"} collapsed={collapsed} onClick={() => setCurrentPage("fav-playlist")} />
        <NavItem label="收藏的歌手" active={currentPage === "fav-artist"} collapsed={collapsed} onClick={() => setCurrentPage("fav-artist")} />
        <NavItem label="最近播放" active={currentPage === "recent"} collapsed={collapsed} onClick={() => setCurrentPage("recent")} />

        <SectionTitle collapsed={collapsed}>其他</SectionTitle>
        <NavItem label="本地与下载" active={currentPage === "local"} collapsed={collapsed} onClick={() => setCurrentPage("local")} />
        <NavItem label="设置" active={currentPage === "settings"} collapsed={collapsed} onClick={() => setCurrentPage("settings")} />
      </div>

      {/* 底部标语 */}
      {!collapsed && (
        <div className="mt-4 text-xs text-warm-subtext transition-opacity duration-300">
          享受生活，享受音乐 🎵
        </div>
      )}
    </aside>
  );
}

/* 小组件：导航项 */
function NavItem({ icon, label, active, collapsed, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg mb-1 cursor-pointer text-sm
        transition-all duration-200
        ${active ? "bg-warm-primary text-white" : "text-warm-subtext hover:bg-warm-secondary/60"}
      `}
    >
      <span className="text-lg transform transition-transform duration-200 group-hover:scale-110">
        {icon}
      </span>

      {/* 文案：收缩时隐藏 */}
      {!collapsed && (
        <span className="transition-opacity duration-300">{label}</span>
      )}
    </div>
  );
}

/* 小组件：分组标题 */
function SectionTitle({ children, collapsed }) {
  if (collapsed) return null;
  return <p className="text-xs text-warm-subtext mt-4 mb-2">{children}</p>;
}
