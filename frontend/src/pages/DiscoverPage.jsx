import { useState, useEffect } from "react";
import { message } from "antd";
import {
  GetRecommendBanners,
  GetDailyRecommendations,
  GetNewSongRecommendations,
  GetNewAlbumRecommendations,
  GetOfficialPlaylistRecommendations
} from "../../wailsjs/go/backend/RecommendBridge";
import { fixUrl, formatPlaylistAuthor, normalizeJson } from "../utils/helper";
import SlidePage from "../components/SlidePage";
import PlaylistDetailPage from "./playlist/PlaylistDetailPage";
import SongDetailPage from "./song/SongDetailPage";
import AlbumDetailPage from "./album/AlbumDetailPage";

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

  // 一次性加载所有数据
  useEffect(() => {
    async function loadAll() {
      try {
        // const [b, d, s, a] = await Promise.all([
        //   GetRecommendBanners(),
        //   GetDailyRecommendations(),
        //   GetNewSongRecommendations(),
        //   GetNewAlbumRecommendations()
        // ]);
        const [b, d, r, s, a] = await Promise.all([
          GetRecommendBanners(),
          GetDailyRecommendations(),
          GetOfficialPlaylistRecommendations(),
          GetNewSongRecommendations(),
          GetNewAlbumRecommendations()
        ]);

        const bannersData = normalizeJson(b);
        const dailyData = normalizeJson(d);
        const recommendData = normalizeJson(r);
        const newSongsData = normalizeJson(s);
        const newAlbumsData = normalizeJson(a);

        if (bannersData.code === 20000) setBanners(bannersData.data);
        if (dailyData.code === 20000) setDailyPlaylists(dailyData.data[0]);
        if (recommendData.code === 20000) setRecommendPlaylists(recommendData.data.list);
        if (newSongsData.code === 20000) setNewSongs(newSongsData.data.list);
        if (newAlbumsData.code === 20000) setNewAlbums(newAlbumsData.data.list);

        console.log("首页数据：", {
          banners: bannersData,
          daily: dailyData,
          recommend: recommendData,
          newSongs: newSongsData,
          newAlbums: newAlbumsData
        });

      } catch (err) {
        console.error(err);
        message.error("网络连接超时");
      } finally {
        setLoading(false);
      }
    }

    loadAll();
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
      <div className="p-4 flex justify-center items-center">
        {showSpinner && (
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-warm-primary border-t-transparent"></div>
        )}
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
                  onClick={() => pushPage({ type: "playlistDetail", data: pl.isDaily ? pl.disstid : String(pl.tid) })}
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
                  // onClick={() => pushPage({ type: "songDetail", data: song })}
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
                  // onClick={() => pushPage({ type: "albumDetail", data: album })}
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
        <PlaylistDetailPage playlistId={currentPage.data} onBack={popPage} />
      </SlidePage>

    </div>
  );
}
