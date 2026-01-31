import { useEffect, useState } from "react";
import TopNavBar from "../../components/TopNavBar";
import { GetRadioCategorySongList } from "../../../wailsjs/go/backend/RadioBridge";
import { message } from "antd";

export default function RadioDetailPage({ radio, onBack }) {
  const [songList, setSongList] = useState(null);

  useEffect(() => {
    if (!radio) return;
    loadSongList(radio.id);
  }, [radio]);

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
      <div className="flex-1 overflow-auto card p-4">
        {!songList && <p className="text-center text-warm-subtext">加载中...</p>}

        {songList?.tracks?.map((track) => (
          <div
            key={track.id}
            className="flex items-center justify-between py-3 border-b border-warm-secondary/40 hover:bg-warm-secondary/40 px-2 rounded-lg transition cursor-pointer"
          >
            <div>
              <p className="font-medium">{track.title}</p>

              <p className="text-sm text-warm-subtext">
                {track.singer.map((s) => s.name).join(" / ")}
              </p>

              <p className="text-xs text-warm-subtext mt-1">
                专辑：{track.album.title}
              </p>
            </div>

            <span className="text-sm text-warm-subtext">
              {formatTime(track.interval)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 工具函数：秒 → mm:ss
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
