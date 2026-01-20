import TopNavBar from "../../components/TopNavBar";

export default function RadioDetailPage({ radio, onBack }) {

  if (!radio) return null;
  
  return (
    <div className="flex flex-col h-full overflow-hidden">

      <TopNavBar onBack={onBack} />  

      {/* 顶部封面 */}
      <div className="card p-6 mb-4 flex gap-6 items-center">
        <img
          src={radio.cover}
          className="w-40 h-40 rounded-xl object-cover shadow-lg"
        />

        <div className="flex flex-col justify-between">

          <h1 className="text-2xl font-bold mt-3">{radio.name}</h1>
          <p className="text-warm-subtext mt-1">{radio.desc}</p>
          <p className="text-sm text-warm-subtext mt-1">播放量：{radio.plays}</p>

          <button className="mt-4 px-4 py-2 bg-warm-primary text-white rounded-lg hover:bg-warm-primary/80">
            ▶ 播放电台
          </button>
        </div>
      </div>

      {/* 电台节目列表（模拟） */}
      <div className="flex-1 overflow-auto card p-4">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 border-b border-warm-secondary/40 hover:bg-warm-secondary/40 px-2 rounded-lg transition"
          >
            <div>
              <p className="font-medium">节目 {i + 1}</p>
              <p className="text-sm text-warm-subtext">主播：电台主持人</p>
            </div>
            <span className="text-sm text-warm-subtext">15:20</span>
          </div>
        ))}
      </div>

    </div>
  );
}
