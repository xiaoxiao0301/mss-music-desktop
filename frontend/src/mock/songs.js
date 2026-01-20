export const mockTracks = [
  {
    id: 1,
    name: "测试歌曲 A",
    artist: "歌手 A",
    cover: "https://picsum.photos/200?1",
    url: "/audio/test1.mp3",
    lyrics: [
      { time: 0, text: "第一句歌词" },
      { time: 5, text: "第二句歌词" },
      { time: 10, text: "第三句歌词" },
      { time: 15, text: "第四句歌词" },
    ]
  },
  {
    id: 2,
    name: "测试歌曲 B",
    artist: "歌手 B",
    cover: "https://picsum.photos/200?2",
    url: "/audio/test2.mp3",
    lyrics: [
      { time: 0, text: "开头歌词" },
      { time: 6, text: "继续歌词" },
      { time: 12, text: "副歌开始" },
    ]
  }
];
