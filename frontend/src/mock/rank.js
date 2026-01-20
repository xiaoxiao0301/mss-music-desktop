export const rankCategories = ["官方榜", "场景榜", "风格榜"];

export const rankSubCategories = {
  官方榜: ["热歌榜", "新歌榜", "原创榜"],
  场景榜: ["KTV 热榜", "DJ 热榜", "影视金曲"],
  风格榜: ["流行榜", "摇滚榜", "民谣榜"],
};

export const rankLists = {
  热歌榜: {
    cover: "https://picsum.photos/200?hot",
    songs: [
      { id: 1, name: "Song A", artist: "Artist 1", duration: "03:45" },
      { id: 2, name: "Song B", artist: "Artist 2", duration: "04:12" },
    ],
  },
  新歌榜: {
    cover: "https://picsum.photos/200?new",
    songs: [
      { id: 3, name: "Song C", artist: "Artist 3", duration: "03:55" },
      { id: 4, name: "Song D", artist: "Artist 4", duration: "04:20" },
    ],
  },
  原创榜: {
    cover: "https://picsum.photos/200?original",
    songs: [
      { id: 5, name: "Song E", artist: "Artist 5", duration: "04:10" },
    ],
  },
};
