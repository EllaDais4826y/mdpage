import { marked } from 'marked';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export interface ConvertOptions {
  title?: string;
  theme?: 'light' | 'dark';
}

export interface ConvertResult {
  html: string;
  title: string;
}

const CSS = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    max-width: 800px; margin: 0 auto; padding: 2rem;
    line-height: 1.6; color: #24292e; background: #fff; }
  h1,h2,h3,h4,h5,h6 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 600; }
  a { color: #0366d6; text-decoration: none; }
  a:hover { text-decoration: underline; }
  code { background: #f6f8fa; padding: 0.2em 0.4em; border-radius: 3px;
    font-family: 'SFMono-Regular', Consolas, monospace; font-size: 0.9em; }
  pre { background: #f6f8fa; padding: 1rem; border-radius: 6px; overflow-x: auto; }
  pre code { background: none; padding: 0; }
  blockquote { border-left: 4px solid #dfe2e5; margin: 0; padding: 0 1em; color: #6a737d; }
  img { max-width: 100%; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #dfe2e5; padding: 0.5rem 1rem; }
  th { background: #f6f8fa; }
  hr { border: none; border-top: 1px solid #e1e4e8; }
`;

const DARK_CSS = `
  body { color: #c9d1d9; background: #0d1117; }
  code, pre { background: #161b22; }
  blockquote { border-color: #30363d; color: #8b949e; }
  a { color: #58a6ff; }
  th { background: #161b22; }
  th, td { border-color: #30363d; }
  hr { border-color: #21262d; }
`;

export function convertMarkdown(input: string, options: ConvertOptions = {}): ConvertResult {
  const { theme = 'light' } = options;

  const bodyHtml = marked.parse(input) as string;

  const titleMatch = input.match(/^#\s+(.+)$/m);
  const title = options.title ?? (titleMatch ? titleMatch[1].trim() : 'Document');

  const themeCss = theme === 'dark' ? CSS + DARK_CSS : CSS;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>${themeCss}</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

  return { html, title };
}

export function convertFile(filePath: string, options: ConvertOptions = {}): ConvertResult {
  const content = readFileSync(resolve(filePath), 'utf-8');
  return convertMarkdown(content, options);
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
