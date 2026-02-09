import { PlayCircleOutlined, PlusOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";

export default function SongListDesktop({
  songs = [],
  onPlay,
  onLike,
  likedChecker,
  onSongClick,  // 新增：点击歌曲跳转
  onAlbumClick, // 新增：点击专辑跳转
}) {
  return (
    <div className="w-full mt-4 px-4">
      {/* 表头 */}
      <div className="grid grid-cols-[50px_60px_1fr_200px_220px_120px] py-3 px-4 text-sm text-[#6B6B6B] border-b border-[#EDE7E2]">
        <span>#</span>
        <span>封面</span>
        <span>歌曲</span>
        <span>歌手</span>
        <span>专辑</span>
        <span>操作</span>
      </div>

      {/* 歌曲列表 */}
      <div className="mt-1">
        {songs.map((song, index) => {
          const liked = likedChecker?.(song.id);

          return (
            <div
              key={song.id}
              className="
                grid grid-cols-[50px_60px_1fr_200px_220px_120px]
                items-center
                px-4 py-3
                text-sm
                text-[#2B2B2B]
                border-b border-[#F2EBE5]
                hover:bg-[#FFF7F0]
                transition-colors
              "
            >
              {/* 序号 */}
              <span className="text-center text-[#6B6B6B]">{index + 1}</span>

              {/* 封面 */}
              <img
                src={song.cover}
                className="w-12 h-12 rounded-md object-cover shadow-sm"
              />

              {/* 歌曲名 */}
              <span 
                className={`truncate font-medium ${onSongClick ? 'cursor-pointer hover:text-warm-primary transition' : ''}`}
                onClick={() => onSongClick?.(song)}
              >
                {song.name}
              </span>

              {/* 歌手 */}
              <span className="truncate text-[#6B6B6B]">{song.artist}</span>

              {/* 专辑 */}
              <span 
                className={`truncate text-[#6B6B6B] ${onAlbumClick ? 'cursor-pointer hover:text-warm-primary transition' : ''}`}
                onClick={() => onAlbumClick?.(song)}
              >
                {song.albumname}
              </span>

              {/* 操作按钮 */}
              <div className="flex items-center gap-4">
                {/* 播放 */}
                <PlayCircleOutlined
                  className="text-[#FF8A3D] text-xl cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => onPlay?.(song)}
                />

                {/* 收藏 */}
                {liked ? (
                  <HeartFilled
                    className="text-[#FF8A3D] text-lg cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => onLike?.(song)}
                  />
                ) : (
                  <HeartOutlined
                    className="text-[#6B6B6B] text-lg cursor-pointer hover:text-[#FF8A3D] hover:scale-110 transition-transform"
                    onClick={() => onLike?.(song)}
                  />
                )}

                {/* 添加 */}
                <PlusOutlined
                  className="text-[#6B6B6B] text-lg cursor-pointer hover:text-[#FF8A3D] hover:scale-110 transition-transform"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
