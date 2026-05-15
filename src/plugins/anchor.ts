/**
 * anchor.ts — Adds anchor links to headings in the rendered HTML.
 * Each heading gets a permalink icon that appears on hover.
 */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Injects anchor links into heading tags (h1–h6) in raw HTML.
 * Adds an `id` attribute and a child `<a>` permalink element.
 */
export function addHeadingAnchors(html: string): string {
  const seenSlugs = new Map<string, number>();

  return html.replace(
    /<(h[1-6])([^>]*)>(.*?)<\/\1>/gis,
    (_match, tag: string, attrs: string, inner: string) => {
      const textContent = inner.replace(/<[^>]+>/g, '');
      const baseSlug = slugify(textContent);

      if (!baseSlug) return _match;

      const count = seenSlugs.get(baseSlug) ?? 0;
      const slug = count === 0 ? baseSlug : `${baseSlug}-${count}`;
      seenSlugs.set(baseSlug, count + 1);

      // Don't add id if one already exists
      const hasId = /\bid=/i.test(attrs);
      const idAttr = hasId ? '' : ` id="${slug}"`;
      const anchor = `<a class="heading-anchor" href="#${slug}" aria-label="Permalink to &quot;${textContent}&quot;" tabindex="-1">#</a>`;

      return `<${tag}${attrs}${idAttr}>${inner}${anchor}</${tag}>`;
    }
  );
}

/**
 * CSS styles for heading anchors. Injected via plugin extra CSS.
 */
export const anchorCSS = `
.heading-anchor {
  margin-left: 0.4em;
  opacity: 0;
  text-decoration: none;
  color: inherit;
  font-weight: normal;
  transition: opacity 0.15s ease;
  user-select: none;
}
h1:hover .heading-anchor,
h2:hover .heading-anchor,
h3:hover .heading-anchor,
h4:hover .heading-anchor,
h5:hover .heading-anchor,
h6:hover .heading-anchor {
  opacity: 0.5;
}
.heading-anchor:hover {
  opacity: 1 !important;
}
`.trim();
