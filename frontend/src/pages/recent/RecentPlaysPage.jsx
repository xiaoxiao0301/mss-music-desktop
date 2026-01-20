import { useFavorite } from "../../context/MusicContext";
import TopNavBar from "../../components/TopNavBar";

export default function RecentPlaysPage({ onPlay }) {
  const { recentPlays: recent, removeRecentPlay, clearRecentPlays, toggleLike, isLiked } = useFavorite();
  return (
    <div className="p-6">
      <TopNavBar title="最近播放" />
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-bold">最近播放（{recent.length}）</div>
        <div className="flex gap-2">
          <button onClick={() => clearRecentPlays()} className="px-3 py-1 rounded bg-warm-secondary">清空</button>
        </div>
      </div>

      <div className="card">
        {recent.length === 0 && <div className="p-6 text-center text-warm-subtext">暂无播放记录</div>}
        {recent.map(item => (
          <div key={item.id} className="list-item flex items-center justify-between">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => onPlay && onPlay(item)}>
              <img src={item.cover} alt="" className="w-12 h-12 rounded object-cover" />
              <div>
                <div className="font-bold">{item.name}</div>
                <div className="text-sm text-warm-subtext">{item.artist}</div>
                <div className="text-xs text-warm-subtext">上次播放：{new Date(item.lastPlayedAt).toLocaleString()}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-warm-subtext">播放 {item.playCount}</div>
              <button onClick={() => toggleLike(item)} className={`text-xl ${isLiked(item.id) ? "text-red-500" : "text-gray-400"}`}>❤️</button>
              <button onClick={() => removeRecentPlay(item.id)} className="px-2 py-1 text-sm rounded bg-warm-secondary">删除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
