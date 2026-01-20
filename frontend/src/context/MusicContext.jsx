import { createContext, useContext, useState } from "react";

const FavoriteContext = createContext();

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

export function useFavorite() {
  return useContext(FavoriteContext);
}
