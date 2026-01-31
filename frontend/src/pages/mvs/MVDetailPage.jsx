import { useEffect, useState } from "react";
import TopNavBar from "../../components/TopNavBar";
import { GetMVDetail } from "../../../wailsjs/go/backend/MVBridge";
import { message } from "antd";
import { fixUrl, formatTime } from "../../utils/helper";

export default function MVDetailPage({ vid, onBack }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!vid) return;
    loadDetail(vid);
  }, [vid]);

  const loadDetail = async (vid) => {
    try {
      setLoading(true);

      const res = await GetMVDetail(vid);
      const data = typeof res === "string" ? JSON.parse(res) : res;

      if (data.code !== 20000) {
        message.error("获取 MV 详情失败");
        return;
      }
      console.log("MV 详情数据：", data);
      setDetail(data.data);
    } catch (e) {
      console.error(e);
      message.error("网络连接超时");
    } finally {
      setLoading(false);
    }
  };

  if (!vid) return null;

  const info = detail?.info;

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

          {/* 封面图 */}
          <div className="card p-4 mb-4">
            <img
              src={fixUrl(info.cover_pic)}
              className="w-full h-56 object-cover rounded-xl shadow"
            />

            <h1 className="text-xl font-bold mt-4">{info.name}</h1>

            {/* 歌手 */}
            <p className="text-sm text-warm-subtext mt-1">
              {info.singers.map((s) => s.name).join(" / ")}
            </p>

            {/* 播放量 + 时长 */}
            <div className="flex gap-4 text-sm text-warm-subtext mt-2">
              <span>播放：{info.playcnt}</span>
              <span>时长：{formatTime(info.duration)}</span>
            </div>

            {/* 发布时间 */}
            <p className="text-xs text-warm-subtext mt-1">
              发布：{new Date(info.pubdate * 1000).toLocaleDateString()}
            </p>

            {/* 版权提示 */}
            {info.msg && (
              <p className="text-xs text-red-500 mt-3">{info.msg}</p>
            )}
          </div>

          {/* 简介 */}
          {info.desc && info.desc.trim() !== "" && (
            <div className="card p-4 mb-4">
              <p className="text-lg font-bold mb-2">简介</p>
              <p className="text-sm text-warm-subtext whitespace-pre-line leading-relaxed">
                {info.desc}
              </p>
            </div>
          )}

          {/* 推荐 MV */}
          {detail.recommend && detail.recommend.length > 0 && (
            <div className="card p-4 mb-4">
              <p className="text-lg font-bold mb-3">相关推荐</p>

              <div className="grid grid-cols-2 gap-4">
                {detail.recommend.map((mv) => (
                  <div
                    key={mv.vid}
                    className="cursor-pointer hover:bg-warm-secondary/40 p-2 rounded-lg transition"
                  >
                    <img
                      src={mv.picurl}
                      className="w-full h-24 object-cover rounded-lg shadow"
                    />

                    <p className="text-sm font-bold mt-2 truncate">{mv.title}</p>

                    <p className="text-xs text-warm-subtext truncate">
                      {mv.singers.map((s) => s.name).join(" / ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
