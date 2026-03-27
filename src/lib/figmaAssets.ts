/**
 * Static files live in `public/figma/<hash>.<ext>`.
 *
 * With Figma Desktop + MCP connected and the Design System file open, run:
 *   npm run figma:assets
 * (see `scripts/download-figma-assets.mjs`). Or set
 * `NEXT_PUBLIC_FIGMA_ASSET_BASE=http://127.0.0.1:3845/assets` for live MCP URLs.
 */
export function figmaSrc(filename: string): string {
  const base = process.env.NEXT_PUBLIC_FIGMA_ASSET_BASE?.replace(/\/$/, "");
  if (base) return `${base}/${filename}`;
  return `/figma/${filename}`;
}
