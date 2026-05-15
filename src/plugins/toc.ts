/**
 * Built-in plugin: generates a Table of Contents from heading elements
 * and prepends it to the HTML body.
 */

import type { MdPagePlugin } from '../plugins';

interface TocEntry {
  level: number;
  id: string;
  text: string;
}

function extractHeadings(html: string): TocEntry[] {
  const headingRe = /<h([2-4])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h\1>/gi;
  const entries: TocEntry[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRe.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const id = match[2];
    const text = match[3].replace(/<[^>]+>/g, '');
    entries.push({ level, id, text });
  }
  return entries;
}

function buildTocHtml(entries: TocEntry[]): string {
  if (entries.length === 0) return '';
  const items = entries
    .map(
      (e) =>
        `${'  '.repeat(e.level - 2)}<li><a href="#${e.id}">${e.text}</a></li>`
    )
    .join('\n');
  return `<nav class="toc">\n<ul>\n${items}\n</ul>\n</nav>\n`;
}

const TOC_CSS = `
nav.toc {
  background: #f8f9fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 1em 1.5em;
  margin-bottom: 2em;
  font-size: 0.9em;
}
nav.toc ul { margin: 0; padding-left: 1.2em; }
nav.toc a { color: #0366d6; text-decoration: none; }
nav.toc a:hover { text-decoration: underline; }
`;

export const tocPlugin: MdPagePlugin = {
  name: 'toc',
  afterParse(html: string): string {
    const entries = extractHeadings(html);
    const toc = buildTocHtml(entries);
    return toc ? toc + html : html;
  },
  extraCSS: () => TOC_CSS,
};
