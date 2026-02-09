import { useEffect, useState, useMemo } from "react";
import TopNavBar from "../../components/TopNavBar";
import SongListDesktop from "../../components/SongList";
import { GetArtistDetail, GetArtistAlbums, GetArtistMvs } from "../../../wailsjs/go/backend/ArtistBridge";
import { AddFavorite, RemoveFavorite, GetFavoriteArtists } from "../../../wailsjs/go/backend/FavoriteBridge";
import { message } from "antd";
import { fixUrl, formatConcern, getCoverUrl, getSingerCover } from "../../utils/helper";
import { useMusicPlayer, useFavorite } from "../../context/MusicContext";

export default function ArtistDetailPage({ artistMid, onBack, pushPage }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [songList, setSongList] = useState([]);
  const [totalSongs, setTotalSongs] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [albumList, setAlbumList] = useState([]);
  const [albumTotal, setAlbumTotal] = useState(0);
  const [albumPage, setAlbumPage] = useState(1);
  const [albumLoadingMore, setAlbumLoadingMore] = useState(false);
  const [mvList, setMvList] = useState([]);
  const [mvTotal, setMvTotal] = useState(0);
  const [mvPage, setMvPage] = useState(1);
  const [mvLoadingMore, setMvLoadingMore] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  // 当前 Tab：intro / songs / albums / mv
  const [tab, setTab] = useState("intro");

  const { playTrack } = useMusicPlayer();
  const { isLiked, toggleLike } = useFavorite();

  useEffect(() => {
    if (!artistMid) return;
    setPage(1);
    setSongList([]);
    setTotalSongs(0);
    setDetail(null);
    setAlbumList([]);
    setAlbumTotal(0);
    setAlbumPage(1);
    setMvList([]);
    setMvTotal(0);
    setMvPage(1);
  }, [artistMid]);

  useEffect(() => {
    if (!artistMid) return;
    loadDetail(artistMid, page);
  }, [artistMid, page]);

  useEffect(() => {
    if (!artistMid) return;
    checkIfFollowing(artistMid);
  }, [artistMid]);

  useEffect(() => {
    if (!artistMid) return;
    if (tab !== "albums") return;
    if (albumList.length > 0) return;
    loadArtistAlbums(artistMid, 1);
  }, [artistMid, tab]);

  useEffect(() => {
    if (!artistMid) return;
    if (tab !== "mv") return;
    if (mvList.length > 0) return;
    loadArtistMvs(artistMid, 1);
  }, [artistMid, tab]);

  const normalizedSongs = useMemo(() => {
    if (!songList.length) return [];
    return songList.map((song) => ({
      id: song.id,
      mid: song.mid,
      name: song.title,
      artist: song.singer.map((s) => s.name).join(" / "),
      albumname: song.album.title,
      albummid: song.album.mid,
      duration: song.interval,
      cover: getCoverUrl(song.album.mid),
    }));
  }, [songList]);

  const loadDetail = async (mid, currentPage) => {
    try {
      if (currentPage === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await GetArtistDetail(mid, currentPage);
      const data = typeof res === "string" ? JSON.parse(res) : res;

      if (data.code !== 20000 && data.code !== 1) {
        message.error("获取歌手详情失败");
        return;
      }
      console.log("歌手详情数据：", data); 
      if (currentPage === 1) {
        setDetail(data.data);
        setSongList(data.data.songlist || []);
      } else {
        const nextSongs = data.data.songlist || [];
        setSongList((prev) => [...prev, ...nextSongs]);
      }
      setTotalSongs(data.data.total_song || 0);
    } catch (e) {
      console.error(e);
      message.error("网络连接超时");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (loadingMore) return;
    const total = detail?.total_song || totalSongs;
    if (total && songList.length >= total) return;
    setPage((prev) => prev + 1);
  };

  const loadArtistAlbums = async (mid, currentPage) => {
    try {
      if (currentPage === 1) {
        setAlbumLoadingMore(false);
      } else {
        setAlbumLoadingMore(true);
      }

      const res = await GetArtistAlbums(mid, currentPage);
      const data = typeof res === "string" ? JSON.parse(res) : res;
      if (data.code !== 20000 && data.code !== 1) {
        message.error("获取歌手专辑失败");
        return;
      }

      const list = data.data?.list || [];
      const total = detail?.total_album || data.data?.total || 0;
      if (currentPage === 1) {
        setAlbumList(list);
      } else {
        setAlbumList((prev) => [...prev, ...list]);
      }
      setAlbumTotal(total);
      setAlbumPage(currentPage);
    } catch (error) {
      console.error(error);
      message.error("获取歌手专辑失败");
    } finally {
      setAlbumLoadingMore(false);
    }
  };

  const handleLoadMoreAlbums = () => {
    if (albumLoadingMore) return;
    const total = detail?.total_album || albumTotal;
    if (total && albumList.length >= total) return;
    const nextPage = albumPage + 1;
    loadArtistAlbums(artistMid, nextPage);
  };

  const loadArtistMvs = async (mid, currentPage) => {
    try {
      if (currentPage === 1) {
        setMvLoadingMore(false);
      } else {
        setMvLoadingMore(true);
      }

      const res = await GetArtistMvs(mid, currentPage);
      const data = typeof res === "string" ? JSON.parse(res) : res;
      if (data.code !== 20000 && data.code !== 1) {
        message.error("获取歌手MV失败");
        return;
      }

      const list = data.data?.list || [];
      const total = detail?.total_mv || data.data?.total || 0;
      if (currentPage === 1) {
        setMvList(list);
      } else {
        setMvList((prev) => [...prev, ...list]);
      }
      setMvTotal(total);
      setMvPage(currentPage);
    } catch (error) {
      console.error(error);
      message.error("获取歌手MV失败");
    } finally {
      setMvLoadingMore(false);
    }
  };

  const handleLoadMoreMvs = () => {
    if (mvLoadingMore) return;
    const total = detail?.total_mv || mvTotal;
    if (total && mvList.length >= total) return;
    const nextPage = mvPage + 1;
    loadArtistMvs(artistMid, nextPage);
  };

  const checkIfFollowing = async (mid) => {
    try {
      const userID = localStorage.getItem("userID");
      if (!userID) {
        setIsFollowing(false);
        return;
      }
      const mids = await GetFavoriteArtists();
      setIsFollowing(Array.isArray(mids) && mids.includes(mid));
    } catch (error) {
      console.error("Failed to check follow status:", error);
      setIsFollowing(false);
    }
  };

  const handleToggleFollow = async () => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      message.warning("请先登录");
      return;
    }
    if (!artistMid) return;
    try {
      if (isFollowing) {
        await RemoveFavorite(artistMid, "singer");
        setIsFollowing(false);
        message.success("已取消关注");
      } else {
        await AddFavorite(artistMid, "singer");
        setIsFollowing(true);
        message.success("已关注");
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      message.error("操作失败");
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
              src={getSingerCover(singer.mid)}
              className="w-40 h-40 rounded-xl object-cover shadow-lg"
            />

            <div className="flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{singer.name}</h1>
                <button
                  onClick={handleToggleFollow}
                  className={`px-3 py-1 text-sm rounded transition ${
                    isFollowing
                      ? "bg-warm-primary text-white"
                      : "bg-warm-secondary/70 text-warm-text hover:bg-warm-secondary"
                  }`}
                >
                  {isFollowing ? "已关注" : "关注"}
                </button>
              </div>

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

          {tab === "intro" && (
            <div className="card p-4 mb-4">
              <p className="text-lg font-bold mb-2">歌手简介</p>
              <p className="text-sm leading-relaxed text-warm-subtext whitespace-pre-line">
                {detail.singer_brief}
              </p>
            </div>
          )}

          {tab === "songs" && (
            <div className="mb-4">
              <SongListDesktop
                songs={normalizedSongs}
                onPlay={(song) => playTrack(song, normalizedSongs)}
                onLike={(song) => toggleLike(song)}
                likedChecker={(id) => isLiked(id)}
              />
              {(detail?.total_song || totalSongs) > 0 && songList.length < (detail?.total_song || totalSongs) && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className={`px-4 py-2 rounded-lg text-sm transition ${
                      loadingMore
                        ? "bg-warm-secondary/50 text-warm-subtext"
                        : "bg-warm-secondary text-warm-text hover:bg-warm-secondary/80"
                    }`}
                  >
                    {loadingMore ? "加载中..." : "获取更多"}
                  </button>
                </div>
              )}
              {(detail?.total_song || totalSongs) > 0 && songList.length >= (detail?.total_song || totalSongs) && (
                <p className="text-center text-xs text-warm-subtext mt-4">已加载全部</p>
              )}
            </div>
          )}


          {tab === "albums" && (
            <div className="card p-4 mb-4">
              <p className="text-lg font-bold mb-3">专辑</p>

              {albumList.map((album) => (
                <div
                  key={album.album_mid}
                  className="flex items-center gap-4 py-3 border-b border-warm-secondary/40 cursor-pointer"
                  onClick={() => pushPage?.({ type: "albumDetail", albumMid: album.album_mid })}
                >
                  <img
                    src={getCoverUrl(album.album_mid)}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">{album.album_name}</p>
                    <p className="text-sm text-warm-subtext">{album.pub_time}</p>
                  </div>
                </div>
              ))}

              {(detail?.total_album || albumTotal) > 0 && albumList.length < (detail?.total_album || albumTotal) && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleLoadMoreAlbums}
                    disabled={albumLoadingMore}
                    className={`px-4 py-2 rounded-lg text-sm transition ${
                      albumLoadingMore
                        ? "bg-warm-secondary/50 text-warm-subtext"
                        : "bg-warm-secondary text-warm-text hover:bg-warm-secondary/80"
                    }`}
                  >
                    {albumLoadingMore ? "加载中..." : "获取更多"}
                  </button>
                </div>
              )}
              {(detail?.total_album || albumTotal) > 0 && albumList.length >= (detail?.total_album || albumTotal) && (
                <p className="text-center text-xs text-warm-subtext mt-4">已加载全部</p>
              )}
            </div>
          )}

          {tab === "mv" && (
            <div className="card p-4 mb-4">
              <p className="text-lg font-bold mb-3">MV</p>

              {mvList.map((mv) => (
                <div key={mv.id} className="flex items-center gap-4 py-3 border-b border-warm-secondary/40" >
                  <img src={fixUrl(mv.pic)} className="w-28 h-16 rounded-lg object-cover" />
                  <div>
                    <p className="font-medium">{mv.title}</p>
                    <p className="text-xs text-warm-subtext mt-1">{mv.date}</p>
                  </div>
                </div>
              ))}

              {(detail?.total_mv || mvTotal) > 0 && mvList.length < (detail?.total_mv || mvTotal) && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleLoadMoreMvs}
                    disabled={mvLoadingMore}
                    className={`px-4 py-2 rounded-lg text-sm transition ${
                      mvLoadingMore
                        ? "bg-warm-secondary/50 text-warm-subtext"
                        : "bg-warm-secondary text-warm-text hover:bg-warm-secondary/80"
                    }`}
                  >
                    {mvLoadingMore ? "加载中..." : "获取更多"}
                  </button>
                </div>
              )}
              {(detail?.total_mv || mvTotal) > 0 && mvList.length >= (detail?.total_mv || mvTotal) && (
                <p className="text-center text-xs text-warm-subtext mt-4">已加载全部</p>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
