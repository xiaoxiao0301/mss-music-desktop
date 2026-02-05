import DiscoverPage from "../pages/DiscoverPage";
import PlaylistCategoryPage from "../pages/playlist/PlaylistCategoryPage";
import PlaylistDetailPage from "../pages/playlist/PlaylistDetailPage";
import SongDetailPage from "../pages/song/SongDetailPage";
import AlbumDetailPage from "../pages/album/AlbumDetailPage";
import RankPage from "../pages/rank/RankPage";
import RankDetailPage from "../pages/rank/RankDetailPage";
import ArtistPage from "../pages/artist/ArtistPage";
import ArtistDetailPage from "../pages/artist/ArtistDetailPage";
import MVPage from "../pages/mvs/MVPage";
import MVDetailPage from "../pages/mvs/MVDetailPage";
import RadioPage from "../pages/radio/RadioPage";
import RadioDetailPage from "../pages/radio/RadioDetailPage";
import RecentPage from "../pages/recent/RecentPlaysPage";
import LikedPage from "../pages/liked/LikedPage";

export const PageRegistry = {
  home: DiscoverPage,
  playlistCategory: PlaylistCategoryPage,
  playlistDetail: PlaylistDetailPage,
  songDetail: SongDetailPage,
  albumDetail: AlbumDetailPage,
  rank: RankPage,
  rankDetail: RankDetailPage,
  artist: ArtistPage,
  artistDetail: ArtistDetailPage,
  mv: MVPage,
  mvDetail: MVDetailPage,
  radio: RadioPage,
  radioDetail: RadioDetailPage,
  recent: RecentPage,
  liked: LikedPage,
};
