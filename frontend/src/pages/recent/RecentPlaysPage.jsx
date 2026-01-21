import { useFavorite, useMusicPlayer } from "../../context/MusicContext";
import TopNavBar from "../../components/TopNavBar";

export default function RecentPlaysPage() {
  const { recentPlays: recent, removeRecentPlay, clearRecentPlays, toggleLike, isLiked } = useFavorite();
  const { playTrack } = useMusicPlayer();
  
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
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => playTrack(item, recent)}>
              <img src={item.cover} alt="" className="w-12 h-12 rounded object-cover" />
              <div>
                <div className="font-bold">{item.name}</div>
                <div className="text-sm text-warm-subtext">{item.artist}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-warm-subtext">播放 {item.playCount || 1}</div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(item);
                }} 
                className={`text-xl ${isLiked(item.id) ? "text-red-500" : "text-gray-400"}`}
              >
                {isLiked(item.id) ? "❤️" : "🤍"}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeRecentPlay(item.id);
                }} 
                className="px-2 py-1 text-sm rounded bg-warm-secondary"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
