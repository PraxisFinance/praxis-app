/** First letters of words for avatars when there is no team logo. */
export function getEsportsTeamInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const words = trimmed.split(/\s+/).filter((w) => w.length > 0);
  const letters = words
    .map((w) => {
      const c = w.charAt(0);
      return c ? c.toLocaleUpperCase() : "";
    })
    .join("");
  return letters || "?";
}
