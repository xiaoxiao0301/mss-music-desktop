import React from "react";
import { useEffect, useState } from "react";
import { GetUserProfile } from "../../wailsjs/go/backend/AuthBridge";
import { message } from "antd";
function Sidebar({ currentPage, setCurrentPage }) {
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);
  const [randomAvatar] = useState(
  `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`
  );

  const nicknamePool = [
    "音乐探索者", "旋律旅人", "节奏收集家", "声波漫步者", "深夜听歌人",
    "音浪追逐者", "唱片爱好者", "和弦研究员", "节拍观察者", "旋律捕手",
    "星河旅人", "风中的纸飞机", "云端漫步", "月色温柔", "雾里看花",
    "海边听风", "山间来客", "落日收藏家",
    "数据漫游者", "代码诗人", "系统观察者", "未来来信", "数字旅客",
    "小明", "阿杰", "不困的猫", "摸鱼大师", "快乐小机灵",
    "夜行者", "暗影旅客", "无声之歌", "黑夜听风", "孤独的频率"
  ];

  const [randomName] = useState(
    nicknamePool[Math.floor(Math.random() * nicknamePool.length)]
  );


  const loadUserProfile = async () => {
    try {
      const userID = localStorage.getItem("userID");
      if (!userID) return;

      const profileData = await GetUserProfile(parseInt(userID));
      console.log("Loaded user profile:", profileData);
      setProfile(profileData);
    } catch (e) {
      console.error("Failed to load user profile:", e);
    }
  }

  const handleLogout = () => { 
    localStorage.removeItem("userID"); 
    setProfile(null); 
    message.success("已退出登录"); 
    // 你可以根据需要跳转到登录页 
    // setCurrentPage("login"); 
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  console.log("User profile in sidebar:", profile);
  const avatar = profile?.avatar || randomAvatar;
  const nickname = profile?.nickname || randomName;
  const loggedIn = !!profile;

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
    <img src={avatar} className="w-10 h-10 rounded-full" />

    {/* 昵称：收缩时隐藏 */}
    {!collapsed && (
      <div className="transition-opacity duration-300">
        <p className="font-bold">{nickname}</p>

        {/* 登录状态 / 退出按钮 */}
        {loggedIn ? (
          <button
            onClick={handleLogout}
            className="
              text-xs text-warm-subtext mt-1
              px-2 py-0.5 rounded-md
              hover:bg-warm-secondary/60 hover:text-warm-text
              transition-all duration-200
            "
          >
            退出登录
          </button>
        ) : (
          <p className="text-xs text-warm-subtext mt-1">未登录</p>
        )}
      </div>
    )}
  </div>

  {/* 折叠按钮（你暂时注释掉了，这里保持不动） */}
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
        <NavItem label="MV" active={currentPage === "mv"} collapsed={collapsed} onClick={() => setCurrentPage("mv")} />

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
        no-underline
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

export default React.memo(Sidebar);