export const basePath = "/apps/colorado-vote";
export const assetPrefix = "/apps/colorado-vote-static";

export function withBase(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${basePath}${path}`;
}
