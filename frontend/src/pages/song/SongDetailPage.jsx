import React, { useEffect, useState } from "react";
import { message } from "antd";
import { GetSongDetailAndLyricsAndPlayURL } from "../../../wailsjs/go/backend/SongBridge";
import { formatSize, formatTime, normalizeJson, parseLRC } from "../../utils/helper";
import TopNavBar from "../../components/TopNavBar";
import { useMusicPlayer, useFavorite } from "../../context/MusicContext";

export default function SongDetailPage({ songMid, onBack }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playURL, setPlayURL] = useState(null);
  const { isPlaying, currentTrack, playTrack, pauseTrack } = useMusicPlayer(); 
  const { isLiked, toggleLike } = useFavorite();

  useEffect(() => {
    if (!songMid) return;
    loadSongDetailAndPlayURLandLyrics(songMid);
  }, [songMid]);

  const loadSongDetailAndPlayURLandLyrics = async (mid) => {
    try {
      const res = await GetSongDetailAndLyricsAndPlayURL(mid);
      const data = normalizeJson(res);
      console.log("Fetched song detail, lyrics and play URL:", data); 
      if (data.code !== 20000) {
        message.error("获取歌曲信息失败");
        return;
      }
      console.log("Fetched song detail, lyrics and play URL:", data);
      const songPlayURLData = data.data.playURL;
      if (songPlayURLData.url) {
        setPlayURL(songPlayURLData.url);
      }
      const songLyricData = data.data.lyric;
      const lyricsLines = songLyricData?.lyric ? parseLRC(songLyricData.lyric) : [];
      const transLyricsLines = songLyricData?.trans ? parseLRC(songLyricData.trans) : [];
      setDetail({
        ...data.data.detail,
        lyrics: lyricsLines,
        transLyrics: transLyricsLines,
        rawLyricsLines: songLyricData?.lyric || "",
        rawTransLyricsLines: songLyricData?.trans || "",
      });
    } catch (err) {
      console.log(err); 
      message.error("加载总歌曲信息失败");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <SongDetailSkeleton />;
  if (!detail) return null;

  const track = detail.track_info;
  const info = detail.info;
  const coverUrl = `https://y.qq.com/music/photo_new/T002R300x300M000${track.album.mid}.jpg`;

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50">

      {/* 顶部栏 */}
      <div className="sticky top-0 z-20 bg-white border-b p-4">
        <TopNavBar onBack={onBack} />
      </div>

      {/* 大封面头部 */}
      <HeroHeader 
        track={track} 
        coverUrl={coverUrl}  
        songPlayURL={playURL}
        playTrack={playTrack} 
        pauseTrack={pauseTrack} 
        isPlaying={isPlaying}
        currentTrack={currentTrack}
        isLiked={isLiked} 
        toggleLike={toggleLike}
        lyrics={detail.lyrics}
        transLyrics={detail.transLyrics}
      />

      {/* 信息卡片 */}
      <div className="px-4 space-y-4 mt-4">
        <InfoCard title="简介" value={info.intro?.content?.[0]?.value} />
        <InfoCard title="唱片公司" value={info.company?.content?.[0]?.value} />
        <InfoCard title="语种" value={info.lan?.content?.[0]?.value} />
        <InfoCard title="发行时间" value={info.pub_time?.content?.[0]?.value} />
      </div>

      {/* 音频信息 */}
      {/* <AudioInfoCard file={track.file} /> */}

    </div>
  );
}

/* ---------------- Skeleton ---------------- */

function SongDetailSkeleton() {
  const infoFields = [1, 2, 3, 4]; // 与真实字段数量一致

  return (
    <div className="w-full h-full animate-pulse bg-gray-50">

      {/* 顶部栏占位 */}
      <div className="sticky top-0 z-20 bg-white border-b p-4">
        <div className="w-24 h-6 bg-gray-200 rounded" />
      </div>

      {/* 大封面骨架 */}
      <div className="relative w-full h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gray-200" />
        <div className="absolute inset-0 bg-gray-300 blur-lg opacity-60" />

        <div className="relative z-10 flex items-center gap-4 p-6">
          <div className="w-32 h-32 bg-gray-300 rounded-xl shadow" />

          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-300 rounded w-2/3" />
            <div className="h-4 bg-gray-300 rounded w-1/2" />
            <div className="h-3 bg-gray-300 rounded w-1/3" />
            <div className="h-3 bg-gray-300 rounded w-1/4" />
            <div className="h-3 bg-gray-300 rounded w-1/5" />
          </div>
        </div>
      </div>

      {/* 信息卡片骨架 */}
      <div className="px-4 space-y-4 mt-4">
        {infoFields.map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-4 border space-y-3"
          >
            <div className="h-4 bg-gray-300 rounded w-20" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
          </div>
        ))}
      </div>

      {/* 音频信息骨架 */}
      <div className="px-4 mt-4 pb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border">
          <div className="h-4 bg-gray-300 rounded w-24 mb-3" />

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-28" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

