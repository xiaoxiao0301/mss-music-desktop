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


export function parseLRC(lrcText) {
  if (!lrcText) return [];

  const normalized = lrcText.replace(/↵/g, "\n").replace(/\r/g, "");
  const lines = normalized.split("\n");
  const result = [];
  const timeReg = /\[(\d{2}):(\d{2})(?:\.(\d{1,3}))?]/g;

  for (const line of lines) {
    let match;
    const times = [];

    while ((match = timeReg.exec(line)) !== null) {
      const min = parseInt(match[1], 10);
      const sec = parseInt(match[2], 10);
      const msRaw = match[3] || "0";
      const ms = parseInt(msRaw.padEnd(3, "0"), 10);
      const time = min * 60 + sec + ms / 1000;
      times.push(time);
    }

    if (times.length === 0) continue;

    const text = line.replace(timeReg, "").trim();
    for (const time of times) {
      result.push({ time, text });
    }
  }

  return result.sort((a, b) => a.time - b.time);
}

export function formatNumber(num) {
  if (!num) return 0;
  if (num > 10000) return (num / 10000).toFixed(1) + "万";
  return num;
}

export function formatDate(ts) {
  if (!ts) return "";
  const d = new Date(ts * 1000);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function getCoverUrl(albumID, size = 300) {
  return `https://y.qq.com/music/photo_new/T002R300x300M000${albumID}.jpg`;
}

export function getSingerCover(singerMid) {
  return `https://y.qq.com/music/photo_new/T001R300x300M000${singerMid}.jpg`
}

export function truncateText(text, maxLength = 10) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}
