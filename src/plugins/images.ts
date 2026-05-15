/**
 * Image plugin: rewrites relative image paths to base64 data URIs
 * so the output HTML is truly self-contained.
 */
import * as fs from "fs";
import * as path from "path";

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

export function mimeForExt(ext: string): string | undefined {
  return MIME[ext.toLowerCase()];
}

/**
 * Given an HTML string and the directory of the source markdown file,
 * replaces `src` attributes of <img> tags that point to local files
 * with inline base64 data URIs.
 */
export function inlineImages(html: string, sourceDir: string): string {
  return html.replace(
    /<img([^>]*?)\ssrc=["']([^"']+)["']([^>]*?)>/gi,
    (_match, before, src, after) => {
      if (/^https?:\/\//i.test(src) || src.startsWith("data:")) {
        return _match;
      }
      const absPath = path.resolve(sourceDir, src);
      if (!fs.existsSync(absPath)) {
        return _match;
      }
      const ext = path.extname(absPath);
      const mime = mimeForExt(ext);
      if (!mime) {
        return _match;
      }
      const data = fs.readFileSync(absPath).toString("base64");
      const dataUri = `data:${mime};base64,${data}`;
      return `<img${before} src="${dataUri}"${after}>`;
    }
  );
}

/**
 * Adds a responsive max-width style to all <img> tags that don't already
 * have an explicit width or style attribute.
 */
export function addResponsiveImages(html: string): string {
  return html.replace(
    /<img([^>]*?)>/gi,
    (_match, attrs) => {
      if (/\bstyle=["']/i.test(attrs) || /\bwidth=["'\d]/i.test(attrs)) {
        return _match;
      }
      return `<img${attrs} style="max-width:100%;height:auto;">`;
    }
  );
}
