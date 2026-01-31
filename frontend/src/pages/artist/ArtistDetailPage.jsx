import { useEffect, useState } from "react";
import TopNavBar from "../../components/TopNavBar";
import { GetArtistDetail } from "../../../wailsjs/go/backend/ArtistBridge";
import { message } from "antd";
import { formatTime, formatConcern } from "../../utils/helper";

export default function ArtistDetailPage({ artistMid, onBack }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  // 当前 Tab：intro / songs / albums / mv
  const [tab, setTab] = useState("intro");

  useEffect(() => {
    if (!artistMid) return;
    loadDetail(artistMid);
  }, [artistMid, page]);

  const loadDetail = async (mid) => {
    try {
      setLoading(true);

      const res = await GetArtistDetail(mid, page);
      const data = typeof res === "string" ? JSON.parse(res) : res;

      if (data.code !== 20000 && data.code !== 1) {
        message.error("获取歌手详情失败");
        return;
      }
      console.log("歌手详情数据：", data); 
      setDetail(data.data);
    } catch (e) {
      console.error(e);
      message.error("网络连接超时");
    } finally {
      setLoading(false);
    }
  };

  if (!artistMid) return null;

  const singer = detail?.singer_info;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">

      {/* 顶部栏 */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b p-4 flex items-center justify-between">
        <TopNavBar onBack={onBack} />
      </div>

      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="animate-spin w-10 h-10 border-4 border-warm-primary border-t-transparent rounded-full"></div>
          <p className="text-sm text-warm-subtext mt-3">加载中...</p>
        </div>
      )}

      {!loading && detail && (
        <div className="flex-1 overflow-auto p-4">

          <div className="card p-6 mb-4 flex gap-6 items-center">
            <img
              src={`https://y.qq.com/music/photo_new/T001R300x300M000${singer.mid}.jpg`}
              className="w-40 h-40 rounded-xl object-cover shadow-lg"
            />

            <div className="flex flex-col justify-between">
              <h1 className="text-2xl font-bold">{singer.name}</h1>

              {singer.other_name && (
                <p className="text-warm-subtext mt-1">
                  别名：{singer.other_name}
                </p>
              )}

              <p className="text-sm text-warm-subtext mt-1">
                粉丝：{formatConcern(singer.fans)}
              </p>

              <div className="flex gap-4 text-sm text-warm-subtext mt-2">
                <span>歌曲：{detail.total_song}</span>
                <span>专辑：{detail.total_album}</span>
                <span>MV：{detail.total_mv}</span>
              </div>
            </div>
          </div>

          {/* Tab 切换 */}
          <div className="flex gap-4 mb-4 border-b border-warm-secondary/40 pb-2">
            {[
              { key: "intro", label: "简介" },
              { key: "songs", label: "歌曲" },
              { key: "albums", label: "专辑" },
              { key: "mv", label: "MV" },
            ].map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`pb-1 text-sm ${
                  tab === t.key
                    ? "text-warm-primary border-b-2 border-warm-primary"
                    : "text-warm-subtext"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab 内容区域 */}
          {tab === "intro" && (
            <div className="card p-4 mb-4">
              <p className="text-lg font-bold mb-2">歌手简介</p>
              <p className="text-sm leading-relaxed text-warm-subtext whitespace-pre-line">
                {detail.singer_brief}
              </p>
            </div>
          )}

          {tab === "songs" && (
            <div className="card p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <p className="text-lg font-bold">热门歌曲</p>
                <button className="text-sm text-warm-primary">
                  ▶ 全部播放
                </button>
              </div>

              {detail.songlist.map((song) => (
                <div key={song.id} className="flex items-center justify-between py-3 border-b border-warm-secondary/40 hover:bg-warm-secondary/40 px-2 rounded-lg transition cursor-pointer" >
                  <div>
                    <p className="font-medium">{song.title}</p>

                    <p className="text-sm text-warm-subtext">
                      {song.singer.map((s) => s.name).join(" / ")}
                    </p>

                    <p className="text-xs text-warm-subtext mt-1">
                      专辑：{song.album.title}
                    </p>
                  </div>

                  <span className="text-sm text-warm-subtext">
                    {formatTime(song.interval)}
                  </span>
                </div>
              ))}
            </div>
          )}


          {tab === "albums" && (
            <div className="card p-4 mb-4">
              <p className="text-lg font-bold mb-3">专辑</p>

              {detail.albumlist?.map((album) => (
                <div key={album.id} className="flex items-center gap-4 py-3 border-b border-warm-secondary/40" >
                  <img src={`https://y.qq.com/music/photo_new/T002R300x300M000${album.mid}.jpg`} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <p className="font-medium">{album.title}</p>
                    <p className="text-sm text-warm-subtext">{album.time_public}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "mv" && (
            <div className="card p-4 mb-4">
              <p className="text-lg font-bold mb-3">MV</p>

              {detail.mvlist?.map((mv) => (
                <div key={mv.id} className="flex items-center gap-4 py-3 border-b border-warm-secondary/40" >
                  <img src={`https://y.qq.com/music/photo_new/T015R640x360M101${mv.vid}.jpg`} className="w-28 h-16 rounded-lg object-cover" />
                  <div>
                    <p className="font-medium">{mv.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
