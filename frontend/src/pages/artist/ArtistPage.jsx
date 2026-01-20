import { useState } from "react";
import SlidePage from "../../components/SlidePage";
import ArtistDetailPage from "./ArtistDetailPage";
import { mockArtists, artistRegions, artistTypes } from "../../mock/artist";

export default function ArtistPage() {
  const [currentArtistId, setCurrentArtistId] = useState(null);

  // 筛选条件
  const [region, setRegion] = useState("全部");
  const [type, setType] = useState("全部");

  // 筛选逻辑
  const filteredArtists = mockArtists.filter((a) => {
    return (region === "全部" || a.region === region) &&
           (type === "全部" || a.type === type);
  });

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* 列表页 */}
      <div className={`transition-opacity duration-300 ${currentArtistId ? "opacity-0" : "opacity-100"}`}>

        {/* 筛选区 */}
        <div className="card p-4 mb-4">
          <p className="text-sm font-bold mb-2">地区</p>
          <div className="flex gap-2 mb-4">
            {artistRegions.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  region === r
                    ? "bg-warm-primary text-white"
                    : "bg-warm-secondary hover:bg-warm-secondary/70"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <p className="text-sm font-bold mb-2">类型</p>
          <div className="flex gap-2">
            {artistTypes.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  type === t
                    ? "bg-warm-primary text-white"
                    : "bg-warm-secondary hover:bg-warm-secondary/70"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ⭐ 头像列表 */}
        <div className="grid grid-cols-6 gap-6">
          {filteredArtists.map((artist) => (
            <div key={artist.id} onClick={() => setCurrentArtistId(artist.id)}
              className="flex flex-col items-center cursor-pointer p-4 card hover:bg-warm-secondary/40 transition rounded-xl"
            >
              <img src={artist.avatar} className="w-24 h-24 rounded-full object-cover shadow mb-3" />
              <p className="font-bold text-center">{artist.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 详情页 */}
      <SlidePage show={!!currentArtistId}>
        <ArtistDetailPage
          artistId={currentArtistId}
          onBack={() => setCurrentArtistId(null)}
        />
      </SlidePage>

    </div>
  );
}