/* ---------------- Hero Header ---------------- */

function HeroHeader({ track, coverUrl, songPlayURL, playTrack, pauseTrack, isPlaying, currentTrack, isLiked, toggleLike, lyrics, transLyrics }) {
  const liked = isLiked(track.mid);
  const isCurrentSongPlaying = currentTrack && currentTrack.id === track.id && isPlaying;


  const togglePlay = async() => {
    if (isCurrentSongPlaying) {
      pauseTrack();
      return;
    }
    if (!songPlayURL) return;
    playTrack({
      id: track.id,
      mid: track.mid,
      name: track.title,
      artist: track.singer.map((s) => s.name).join(" / "),
      cover: coverUrl,
      url: songPlayURL,
      duration: track.interval,
      lyrics: lyrics,
      transLyrics: transLyrics
    });

  };

  const handleLike = () => {
    toggleLike({
      id: track.id,
      mid: track.mid,
      name: track.title,
      artist: track.singer.map((s) => s.name).join(" / "),
      duration: track.interval,
      cover: coverUrl,
    })
  }

  return (
    <div className="relative w-full h-64 overflow-hidden">

      {/* 背景模糊层 */}
      <img
        src={coverUrl}
        loading="lazy"
        className="
          absolute inset-0 w-full h-full object-cover
          blur-lg scale-105 opacity-60
          z-0 pointer-events-none
        "
      />

      {/* 前景内容 */}
      <div className="relative z-10 flex items-center gap-4 p-6">
        <img
          src={coverUrl}
          loading="lazy"
          className="w-32 h-32 rounded-xl shadow-lg object-cover"
        />

        <div className="flex-1 text-white drop-shadow">
          <p className="text-2xl font-bold">{track.title}</p>
          <p className="text-sm mt-1 opacity-90">
            {track.singer.map((s) => s.name).join(" / ")}
          </p>
          <p className="text-xs mt-2 opacity-80">专辑：{track.album.name}</p>
          <p className="text-xs opacity-80">发行时间：{track.time_public}</p>
          <p className="text-xs opacity-80">时长：{formatTime(track.interval)}</p>
        </div>
      </div>

      {/* 收藏按钮（心形） */}
      <button
        onClick={handleLike}
        className="
          absolute bottom-4 right-24
          z-30 pointer-events-auto
          w-14 h-14 rounded-full
          bg-white/90 backdrop-blur
          shadow-xl flex items-center justify-center
          hover:scale-105 active:scale-95
          transition
        "
      >
        {liked ? (
          // 实心红心
          <svg viewBox="0 0 24 24" fill="#e63946" className="w-7 h-7">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                     4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
                     14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
                     6.86-8.55 11.54L12 21.35z" />
          </svg>
        ) : (
          // 空心灰心
          <svg viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" className="w-7 h-7">
            <path d="M12.1 8.64l-.1.1-.11-.11C10.14 6.6 7.1 6.6 5.14 
                     8.56c-1.95 1.95-1.95 5.12 0 7.07L12 22l6.86-6.37c1.95-1.95 
                     1.95-5.12 0-7.07-1.96-1.96-5-1.96-6.96 0z" />
          </svg>
        )}
      </button>

      {/* 播放按钮 */}
      <button
        onClick={togglePlay}
        className="
          absolute bottom-4 right-4
          z-30 pointer-events-auto
          w-14 h-14 rounded-full
          bg-white/90 backdrop-blur
          shadow-xl flex items-center justify-center
          hover:scale-105 active:scale-95
          transition
        "
      >
        {isCurrentSongPlaying ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-gray-800">
            <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-gray-800">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}


/* ---------------- Info Card ---------------- */

function InfoCard({ title, value }) {
  if (!value || value.trim() === "") return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border">
      <p className="font-semibold mb-1">{title}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{value}</p>
    </div>
  );
}

/* ---------------- Audio Info Card ---------------- */

function AudioInfoCard({ file }) {
  if (!file) return null;

  const rows = [
    ["128kbps MP3", file.size_128mp3],
    ["320kbps MP3", file.size_320mp3],
    ["FLAC", file.size_flac],
    ["AAC 96kbps", file.size_96aac],
    ["AAC 192kbps", file.size_192aac],
  ];

  return (
    <div className="px-4 mt-4 pb-6">
      <div className="bg-white rounded-xl shadow-sm p-4 border">
        <p className="font-semibold mb-3">音频信息</p>

        <table className="w-full text-sm text-gray-600">
          <tbody>
            {rows.map(([label, size]) => (
              <tr key={label} className="border-b last:border-none">
                <td className="py-2">{label}</td>
                <td className="py-2 text-right">{formatSize(size)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
