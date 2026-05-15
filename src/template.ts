import { buildCSS, ThemeOptions } from "./theme";

export interface TemplateOptions {
  title?: string;
  description?: string;
  lang?: string;
  theme?: ThemeOptions;
}

export function renderHTML(
  bodyContent: string,
  options: TemplateOptions = {}
): string {
  const { title = "Document", description = "", lang = "en", theme = {} } = options;
  const css = buildCSS(theme);
  const metaDescription = description
    ? `<meta name="description" content="${escapeAttr(description)}">\n    `
    : "";

  return `<!DOCTYPE html>
<html lang="${escapeAttr(lang)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${metaDescription}<title>${escapeHtml(title)}</title>
  <style>
${indent(css, 4)}
  </style>
</head>
<body>
  <div class="content">
${indent(bodyContent, 4)}
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(str: string): string {
  return str.replace(/"/g, "&quot;").replace(/&/g, "&amp;");
}

function indent(str: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return str
    .split("\n")
    .map((line) => (line.trim() === "" ? "" : pad + line))
    .join("\n");
}
