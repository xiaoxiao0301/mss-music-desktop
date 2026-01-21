import { createContext, useContext, useState, useRef, useEffect } from "react";
import { mockTracks } from "../mock/player";

const FavoriteContext = createContext();
const MusicPlayerContext = createContext();

export function FavoriteProvider({ children }) {
  const [likedSongs, setLikedSongs] = useState([]);
  const [favoritePlaylists, setFavoritePlaylists] = useState([]);
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [recentPlays, setRecentPlays] = useState([]);

  // 歌曲是否喜欢
  const isLiked = (id) => likedSongs.some(s => s.id === id);

  // 切换喜欢歌曲
  const toggleLike = (song) => {
    const simpleSong = {
      id: song.id,
      name: song.name,
      artist: song.artist,
      duration: song.duration,
      cover: song.cover
    };

    if (isLiked(song.id)) {
      setLikedSongs(likedSongs.filter(s => s.id !== song.id));
    } else {
      setLikedSongs([...likedSongs, simpleSong]);
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(mockTracks[0]);
  const [playQueue, setPlayQueue] = useState(mockTracks);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [showLyrics, setShowLyrics] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'
  const [shuffleMode, setShuffleMode] = useState(false);
  const audioRef = useRef(new Audio(currentTrack.url));

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = currentTrack.url;
    audio.volume = volume / 100;
    audio.onloadedmetadata = () => setDuration(audio.duration);
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onended = handleTrackEnd;
    if (isPlaying) audio.play();
    return () => {
      audio.pause();
    };
  }, [currentTrack]);

  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);

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

  const playNext = () => {
    let nextIndex;
    if (shuffleMode) {
      nextIndex = Math.floor(Math.random() * playQueue.length);
    } else {
      nextIndex = (currentIndex + 1) % playQueue.length;
    }
    setCurrentIndex(nextIndex);
    setCurrentTrack(playQueue[nextIndex]);
    setIsPlaying(true);
  };

  const playPrev = () => {
    let prevIndex;
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    if (shuffleMode) {
      prevIndex = Math.floor(Math.random() * playQueue.length);
    } else {
      prevIndex = (currentIndex - 1 + playQueue.length) % playQueue.length;
    }
    setCurrentIndex(prevIndex);
    setCurrentTrack(playQueue[prevIndex]);
    setIsPlaying(true);
  };

  const seekTo = (value) => {
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const playTrack = (track, queue = null) => {
    if (queue) {
      setPlayQueue(queue);
      const index = queue.findIndex(t => t.id === track.id);
      setCurrentIndex(index >= 0 ? index : 0);
    } else {
      const index = playQueue.findIndex(t => t.id === track.id);
      if (index >= 0) {
        setCurrentIndex(index);
      } else {
        setPlayQueue([track, ...playQueue]);
        setCurrentIndex(0);
      }
    }
    setCurrentTrack(track);
    setIsPlaying(true);
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
        repeatMode,
        shuffleMode,
        togglePlay,
        playNext,
        playPrev,
        seekTo,
        setVolume,
        playTrack,
        setShowLyrics,
        toggleRepeat,
        toggleShuffle,
        formatTime
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
