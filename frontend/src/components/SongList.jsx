import { PlayCircleOutlined, PlusOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useMusicPlayer } from "../context/MusicContext";
import { truncateText } from "../utils/helper"

export default function SongListDesktop({
  songs = [],
  onPlay,
  onLike,
  likedChecker,
  onSongClick,  // 新增：点击歌曲跳转
  onAlbumClick, // 新增：点击专辑跳转
  onAddToPlaylist,
}) {
  const { openPlaylistPicker, playTrackWithURL } = useMusicPlayer();
  const handleAddToPlaylist = onAddToPlaylist || openPlaylistPicker;
  const handlePlay = onPlay || ((song) => playTrackWithURL(song));
  return (
    <div className="w-full mt-4 px-4">
      {/* 表头 */}
      <div className="grid grid-cols-[60px_80px_1fr_200px_220px_140px] py-3 px-4 text-[15px] font-medium text-[#7B7B7B] border-b border-[#F5EDE6] bg-[#FAF6F2] rounded-t-lg">
        <span>#</span>
        <span>封面</span>
        <span>歌曲</span>
        <span>歌手</span>
        <span>专辑</span>
        <span className="text-center">操作</span>
      </div>

      {/* 歌曲列表 */}
      <div className="mt-1">
        {songs.map((song, index) => {
          const liked = likedChecker?.(song.mid);

          return (
            <div
              key={song.id}
              className="
                grid grid-cols-[60px_80px_1fr_200px_220px_140px]
                items-center
                px-4 py-3
                text-[15px]
                text-[#232323]
                border-b border-[#F7F3EF]
                hover:bg-[#FFF7F0]
                transition-all duration-200
                rounded-xl
                group
                min-h-[60px]
              "
              style={{ marginBottom: 8 }}
            >
              {/* 序号 */}
              <span className="text-center text-[#B0AFAF] font-light select-none">{index + 1}</span>

              {/* 封面 */}
              <img
                src={song.cover}
                className="w-12 h-12 rounded-lg object-cover shadow border border-[#F2E6DC] mx-auto group-hover:shadow-lg group-hover:border-[#FF8A3D] transition-all"
                alt={song.name}
              />

              {/* 歌曲名 */}
              <span
                className={`truncate font-semibold text-[16px] ${onSongClick ? "cursor-pointer hover:text-[#FF8A3D] transition" : ""}`}
                onClick={() => onSongClick?.(song)}
                title={song.name}
              >
                {song.name}
              </span>

              {/* 歌手 */}
              <span className="truncate text-[#7B7B7B] font-light" title={song.artist}>
                {truncateText(song.artist)}
              </span>

              {/* 专辑 */}
              <span
                className={`truncate text-[#7B7B7B] font-light ${onAlbumClick ? "cursor-pointer hover:text-[#FF8A3D] transition" : ""}`}
                onClick={() => onAlbumClick?.(song)}
                title={song.albumname}
              >
                {truncateText(song.albumname)}
              </span>

              {/* 操作按钮 */}
              <div className="flex items-center gap-4 justify-center">
                {/* 播放 */}
                <PlayCircleOutlined
                  className="text-[#FF8A3D] text-xl cursor-pointer transition-all duration-200 rounded-full p-1 hover:scale-110 hover:bg-[#FFE9D6]"
                  onClick={() => handlePlay(song)}
                  title="播放"
                />

                {/* 收藏 */}
                {liked ? (
                  <HeartFilled
                    className="text-[#FF8A3D] text-lg cursor-pointer transition-all duration-200 rounded-full p-1 hover:scale-110 hover:bg-[#FFE9D6]"
                    onClick={() => onLike?.(song)}
                    title="取消收藏"
                  />
                ) : (
                  <HeartOutlined
                    className="text-[#B0AFAF] text-lg cursor-pointer transition-all duration-200 rounded-full p-1 hover:text-[#FF8A3D] hover:scale-110 hover:bg-[#FFE9D6]"
                    onClick={() => onLike?.(song)}
                    title="收藏"
                  />
                )}

                {/* 添加 */}
                <PlusOutlined
                  className="text-[#B0AFAF] text-lg cursor-pointer transition-all duration-200 rounded-full p-1 hover:text-[#FF8A3D] hover:scale-110 hover:bg-[#FFE9D6]"
                  onClick={() => handleAddToPlaylist?.(song)}
                  title="添加到歌单"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
