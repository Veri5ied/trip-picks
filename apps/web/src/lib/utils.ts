export function priceLabel(level: number) {
  return ["Budget", "Moderate", "Premium"][Math.min(Math.max(level, 1), 3) - 1];
}

export function imgUrl(url: string, width = 400, quality = 80) {
  const base = url.split("?")[0];
  return `${base}?w=${width}&q=${quality}`;
}

export function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
