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
