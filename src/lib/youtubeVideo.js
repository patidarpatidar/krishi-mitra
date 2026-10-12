const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "youtu.be",
]);

export function extractYouTubeVideoId(value) {
  const input = String(value || "").trim();
  if (VIDEO_ID_PATTERN.test(input)) return input;
  if (!input) return "";

  let url;
  try {
    url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
  } catch {
    return "";
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (!YOUTUBE_HOSTS.has(host)) return "";

  const pathParts = url.pathname.split("/").filter(Boolean);
  let videoId = "";

  if (host === "youtu.be") {
    videoId = pathParts[0] || "";
  } else if (url.pathname === "/watch") {
    videoId = url.searchParams.get("v") || "";
  } else {
    const markerIndex = pathParts.findIndex((part) =>
      ["embed", "shorts", "live", "v"].includes(part.toLowerCase())
    );
    if (markerIndex >= 0) videoId = pathParts[markerIndex + 1] || "";
  }

  return VIDEO_ID_PATTERN.test(videoId) ? videoId : "";
}