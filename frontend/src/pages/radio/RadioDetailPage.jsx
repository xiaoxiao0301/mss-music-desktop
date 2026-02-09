import { useEffect, useState, useMemo } from "react";
import TopNavBar from "../../components/TopNavBar";
import SongListDesktop from "../../components/SongList";
import { GetRadioCategorySongList } from "../../../wailsjs/go/backend/RadioBridge";
import { message } from "antd";
import { useFavorite, useMusicPlayer } from "../../context/MusicContext";
import { getCoverUrl } from "../../utils/helper";

export default function RadioDetailPage({ radio, onBack }) {
  const [songList, setSongList] = useState(null);
  const { isLiked, toggleLike } = useFavorite();
  const { playTrack } = useMusicPlayer();

  useEffect(() => {
    if (!radio) return;
    loadSongList(radio.id);
  }, [radio]);

  const normalizedSongs = useMemo(() => {
    if (!songList?.tracks) return [];
    return songList.tracks.map((track) => ({
      id: track.id,
      mid: track.mid,
      name: track.title,
      artist: track.singer.map((s) => s.name).join(" / "),
      albumname: track.album.title,
      albummid: track.album.mid,
      duration: track.interval,
      cover: getCoverUrl(track.album.mid),
    }));
  }, [songList]);

  const loadSongList = async (radioId) => {
    try {
      const res = await GetRadioCategorySongList(radioId);
      const data = typeof res === "string" ? JSON.parse(res) : res;

      if (data.code !== 20000) {
        message.error("获取电台歌曲失败");
        return;
      }

      console.log("电台歌曲列表：", data.data);

      setSongList(data.data);
    } catch (e) {
      console.error(e);
      message.error("网络连接超时");
    }
  };

  if (!radio) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden">

      <TopNavBar onBack={onBack} />

      {/* 顶部封面 */}
      <div className="card p-6 mb-4 flex gap-6 items-center">
        <img
          src={radio.pic_url}
          className="w-40 h-40 rounded-xl object-cover shadow-lg"
        />

        <div className="flex flex-col justify-between">
          <h1 className="text-2xl font-bold mt-3">{radio.title}</h1>
          <p className="text-warm-subtext mt-1">{radio.listenDesc}</p>
          <p className="text-sm text-warm-subtext mt-1">
            收听人数：{radio.listenNum}
          </p>

          <button className="mt-4 px-4 py-2 bg-warm-primary text-white rounded-lg hover:bg-warm-primary/80">
            ▶ 播放电台
          </button>
        </div>
      </div>

      {/* 歌曲列表 */}
      <div className="flex-1 overflow-auto">
        {!songList && <p className="text-center text-warm-subtext p-4">加载中...</p>}

        {normalizedSongs.length > 0 && (
          <SongListDesktop
            songs={normalizedSongs}
            onPlay={(song) => playTrack(song, normalizedSongs)}
            onLike={(song) => toggleLike(song)}
            likedChecker={(id) => isLiked(id)}
          />
        )}
      </div>
    </div>
  );
}
