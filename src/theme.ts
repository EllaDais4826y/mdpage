export interface ThemeOptions {
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
  maxWidth?: string;
  backgroundColor?: string;
  textColor?: string;
  linkColor?: string;
  codeBackground?: string;
  codeFontFamily?: string;
}

export const DEFAULT_THEME: ThemeOptions = {
  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  fontSize: "16px",
  lineHeight: "1.7",
  maxWidth: "800px",
  backgroundColor: "#ffffff",
  textColor: "#1a1a1a",
  linkColor: "#0066cc",
  codeBackground: "#f4f4f4",
  codeFontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
};

export function buildCSS(theme: ThemeOptions = {}): string {
  const t = { ...DEFAULT_THEME, ...theme };
  return `
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: ${t.fontFamily};
      font-size: ${t.fontSize};
      line-height: ${t.lineHeight};
      color: ${t.textColor};
      background-color: ${t.backgroundColor};
      margin: 0;
      padding: 2rem 1rem;
    }
    .content {
      max-width: ${t.maxWidth};
      margin: 0 auto;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 2rem;
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }
    h1 { font-size: 2em; border-bottom: 2px solid #e0e0e0; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.2em; }
    a { color: ${t.linkColor}; text-decoration: none; }
    a:hover { text-decoration: underline; }
    code {
      font-family: ${t.codeFontFamily};
      background: ${t.codeBackground};
      padding: 0.15em 0.4em;
      border-radius: 3px;
      font-size: 0.9em;
    }
    pre {
      background: ${t.codeBackground};
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 1rem;
      overflow-x: auto;
    }
    pre code { background: none; padding: 0; font-size: 0.875em; }
    blockquote {
      border-left: 4px solid #ccc;
      margin: 1rem 0;
      padding: 0.5rem 1rem;
      color: #555;
    }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #ddd; padding: 0.5rem 0.75rem; text-align: left; }
    th { background: ${t.codeBackground}; font-weight: 600; }
    img { max-width: 100%; height: auto; }
    hr { border: none; border-top: 1px solid #e0e0e0; margin: 2rem 0; }
  `.trim();
}
