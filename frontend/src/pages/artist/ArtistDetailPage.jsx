import { useState } from "react";
import {
  mockArtistDetail,
  mockHotSongs,
  mockAlbums,
  mockMVs,
} from "../../mock/artistDetail";
import TopNavBar from "../../components/TopNavBar";
import { useFavorite, useMusicPlayer } from "../../context/MusicContext";

export default function ArtistDetailPage({ artistId, onBack }) {
  const artist = mockArtistDetail[artistId] || mockArtistDetail[1];
  const [tab, setTab] = useState("songs");
  const { isFavoriteArtist, toggleFavoriteArtist } = useFavorite();
  const { playTrack } = useMusicPlayer();

  return (
    <div className="flex-1 overflow-auto p-4">

      <TopNavBar 
        onBack={onBack}
      />  

      {/* 顶部封面 */}
      <div
        className="w-full h-48 rounded-xl bg-cover bg-center mb-6"
        style={{ backgroundImage: `url(${mockArtistDetail.cover})` }}
      ></div>

      {/* 歌手信息 */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={mockArtistDetail.avatar}
          className="w-32 h-32 rounded-full object-cover shadow-warm"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{mockArtistDetail.name}</h1>
          <p className="text-warm-subtext max-w-xl">{mockArtistDetail.desc}</p>

          <div className="flex gap-3 mt-4">
            <button 
              className="btn-primary"
              onClick={() => playTrack(mockHotSongs[0], mockHotSongs)}
            >
              播放热门歌曲
            </button>
            <button className="btn-secondary">关注歌手</button>
            <button onClick={() => toggleFavoriteArtist(mockArtistDetail)}
              className={`px-4 py-2 rounded-lg text-sm ${
                isFavoriteArtist(mockArtistDetail.id)
                  ? "bg-red-500 text-white"
                  : "bg-warm-secondary hover:bg-warm-secondary/70"
              }`}
            >
              {isFavoriteArtist(mockArtistDetail.id) ? "❤️ 已收藏" : "🤍 收藏歌手"}
            </button>
          </div>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-6 border-b border-warm-secondary/40 mb-6">
        <TabButton label="热门歌曲" value="songs" tab={tab} setTab={setTab} />
        <TabButton label="专辑" value="albums" tab={tab} setTab={setTab} />
        <TabButton label="MV" value="mvs" tab={tab} setTab={setTab} />
        <TabButton label="歌手介绍" value="intro" tab={tab} setTab={setTab} />
      </div>

      {/* 内容区 */}
      {tab === "songs" && <HotSongs playTrack={playTrack} />}
      {tab === "albums" && <Albums />}
      {tab === "mvs" && <MVs />}
      {tab === "intro" && <Intro />}
    </div>
  );
}

/* ---------------- Tab 按钮 ---------------- */

function TabButton({ label, value, tab, setTab }) {
  const active = tab === value;
  return (
    <button
      onClick={() => setTab(value)}
      className={`pb-2 text-sm ${
        active
          ? "text-warm-primary border-b-2 border-warm-primary font-bold"
          : "text-warm-subtext hover:text-warm-text"
      }`}
    >
      {label}
    </button>
  );
}

/* ---------------- 热门歌曲 ---------------- */

function HotSongs({ playTrack }) {
  return (
    <div className="card">
      {mockHotSongs.map((song) => (
        <div 
          key={song.id} 
          className="list-item cursor-pointer hover:bg-warm-secondary/20"
          onClick={() => playTrack(song, mockHotSongs)}
        >
          <span className="font-medium">{song.name}</span>
          <span className="text-sm text-warm-subtext">{song.duration}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- 专辑 ---------------- */

function Albums() {
  return (
    <div className="grid grid-cols-5 gap-6">
      {mockAlbums.map((album) => (
        <div key={album.id} className="cursor-pointer">
          <img
            src={album.cover}
            className="w-full h-40 object-cover rounded-xl shadow-warm mb-2"
          />
          <p className="text-sm font-medium">{album.name}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------------- MV ---------------- */

function MVs() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {mockMVs.map((mv) => (
        <div key={mv.id} className="cursor-pointer">
          <img
            src={mv.cover}
            className="w-full h-32 object-cover rounded-xl shadow-warm mb-2"
          />
          <p className="text-sm font-medium">{mv.name}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------------- 歌手介绍 ---------------- */

function Intro() {
  return (
    <div className="card p-4 leading-relaxed text-warm-text">
      {mockArtistDetail.desc}
      <br />
      <br />
      这里可以放更详细的歌手介绍、经历、获奖记录等内容。
    </div>
  );
}
