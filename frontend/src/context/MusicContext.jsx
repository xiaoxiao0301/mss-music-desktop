import { createContext, useContext, useState, useRef, useEffect } from "react";
import { GetAudioProxyURL } from "../../wailsjs/go/backend/AudioBridge";
import { message } from "antd";
import { normalizeJson, parseLRC } from "../utils/helper";
import { AddFavorite, RemoveFavorite, GetFavoriteSongs } from "../../wailsjs/go/backend/FavoriteBridge";
import { GetSongLyrics, GetSongPlayURL } from "../../wailsjs/go/backend/SongBridge";
import { AddPlayHistory } from "../../wailsjs/go/backend/PlayHistoryBridge";
import {
  AddSongToUserPlaylist,
  CreateUserPlaylist,
  GetUserPlaylistDetail,
  GetUserPlaylists,
  RemoveSongFromUserPlaylist,
} from "../../wailsjs/go/backend/PlaylistBridge";

const FavoriteContext = createContext();
const MusicPlayerContext = createContext();

export function FavoriteProvider({ children }) {
  const [likedSongs, setLikedSongs] = useState([]); // 前端显示用的完整歌曲对象
  const [likedSongMids, setLikedSongMids] = useState([]); // 后端存储的 MID 列表
  const [favoritePlaylists, setFavoritePlaylists] = useState([]);
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [recentPlays, setRecentPlays] = useState([]);

  // 统一处理认证错误
  const handleAuthError = (error) => {
    const errorMsg = String(error || "");
    if (errorMsg.includes("not logged in") || errorMsg.includes("refresh failed")) {
      localStorage.removeItem("userID");
      message.warning("登录已过期，请重新登录");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return true;
    }
    return false;
  };

  // 初始化时从后端加载收藏的歌曲MID列表
  useEffect(() => {
    const loadFavoriteSongs = async () => {
      try {
        const userID = localStorage.getItem("userID");
        if (!userID) {
          setLikedSongMids([]);
          return;
        }
        const mids = await GetFavoriteSongs();
        setLikedSongMids(mids || []);
      } catch (error) {
        if (handleAuthError(error)) {
          setLikedSongMids([]);
          return;
        }
        console.error("Failed to load favorite songs:", error);
      }
    };
    loadFavoriteSongs();
  }, []);

  // 歌曲是否喜欢
  const isLiked = (mid) => likedSongMids.includes(mid);

  // 切换喜欢歌曲（异步调用后端）
  const toggleLike = async (song) => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      message.warning("请先登录");
      return;
    }
    const simpleSong = {
      id: song.id,
      mid: song.mid,
      name: song.name,
      artist: song.artist,
      duration: song.duration,
      cover: song.cover
    };

    if (isLiked(song.mid)) {
      // 取消收藏
      try {
        await RemoveFavorite(song.mid, "song");
        setLikedSongMids(likedSongMids.filter(m => m !== song.mid));
        setLikedSongs(likedSongs.filter(s => s.mid !== song.mid));
        message.success("已取消收藏");
      } catch (error) {
        if (handleAuthError(error)) return;
        console.error("Failed to remove favorite:", error);
        message.error("取消收藏失败");
      }
    } else {
      // 添加收藏
      try {
        await AddFavorite(song.mid, "song");
        setLikedSongMids([...likedSongMids, song.mid]);
        setLikedSongs([...likedSongs, simpleSong]);
        message.success("已收藏");
      } catch (error) {
        if (handleAuthError(error)) return;
        console.error("Failed to add favorite:", error);
        message.error("收藏失败");
      }
    }
  };

  // 歌单是否收藏
  const isFavoritePlaylist = (id) =>
    favoritePlaylists.some(pl => pl.id === id);

  // 切换收藏歌单
  const toggleFavoritePlaylist = (playlist) => {
    if (isFavoritePlaylist(playlist.id)) {
      setFavoritePlaylists(
        favoritePlaylists.filter(pl => pl.id !== playlist.id)
      );
    } else {
      setFavoritePlaylists([...favoritePlaylists, playlist]);
    }
  };

  // 是否收藏歌手 
  const isFavoriteArtist = (id) => 
    favoriteArtists.some(ar => ar.id === id); 
  
  // 切换收藏歌手 
  const toggleFavoriteArtist = (artist) => {
    if (isFavoriteArtist(artist.id)) { 
        setFavoriteArtists( 
            favoriteArtists.filter(ar => ar.id !== artist.id) 
        ); 
    } else { 
        setFavoriteArtists([...favoriteArtists, artist]); 
    } 
  };

  // 添加最近播放
  const addRecentPlay = (song) => {
    const simpleSong = {
      id: song.id,
      mid: song.mid,
      name: song.name,
      artist: song.artist,
      duration: song.duration,
      cover: song.cover
    };

    // 去重：移除旧记录
    const filtered = recentPlays.filter(s => s.id !== song.id);

    // 最新播放放最前面
    setRecentPlays([simpleSong, ...filtered]);
  };

  // 删除单条最近播放
  const removeRecentPlay = (id) => {
    setRecentPlays(recentPlays.filter(s => s.id !== id));
  };

  // 清空最近播放
  const clearRecentPlays = () => {
    setRecentPlays([]);
  };


  return (
    <FavoriteContext.Provider
      value={{
        likedSongs,
        likedSongMids,
        isLiked,
        toggleLike,

        favoritePlaylists,
        isFavoritePlaylist,
        toggleFavoritePlaylist,

        favoriteArtists,
        isFavoriteArtist,
        toggleFavoriteArtist,

        recentPlays,
        addRecentPlay,
        removeRecentPlay,
        clearRecentPlays
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

// 音乐播放器Provider
export function MusicPlayerProvider({ children }) {
  const { addRecentPlay } = useContext(FavoriteContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playQueue, setPlayQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showLyricsOverlay, setShowLyricsOverlay] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'
  const [shuffleMode, setShuffleMode] = useState(false);
  const audioRef = useRef(new Audio());
  const pendingLoadRef = useRef(0);
  const lastLoadedRef = useRef({ key: null, url: null });
  const urlCacheRef = useRef(new Map());
  const lyricsCacheRef = useRef(new Map());
  const lyricsLoadingRef = useRef(new Map());
  const prefetchingRef = useRef(new Map());
  const lastErrorTrackRef = useRef(null);

  const [userPlaylists, setUserPlaylists] = useState([]);
  const [playlistSongs, setPlaylistSongs] = useState({});
  const [playlistPickerSong, setPlaylistPickerSong] = useState(null);
  const [playlistLoading, setPlaylistLoading] = useState(false);

  const shouldProxyAudio = (url) => {
    if (!url) return false;
    const clean = url.split("?")[0].toLowerCase();
    return clean.endsWith(".m4a") || clean.endsWith(".mp4");
  };

  const getTrackKey = (track) => track?.mid || track?.id;

  const notifyTrackUnavailable = (track) => {
    const name = track?.name ? `：${track.name}` : "";
    message.warning(`已跳过无法播放的歌曲${name}`);
  };

  const resolveTrackUrl = async (track) => {
    if (!track) return null;
    if (track.url) return track;
    const trackKey = getTrackKey(track);
    if (!trackKey) return null;
    if (urlCacheRef.current.has(trackKey)) {
      return { ...track, url: urlCacheRef.current.get(trackKey) };
    }
    try {
      const res = await GetSongPlayURL(track.mid);
      const data = normalizeJson(res);
      const url = data?.data?.url || "";
      if (url) {
        urlCacheRef.current.set(trackKey, url);
        return { ...track, url };
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  const mergeTrackIntoQueue = (queue, updatedTrack) => {
    const trackKey = getTrackKey(updatedTrack);
    if (!trackKey || !Array.isArray(queue)) return queue || [];
    return queue.map((item) => {
      const itemKey = getTrackKey(item);
      return itemKey === trackKey ? { ...item, ...updatedTrack } : item;
    });
  };

  const loadLyricsForTrack = async (mid) => {
    if (!mid) return { lyrics: [], transLyrics: [] };
    try {
      const res = await GetSongLyrics(mid);
      const data = normalizeJson(res);
      const lyricData = data?.data?.lyric;
      const lyricText = typeof lyricData === "string" ? lyricData : lyricData?.lyric;
      const transText = typeof lyricData === "object" ? lyricData?.trans : data?.data?.trans;
      const lyrics = lyricText ? parseLRC(lyricText) : [];
      const transLyrics = transText ? parseLRC(transText) : [];
      return { lyrics, transLyrics };
    } catch (err) {
      return { lyrics: [], transLyrics: [] };
    }
  };

  const ensureLyrics = async (track) => {
    const trackKey = track?.mid || track?.id;
    if (!trackKey) return;

    const hasLyrics = Array.isArray(track.lyrics) && track.lyrics.length > 0;
    const hasTrans = Array.isArray(track.transLyrics) && track.transLyrics.length > 0;
    if (hasLyrics || hasTrans) {
      if (!lyricsCacheRef.current.has(trackKey)) {
        lyricsCacheRef.current.set(trackKey, {
          lyrics: track.lyrics,
          transLyrics: track.transLyrics,
        });
      }
      return;
    }

    if (lyricsCacheRef.current.has(trackKey)) {
      const cached = lyricsCacheRef.current.get(trackKey);
      setCurrentTrack((prev) => {
        if (!prev || (prev.mid || prev.id) !== trackKey) return prev;
        const prevHasLyrics = Array.isArray(prev.lyrics) && prev.lyrics.length > 0;
        const prevHasTrans = Array.isArray(prev.transLyrics) && prev.transLyrics.length > 0;
        if (prevHasLyrics || prevHasTrans) return prev;
        return { ...prev, ...cached };
      });
      return;
    }

    if (lyricsLoadingRef.current.has(trackKey)) {
      await lyricsLoadingRef.current.get(trackKey);
      return;
    }

    const pending = loadLyricsForTrack(trackKey)
      .then((result) => {
        lyricsCacheRef.current.set(trackKey, result);
        setCurrentTrack((prev) => {
          if (!prev || (prev.mid || prev.id) !== trackKey) return prev;
          return { ...prev, ...result };
        });
        return result;
      })
      .finally(() => {
        lyricsLoadingRef.current.delete(trackKey);
      });

    lyricsLoadingRef.current.set(trackKey, pending);
    await pending;
  };

  const openLyrics = async () => {
    if (!currentTrack) return;
    await ensureLyrics(currentTrack);
    setShowLyrics(true);
  };

  const openLyricsOverlay = async () => {
    if (!currentTrack) return;
    await ensureLyrics(currentTrack);
    setShowLyricsOverlay(true);
  };

  useEffect(() => {
    if (!currentTrack) return;
    const audio = audioRef.current;
    const trackKey = currentTrack.mid || currentTrack.id;
    const trackUrl = currentTrack.url || "";
    const isSameTrack =
      lastLoadedRef.current.key === trackKey &&
      lastLoadedRef.current.url === trackUrl;

    audio.onloadedmetadata = () => setDuration(audio.duration);
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onended = handleTrackEnd;

    if (!trackUrl) {
      return;
    }

    if (isSameTrack) {
      if (isPlaying) {
        audio.play().catch(() => {});
      }
      return;
    }

    const loadId = pendingLoadRef.current + 1;
    pendingLoadRef.current = loadId;
    let cancelled = false;

    const loadTrack = async () => {
      let src = trackUrl;
      const useProxy = shouldProxyAudio(src);
      if (useProxy) {
        try {
          src = await GetAudioProxyURL(src);
        } catch (err) {
          src = trackUrl;
        }
      }
      if (cancelled || pendingLoadRef.current !== loadId) return;
      lastLoadedRef.current = { key: trackKey, url: trackUrl };

      let didFallback = false;
      audio.onerror = () => {
        if (didFallback || !useProxy || !trackUrl) {
          if (lastErrorTrackRef.current !== trackKey) {
            lastErrorTrackRef.current = trackKey;
            notifyTrackUnavailable(currentTrack);
            playNext();
          }
          return;
        }
        didFallback = true;
        audio.src = trackUrl;
        if (isPlaying) {
          audio.play().catch(() => {});
        }
      };

      audio.src = src;
      audio.volume = volume / 100;
      if (isPlaying) {
        audio.play().catch(() => {});
      }
    };

    loadTrack();

    return () => {
      cancelled = true;
      audio.pause();
    };
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (!playQueue.length) return;
    const prefetchNext = async () => {
      const total = playQueue.length;
      if (!total) return;
      let nextIndex = null;

      if (shuffleMode) {
        if (total === 1) return;
        nextIndex = Math.floor(Math.random() * total);
        if (nextIndex === currentIndex) {
          nextIndex = (currentIndex + 1) % total;
        }
      } else {
        if (repeatMode !== 'all' && currentIndex >= total - 1) return;
        nextIndex = (currentIndex + 1) % total;
      }

      const nextTrack = playQueue[nextIndex];
      const trackKey = getTrackKey(nextTrack);
      if (!trackKey || nextTrack?.url) return;
      if (prefetchingRef.current.has(trackKey)) return;

      const pending = resolveTrackUrl(nextTrack)
        .then((resolved) => {
          if (!resolved?.url) return;
          setPlayQueue((prev) => mergeTrackIntoQueue(prev, resolved));
        })
        .finally(() => {
          prefetchingRef.current.delete(trackKey);
        });

      prefetchingRef.current.set(trackKey, pending);
      await pending;
    };

    prefetchNext();
  }, [currentIndex, playQueue, shuffleMode, repeatMode]);

  const loadUserPlaylists = async () => {
    try {
      const res = await GetUserPlaylists();
      const data = normalizeJson(res);
      if (data.code !== 20000) {
        return;
      }
      setUserPlaylists(data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const loadUserPlaylistDetail = async (playlistID) => {
    if (!playlistID) return;
    setPlaylistLoading(true);
    try {
      const res = await GetUserPlaylistDetail(playlistID);
      const data = normalizeJson(res);
      if (data.code !== 20000) {
        return;
      }
      setPlaylistSongs((prev) => ({
        ...prev,
        [playlistID]: data.data?.songs || [],
      }));
    } catch (err) {
      console.log(err);
    } finally {
      setPlaylistLoading(false);
    }
  };

  const openPlaylistPicker = (song) => {
    console.log('click', song)
    setPlaylistPickerSong(song);
    loadUserPlaylists();
  };

  const closePlaylistPicker = () => {
    setPlaylistPickerSong(null);
  };

  const createUserPlaylist = async (name, description = "") => {
    if (!name) return;
    try {
      const res = await CreateUserPlaylist(name, description, "");
      const data = normalizeJson(res);
      if (data.code === 20000) {
        await loadUserPlaylists();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addSongToUserPlaylist = async (playlistID, song) => {
    if (!playlistID || !song) return;
    try {
      await AddSongToUserPlaylist(playlistID, {
        song_mid: song.mid,
        song_name: song.name,
        song_artist: song.artist,
        song_album: song.albumname || song.album || "",
        song_cover: song.cover,
        duration: song.duration || 0,
      });
      await loadUserPlaylistDetail(playlistID);
      message.success("已添加到歌单");
    } catch (err) {
      console.log(err);
      message.error("添加失败");
    }
  };

  const removeSongFromUserPlaylist = async (playlistID, songMid) => {
    if (!playlistID || !songMid) return;
    try {
      await RemoveSongFromUserPlaylist(playlistID, songMid);
      await loadUserPlaylistDetail(playlistID);
      message.success("已移除");
    } catch (err) {
      console.log(err);
      message.error("移除失败");
    }
  };

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeatMode === 'all' || currentIndex < playQueue.length - 1) {
      playNext();
    } else {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playFromQueueIndex = async (startIndex, direction = 1, queueOverride = null) => {
    const queue = queueOverride || playQueue;
    const total = queue.length;
    if (!total) return false;

    let attempts = 0;
    let index = startIndex;
    const tried = new Set();

    while (attempts < total) {
      if (index == null || index < 0 || index >= total) break;
      if (tried.has(index)) break;
      tried.add(index);
      const target = queue[index];
      const resolved = await resolveTrackUrl(target);
      if (resolved?.url) {
        const nextQueue = mergeTrackIntoQueue(queue, resolved);
        playTrack(resolved, nextQueue, index);
        return true;
      }
      notifyTrackUnavailable(target);
      attempts += 1;

      if (shuffleMode) {
        if (total === 1) break;
        index = Math.floor(Math.random() * total);
      } else if (direction > 0) {
        if (index < total - 1) {
          index += 1;
        } else if (repeatMode === 'all') {
          index = 0;
        } else {
          break;
        }
      } else {
        if (index > 0) {
          index -= 1;
        } else if (repeatMode === 'all') {
          index = total - 1;
        } else {
          break;
        }
      }
    }

    message.error("没有可播放的歌曲");
    setIsPlaying(false);
    return false;
  };

  const playNext = () => {
    if (!playQueue.length) return;
    if (!shuffleMode && repeatMode !== 'all' && currentIndex >= playQueue.length - 1) {
      setIsPlaying(false);
      return;
    }
    let nextIndex = null;
    if (shuffleMode) {
      nextIndex = Math.floor(Math.random() * playQueue.length);
    } else {
      nextIndex = (currentIndex + 1) % playQueue.length;
    }
    playFromQueueIndex(nextIndex, 1);
  };

  const playPrev = () => {
    if (!playQueue.length) return;
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    if (!shuffleMode && repeatMode !== 'all' && currentIndex <= 0) {
      audioRef.current.currentTime = 0;
      return;
    }
    let prevIndex = null;
    if (shuffleMode) {
      prevIndex = Math.floor(Math.random() * playQueue.length);
    } else {
      prevIndex = (currentIndex - 1 + playQueue.length) % playQueue.length;
    }
    playFromQueueIndex(prevIndex, -1);
  };

  const seekTo = (value) => {
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const playTrack = (track, queue = null, indexOverride = null) => {
    if (queue) {
      const index = queue.findIndex(t => t.id === track.id);
      const nextQueue = [...queue];
      if (index >= 0) {
        nextQueue[index] = track;
      }
      setPlayQueue(nextQueue);
      const nextIndex = indexOverride ?? (index >= 0 ? index : 0);
      setCurrentIndex(nextIndex);
    } else {
      setPlayQueue([track]);
      setCurrentIndex(0);
    }
    setCurrentTrack(track);
    setIsPlaying(true);
    addRecentPlay?.(track);
    if (track?.mid) {
      AddPlayHistory(track.mid, track.duration || 0).catch(() => {});
    }
  };

  const playTrackWithURL = async (track, queue = null) => {
    if (!track) return;
    const resolved = await resolveTrackUrl(track);
    if (!resolved?.url) {
      message.error("未获取到播放地址");
      return;
    }
    const nextQueue = queue ? mergeTrackIntoQueue(queue, resolved) : null;
    playTrack(resolved, nextQueue);
  };

  const playQueueFromList = async (queue, startIndex = 0) => {
    if (!Array.isArray(queue) || queue.length === 0) return;
    const safeIndex = Math.min(Math.max(startIndex, 0), queue.length - 1);
    setPlayQueue(queue);
    await playFromQueueIndex(safeIndex, 1, queue);
  };

  const pauseTrack = () => {
    const audio = audioRef.current;
    audio.pause();
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    const audio = audioRef.current;
    audio.play().catch(() => {});
    setIsPlaying(true);
  };

  const stopTrack = () => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    const currentModeIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentModeIndex + 1) % modes.length]);
  };

  const toggleShuffle = () => {
    setShuffleMode(!shuffleMode);
  };

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        isPlaying,
        currentTrack,
        playQueue,
        currentTime,
        duration,
        volume,
        showLyrics,
        showLyricsOverlay,
        repeatMode,
        shuffleMode,
        togglePlay,
        playNext,
        playPrev,
        seekTo,
        setVolume,
        playTrack,
        playTrackWithURL,
        playQueueFromList,
        pauseTrack,
        resumeTrack,
        stopTrack,
        setShowLyrics,
        setShowLyricsOverlay,
        openLyrics,
        openLyricsOverlay,
        ensureLyrics,
        toggleRepeat,
        toggleShuffle,
        formatTime,
        audioRef,
        userPlaylists,
        playlistSongs,
        playlistPickerSong,
        playlistLoading,
        loadUserPlaylists,
        loadUserPlaylistDetail,
        openPlaylistPicker,
        closePlaylistPicker,
        createUserPlaylist,
        addSongToUserPlaylist,
        removeSongFromUserPlaylist
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useFavorite() {
  return useContext(FavoriteContext);
}

export function useMusicPlayer() {
  return useContext(MusicPlayerContext);
}
