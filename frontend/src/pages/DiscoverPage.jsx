import { useState, useEffect } from "react";
import { message } from "antd";
import {
  GetAllRecommendations
} from "../../wailsjs/go/backend/RecommendBridge";
import { fixUrl, formatPlaylistAuthor, normalizeJson } from "../utils/helper";
import SlidePage from "../components/SlidePage";
import PlaylistDetailPage from "./playlist/PlaylistDetailPage";
import SongDetailPage from "./song/SongDetailPage";
import AlbumDetailPage from "./album/AlbumDetailPage";
import { SkeletonGrid } from "../components/SkeletonCard";
import LoadingSpinner from "../components/LoadingSpinner";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function DiscoverPage() {
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);

  const [banners, setBanners] = useState([]);
  const [dailyPlaylists, setDailyPlaylists] = useState(null);
  const [newSongs, setNewSongs] = useState([]);
  const [newAlbums, setNewAlbums] = useState([]);
  const [recommendPlaylists, setRecommendPlaylists] = useState([]);

  // 页面栈：home → playlistCategory → playlistDetail → ...
  const [pageStack, setPageStack] = useState([{ type: "home" }]);
  const currentPage = pageStack[pageStack.length - 1];

  const pushPage = (page) => setPageStack((prev) => [...prev, page]);
  const popPage = () => setPageStack((prev) => prev.slice(0, -1));

  // 延迟显示 spinner（避免闪烁）
  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function loadAllInformation() {
      try {
        const result = await GetAllRecommendations()
        const res = normalizeJson(result)
        if (res.code !== 20000) {
          message.error("推荐信息加载失败");
        }
        console.log("All Recommendations:", res)

        setBanners(res.data.banners)
        setDailyPlaylists(res.data.daily[0])
        setNewAlbums(res.data.new_album.list)
        setNewSongs(res.data.new_song.list)
        setRecommendPlaylists(res.data.official_playlist.list)        
      } catch (err) {
        console.error(err);
        message.error("网络连接超时");
      } finally {
        setLoading(false);
      }      
    }

    loadAllInformation();
  }, []);

  // 把专属推荐歌单插入推荐歌单第一位
  useEffect(() => {
    if (dailyPlaylists && recommendPlaylists.length > 0) {
      setRecommendPlaylists((prev) => [
        { ...dailyPlaylists, isDaily: true },
        ...prev
      ]);
    }
  }, [dailyPlaylists]);

  if (loading) {
    return (
      <div className="w-full h-full overflow-y-auto p-4 flex flex-col gap-8">
        {/* Banner骨架 */}
        <div className="w-full h-48 bg-gray-200 rounded-xl animate-pulse"></div>
        {/* 推荐歌单骨架 */}
        <SkeletonGrid columns={5} count={5} />
        {/* 新歌推荐骨架 */}
        <SkeletonGrid columns={5} count={5} />
        {/* 新专辑骨架 */}
        <SkeletonGrid columns={5} count={5} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* 首页 */}
      <SlidePage show={currentPage.type === "home"}>
        <div className="w-full h-full overflow-y-auto p-4 flex flex-col gap-8">

          {/* Banner */}
          <section>
            <h2 className="text-xl font-bold mb-3">专辑上新</h2>
            <div className="w-full h-48 rounded-xl overflow-hidden">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 3000 }}
                loop={banners.length > 1}
                pagination={{ clickable: true }}
                className="w-full h-full"
              >
                {banners.map((b) => (
                  <SwiperSlide key={b.id}>
                    <img
                      src={fixUrl(b.picUrl)}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>

           {/* <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">专属歌单</h2>
            </div>

            <div className="grid grid-cols-5 gap-4">
              <div
                key={dailyPlaylists.disstid}
                className="card p-3 rounded-xl cursor-pointer hover:bg-warm-secondary/40 transition"
                onClick={() => pushPage({ type: "playlistDetail", data: dailyPlaylists.disstid })}
              >
                <img
                  src={
                      fixUrl(dailyPlaylists.logo) || fixUrl(dailyPlaylists.headurl)
                  }
                  className="w-full h-40 object-cover rounded-lg shadow"
                />

                <p className="mt-2 font-bold truncate">
                  {dailyPlaylists.dissname}
                </p>

                <p className="text-sm text-warm-subtext truncate">
                  {formatPlaylistAuthor(dailyPlaylists)}
                </p>
              </div>
            </div>
          </section> */}
          {/* 推荐歌单 */}
           <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">推荐歌单</h2>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {recommendPlaylists.map((pl) => (
                <div
                  key={pl.isDaily ? pl.disstid : pl.tid}
                  className="card p-3 rounded-xl cursor-pointer hover:bg-warm-secondary/40 transition"
                  onClick={() => pushPage({ type: "playlistDetail", data: pl.isDaily ? pl.disstid : String(pl.tid), initialData: pl.isDaily ? pl : null })}
                >
                  <img
                    src={
                      pl.isDaily
                        ? fixUrl(pl.logo) || fixUrl(pl.headurl)
                        : fixUrl(pl.cover_url_medium)
                    }
                    className="w-full h-40 object-cover rounded-lg shadow"
                  />

                  <p className="mt-2 font-bold truncate">
                    {pl.isDaily ? pl.dissname : pl.title}
                  </p>

                  <p className="text-sm text-warm-subtext truncate">
                    {formatPlaylistAuthor(pl)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 新歌推荐 */}
          <section>
            <h2 className="text-xl font-bold mb-3">新歌推荐</h2>

            <div className="grid grid-cols-5 gap-4">
              {newSongs.map((song) => (
                <div
                  key={song.id}
                  className="card p-3 rounded-xl cursor-pointer hover:bg-warm-secondary/40 transition"
                  onClick={() => pushPage({ type: "songDetail", data: song.mid })}
                >
                  <img
                    src={fixUrl(
                      `https://y.qq.com/music/photo_new/T002R300x300M000${song.album.mid}.jpg`
                    )}
                    className="w-full h-40 object-cover rounded-lg shadow"
                  />

                  <p className="mt-2 font-bold truncate">{song.title}</p>

                  <p className="text-sm text-warm-subtext truncate">
                    {song.singer?.map((s) => s.name).join(" / ")}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {song.time_public}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 新专辑推荐 */}
          <section>
            <h2 className="text-xl font-bold mb-3">新专辑推荐</h2>

            <div className="grid grid-cols-5 gap-4">
              {newAlbums.map((album) => (
                <div
                  key={album.id}
                  className="card p-3 rounded-xl cursor-pointer hover:bg-warm-secondary/40 transition"
                  onClick={() => pushPage({ type: "albumDetail", data: album.mid })}
                >
                  <img
                    src={fixUrl(
                      `https://y.qq.com/music/photo_new/T002R300x300M000${album.photo.pic_mid}.jpg`
                    )}
                    className="w-full h-40 object-cover rounded-lg shadow"
                  />

                  <p className="mt-2 font-bold truncate">{album.name}</p>

                  <p className="text-sm text-warm-subtext truncate">
                    {album.singers?.map((s) => s.name).join(" / ")}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </SlidePage>

      {/* 歌单详情页 */}
      <SlidePage show={currentPage.type === "playlistDetail"}>
        <PlaylistDetailPage playlistId={currentPage.data} initialData={currentPage.initialData} onBack={popPage} />
      </SlidePage>

      {/* 歌曲详情页 */}
      <SlidePage show={currentPage.type === "songDetail"}>
        <SongDetailPage songMid={currentPage.data} onBack={popPage} />
      </SlidePage>

      {/* 专辑详情页 */}
      <SlidePage show={currentPage.type === "albumDetail"}>
        <AlbumDetailPage albumMid={currentPage.data} onBack={popPage} />
      </SlidePage>

    </div>
  );
}
