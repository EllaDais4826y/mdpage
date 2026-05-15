/**
 * Front matter plugin: strips YAML front matter from markdown
 * and exposes metadata (title, description, author, date) for use
 * in the HTML template.
 */

export interface FrontMatter {
  title?: string;
  description?: string;
  author?: string;
  date?: string;
  [key: string]: string | undefined;
}

export interface FrontMatterResult {
  metadata: FrontMatter;
  content: string;
}

const FRONT_MATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/**
 * Parse a simple YAML-like key: value front matter block.
 * Only supports flat string values (no nested objects or arrays).
 */
export function parseFrontMatter(raw: string): FrontMatterResult {
  const match = raw.match(FRONT_MATTER_REGEX);
  if (!match) {
    return { metadata: {}, content: raw };
  }

  const block = match[1];
  const content = raw.slice(match[0].length);
  const metadata: FrontMatter = {};

  for (const line of block.split(/\r?\n/)) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key) {
      metadata[key] = value;
    }
  }

  return { metadata, content };
}

/**
 * Generate <meta> tags from front matter metadata.
 */
export function metaTagsFromFrontMatter(metadata: FrontMatter): string {
  const tags: string[] = [];

  if (metadata.description) {
    tags.push(`<meta name="description" content="${escapeAttrValue(metadata.description)}">`);
  }
  if (metadata.author) {
    tags.push(`<meta name="author" content="${escapeAttrValue(metadata.author)}">`);
  }
  if (metadata.date) {
    tags.push(`<meta name="date" content="${escapeAttrValue(metadata.date)}">`);
  }

  return tags.join('\n');
}

function escapeAttrValue(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}
