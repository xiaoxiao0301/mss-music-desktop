import { useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { Search } from "lucide-react";
import SongList from "../../components/SongList.jsx";
import { HotKey as SearchHotKeyApi, Search as SearchApi } from "../../../wailsjs/go/backend/SearchBridge";
import { fixUrl, normalizeJson, truncateText } from "../../utils/helper";
import { useFavorite, useMusicPlayer } from "../../context/MusicContext.jsx";

const TAB_TYPES = [
  { key: "songs", label: "Songs", type: 0 },
  { key: "artists", label: "Artists", type: 9 },
  { key: "albums", label: "Albums", type: 8 },
  { key: "mv", label: "MV", type: 12 },
];

export default function SearchPage() {
  const { playTrackWithURL, openPlaylistPicker } = useMusicPlayer();
  const { isLiked, toggleLike } = useFavorite();
  const [keyword, setKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("songs");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ songs: [], artists: [], albums: [], mv: [] });
  const [hotKeys, setHotKeys] = useState([]);
  const [showHotKeys, setShowHotKeys] = useState(false);
  const [hotKeyLoading, setHotKeyLoading] = useState(false);
  const hotKeyRef = useRef(null);

  const activeType = useMemo(() => TAB_TYPES.find((t) => t.key === activeTab)?.type ?? 0, [activeTab]);

  const mappedSongs = useMemo(() => {
    return (results.songs || []).map((item) => ({
      id: item.songid || item.id || item.mid,
      mid: item.songmid || item.mid,
      name: item.songname || item.name,
      artist: (item.singer || []).map((s) => s.name).join("/") || item.singername || item.artist || "",
      albumname: item.albumname || item.album?.name || "",
      cover: fixUrl(`https://y.qq.com/music/photo_new/T002R300x300M000${item.albummid || item.album?.mid}.jpg`),
      duration: item.interval || 0,
    }));
  }, [results.songs]);

  const mappedArtists = useMemo(() => {
    return (results.artists || []).map((item) => ({
      id: item.singerMID || item.singerMid || item.singerID || item.singerid,
      name: item.singerName || item.name,
      cover: fixUrl(item.singerPic || item.pic || ""),
      songNum: item.songNum,
      albumNum: item.albumNum,
    }));
  }, [results.artists]);

  const mappedAlbums = useMemo(() => {
    return (results.albums || []).map((item) => ({
      id: item.albumID || item.albumId || item.album_id,
      mid: item.albumMID || item.albumMid || item.albummid,
      name: item.albumName || item.albumname || item.name,
      cover: fixUrl(item.albumPic || item.pic || ""),
      singer: item.singerName || item.singername || "",
      publishTime: item.publicTime || "",
    }));
  }, [results.albums]);

  const mappedMvs = useMemo(() => {
    return (results.mv || []).map((item) => ({
      id: item.mv_id || item.vid || item.v_id,
      name: item.mv_name || item.mvName || item.name,
      cover: fixUrl(item.mv_pic_url || item.pic || ""),
      artist: item.singer_name || item.singerName || "",
      playCount: item.play_count || 0,
    }));
  }, [results.mv]);

  const runSearch = async (nextKeyword, typeOverride) => {
    const searchKey = (nextKeyword ?? keyword).trim();
    if (!searchKey) return;
    const type = typeOverride ?? activeType;
    setLoading(true);
    try {
      const res = await SearchApi(searchKey, type, 1, 20);
      const data = normalizeJson(res);
      if (data.code !== 20000) {
        message.error(data.message || "搜索失败");
        return;
      }
      const list = data.data?.list || [];
      setResults((prev) => {
        if (type === 0) return { ...prev, songs: list };
        if (type === 9) return { ...prev, artists: list };
        if (type === 8) return { ...prev, albums: list };
        if (type === 12) return { ...prev, mv: list };
        return prev;
      });
    } catch (err) {
      console.error(err);
      message.error("搜索失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keyword.trim()) {
      runSearch(keyword, activeType);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!showHotKeys) return undefined;
    const onOutside = (event) => {
      if (hotKeyRef.current && !hotKeyRef.current.contains(event.target)) {
        setShowHotKeys(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [showHotKeys]);

  const clearKeyword = () => {
    setKeyword("");
    setResults({ songs: [], artists: [], albums: [], mv: [] });
  };

  const loadHotKeys = async () => {
    setHotKeyLoading(true);
    try {
      const res = await SearchHotKeyApi();
      const data = normalizeJson(res);
      if (data.code !== 20000) {
        message.error(data.message || "热搜加载失败");
        return;
      }
      setHotKeys(data.data || []);
    } catch (err) {
      console.error(err);
      message.error("热搜加载失败");
    } finally {
      setHotKeyLoading(false);
    }
  };

  const toggleHotKeys = () => {
    setShowHotKeys((prev) => {
      const next = !prev;
      if (next && hotKeys.length === 0) {
        loadHotKeys();
      }
      return next;
    });
  };

  const applyHotKey = (value) => {
    setKeyword(value);
    setShowHotKeys(false);
    runSearch(value, activeType);
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto pb-10">
        <div className="sticky top-0 z-10 bg-warm-bg/80 backdrop-blur-lg pb-4">
          <div className="relative" ref={hotKeyRef}>
            <button
              type="button"
              onClick={toggleHotKeys}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-orange-500 hover:bg-orange-100 transition"
              aria-label="热搜"
            >
              <Search size={18} />
            </button>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  runSearch(keyword);
                }
              }}
              placeholder="搜索歌曲 / 歌手 / 专辑 / MV"
              className="w-full h-14 pl-14 pr-16 rounded-2xl bg-white shadow-md border border-orange-100 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 text-base"
            />
            {keyword && (
              <button
                type="button"
                onClick={clearKeyword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 hover:text-orange-500"
              >
                清除
              </button>
            )}

            {showHotKeys && (
              <div className="absolute left-0 right-0 top-[4.2rem] bg-white border border-orange-100 rounded-2xl shadow-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-gray-700">热搜词</div>
                  <button
                    type="button"
                    className="text-xs text-orange-500 hover:text-orange-600"
                    onClick={() => setShowHotKeys(false)}
                  >
                    关闭
                  </button>
                </div>
                {hotKeyLoading && (
                  <div className="text-xs text-gray-400 py-2">加载中...</div>
                )}
                {!hotKeyLoading && hotKeys.length === 0 && (
                  <div className="text-xs text-gray-400 py-2">暂无热搜</div>
                )}
                {!hotKeyLoading && hotKeys.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {hotKeys.map((item, index) => (
                      <button
                        key={`${item.k}-${index}`}
                        type="button"
                        onClick={() => applyHotKey(item.k.trim())}
                        className="px-3 py-1.5 text-xs rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 transition"
                      >
                        {item.k}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-4">
            {TAB_TYPES.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                  activeTab === tab.key
                    ? "bg-orange-500 text-white shadow"
                    : "bg-orange-50 text-orange-500 hover:bg-orange-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {activeTab === "songs" && (
            <SongList
              songs={mappedSongs}
              onPlay={(song) => playTrackWithURL(song, mappedSongs)}
              onLike={(song) => toggleLike(song)}
              likedChecker={(mid) => isLiked(mid)}
              onAddToPlaylist={(song) => openPlaylistPicker(song)}
            />
          )}

          {activeTab === "artists" && (
            <div className="grid grid-cols-4 gap-4">
              {mappedArtists.map((artist, index) => (
                <div
                  key={`${artist.id}-${index}`}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition"
                >
                  <img
                    src={artist.cover}
                    alt={artist.name}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <div className="mt-3">
                    <div className="font-semibold text-sm">{artist.name}</div>
                    <div className="text-xs text-gray-500 mt-1">歌曲 {artist.songNum || 0} · 专辑 {artist.albumNum || 0}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "albums" && (
            <div className="grid grid-cols-4 gap-4">
              {mappedAlbums.map((album, index) => (
                <div
                  key={`${album.id}-${index}`}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition"
                >
                  <img
                    src={album.cover}
                    alt={album.name}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <div className="mt-3">
                    <div className="font-semibold text-sm">{album.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{truncateText(album.singer, 10)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "mv" && (
            <div className="grid grid-cols-4 gap-4">
              {mappedMvs.map((mv, index) => (
                <div
                  key={`${mv.id}-${index}`}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition"
                >
                  <img
                    src={mv.cover}
                    alt={mv.name}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <div className="mt-3">
                    <div className="font-semibold text-sm">{mv.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{truncateText(mv.artist, 10)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && keyword && activeTab === "songs" && mappedSongs.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-10">暂无歌曲结果</div>
          )}
          {!loading && keyword && activeTab === "artists" && mappedArtists.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-10">暂无歌手结果</div>
          )}
          {!loading && keyword && activeTab === "albums" && mappedAlbums.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-10">暂无专辑结果</div>
          )}
          {!loading && keyword && activeTab === "mv" && mappedMvs.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-10">暂无 MV 结果</div>
          )}
        </div>
      </div>
    </div>
  );
}
