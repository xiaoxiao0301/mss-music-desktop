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