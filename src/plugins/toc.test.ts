import { tocPlugin } from './toc';

const sampleHtml = `
<h1>Title</h1>
<h2 id="intro">Introduction</h2>
<p>Some text.</p>
<h3 id="details">Details</h3>
<p>More text.</p>
<h2 id="conclusion">Conclusion</h2>
`.trim();

describe('tocPlugin', () => {
  it('has the correct name', () => {
    expect(tocPlugin.name).toBe('toc');
  });

  it('prepends a nav.toc element', () => {
    const result = tocPlugin.afterParse!(sampleHtml);
    expect(result).toMatch(/^<nav class="toc">/);
  });

  it('includes links to h2 and h3 headings', () => {
    const result = tocPlugin.afterParse!(sampleHtml);
    expect(result).toContain('<a href="#intro">Introduction</a>');
    expect(result).toContain('<a href="#details">Details</a>');
    expect(result).toContain('<a href="#conclusion">Conclusion</a>');
  });

  it('does not include h1 in the TOC', () => {
    const result = tocPlugin.afterParse!(sampleHtml);
    expect(result).not.toContain('href="#title"');
  });

  it('strips inline tags from heading text', () => {
    const html = '<h2 id="sec"><strong>Bold</strong> heading</h2>';
    const result = tocPlugin.afterParse!(html);
    expect(result).toContain('Bold heading');
  });

  it('returns html unchanged when no headings found', () => {
    const plain = '<p>No headings here.</p>';
    expect(tocPlugin.afterParse!(plain)).toBe(plain);
  });

  it('provides extraCSS', () => {
    const css = tocPlugin.extraCSS!();
    expect(css).toContain('nav.toc');
  });
});
