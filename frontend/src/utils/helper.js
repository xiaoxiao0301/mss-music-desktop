export function fixUrl(url) {
  if (!url) return "";
  return url.replace(/^http:\/\//, "https://");
}

export function formatConcern(num, title = "关注") {
  if (!num) return "";
  if (num > 100000000) return (num / 100000000).toFixed(1) + " 亿" + title;
  if (num > 10000) return (num / 10000).toFixed(1) + " 万" + title;
  return num + " " + title;
};

export function formatTime(sec) { 
  const m = Math.floor(sec / 60); 
  const s = sec % 60; 
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function normalizeJson(res) {
  return typeof res === "string" ? JSON.parse(res) : res;
}

export function formatPlaylistAuthor(pl) {
  if (pl.isDaily) {
    return "专属推荐";
  } else {
    const nick = pl.creator_info?.nick || pl.nickname || pl.rcmdtemplate || "";
    if (nick.includes("官方")) return "官方歌单";
    if (pl.creator_info?.uin === 2783429033) return "官方歌单";
    return nick || "未知作者";
  }
}

export const AlbumTypeMap = {
  Single: "单曲",
  EP: "迷你专辑",
  Album: "专辑",
  Live: "现场专辑",
  Compilation: "合辑",
  Remix: "混音专辑",
  OST: "原声带",
  Demo: "Demo",
  Instrumental: "纯音乐专辑",
  Unknown: "未知类型"
};

export function formatSize(bytes) {
  if (!bytes || bytes <= 0) return "无";

  const mb = bytes / 1024 / 1024;

  // FLAC 通常很大，超过 100MB 显示为 GB 更友好
  if (mb > 1024) {
    return (mb / 1024).toFixed(2) + " GB";
  }

  return mb.toFixed(2) + " MB";
}
