// 歌单筛选标签
export const playlistTags = {
  风格: ["全部", "流行", "摇滚", "民谣", "电子", "说唱", "古风"],
  场景: ["全部", "学习", "运动", "开车", "睡前", "派对", "咖啡厅"],
  情绪: ["全部", "快乐", "治愈", "伤感", "放松", "激情"]
};

// 歌单数据
export const mockPlaylists = [
  {
    id: 1,
    name: "流行热歌精选",
    cover: "https://picsum.photos/400?pop",
    tag: "流行",
    scene: "全部",
    mood: "快乐",
    desc: "最火的流行歌曲，一次听个够",
    playCount: "1200万",
    creator: "官方精选"
  },
  {
    id: 2,
    name: "深夜民谣",
    cover: "https://picsum.photos/400?folk",
    tag: "民谣",
    scene: "睡前",
    mood: "治愈",
    desc: "深夜里最温柔的声音",
    playCount: "860万",
    creator: "民谣馆"
  },
  {
    id: 3,
    name: "运动燃脂歌单",
    cover: "https://picsum.photos/400?run",
    tag: "电子",
    scene: "运动",
    mood: "激情",
    desc: "节奏感强，运动更带劲",
    playCount: "540万",
    creator: "运动音乐台"
  },
  {
    id: 4,
    name: "开车必听·高速巡航",
    cover: "https://picsum.photos/400?drive",
    tag: "摇滚",
    scene: "开车",
    mood: "激情",
    desc: "开车路上不孤单",
    playCount: "430万",
    creator: "车载音乐精选"
  },
  {
    id: 5,
    name: "咖啡厅轻音乐",
    cover: "https://picsum.photos/400?coffee",
    tag: "电子",
    scene: "咖啡厅",
    mood: "放松",
    desc: "适合工作、阅读、发呆",
    playCount: "390万",
    creator: "轻音乐馆"
  },
  {
    id: 6,
    name: "伤感情歌·一个人的夜",
    cover: "https://picsum.photos/400?sad",
    tag: "流行",
    scene: "睡前",
    mood: "伤感",
    desc: "那些让人心碎的旋律",
    playCount: "780万",
    creator: "情歌精选"
  },
  {
    id: 7,
    name: "古风·山海之间",
    cover: "https://picsum.photos/400?gufeng",
    tag: "古风",
    scene: "全部",
    mood: "治愈",
    desc: "琴瑟和鸣，山海皆可平",
    playCount: "510万",
    creator: "古风音乐社"
  },
  {
    id: 8,
    name: "派对嗨歌",
    cover: "https://picsum.photos/400?party",
    tag: "电子",
    scene: "派对",
    mood: "激情",
    desc: "嗨翻全场的节奏",
    playCount: "650万",
    creator: "DJ精选"
  },
  {
    id: 9,
    name: "学习专注·白噪音",
    cover: "https://picsum.photos/400?study",
    tag: "电子",
    scene: "学习",
    mood: "放松",
    desc: "提高专注力的白噪音合集",
    playCount: "300万",
    creator: "学习音乐台"
  },
  {
    id: 10,
    name: "说唱中文精选",
    cover: "https://picsum.photos/400?rap",
    tag: "说唱",
    scene: "全部",
    mood: "激情",
    desc: "中文说唱的魅力",
    playCount: "720万",
    creator: "说唱研究所"
  }
];

export const mockSongs = [
  {
    id: 1,
    playlistId: 1,
    name: "夜曲",
    duration: "03:45",
    artist: "歌手 A",
    cover: "https://picsum.photos/200?1"
  },
  {
    id: 2,
    playlistId: 1,
    name: "晴天",
    duration: "04:12",
    artist: "歌手 B",
    cover: "https://picsum.photos/200?2"
  },
  {
    id: 3,
    playlistId: 2,
    name: "稻香",
    duration: "04:55",
    artist: "民谣歌手",
    cover: "https://picsum.photos/200?3"
  },
  {
    id: 4,
    playlistId: 2,
    name: "孤勇者",
    duration: "04:55",
    artist: "民谣歌手",
    cover: "https://picsum.photos/200?4"
  }
];


