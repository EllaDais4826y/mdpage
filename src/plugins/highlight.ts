/**
 * Built-in plugin: wraps fenced code blocks with a language class for
 * syntax highlighting via a minimal inline CSS approach (no external deps).
 */

import type { MdPagePlugin } from '../plugins';

const HIGHLIGHT_CSS = `
pre code[class^="language-"] {
  display: block;
  overflow-x: auto;
  padding: 0;
}
pre {
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 6px;
  padding: 1em 1.2em;
  overflow-x: auto;
  font-size: 0.9em;
  line-height: 1.6;
}
`;

/**
 * Adds a `data-lang` attribute to <pre> elements that contain a language class,
 * enabling CSS-based language badges via ::before pseudo-elements.
 */
function addLanguageBadges(html: string): string {
  return html.replace(
    /<pre><code class="language-([a-zA-Z0-9_+-]+)">/g,
    (_match, lang: string) =>
      `<pre data-lang="${lang}"><code class="language-${lang}">`
  );
}

export const highlightPlugin: MdPagePlugin = {
  name: 'highlight',
  afterParse: addLanguageBadges,
  extraCSS: () => HIGHLIGHT_CSS,
};
