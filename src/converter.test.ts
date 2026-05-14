import { convertMarkdown } from './converter';

describe('convertMarkdown', () => {
  it('produces valid HTML shell', () => {
    const { html } = convertMarkdown('# Hello\n\nWorld');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('</html>');
  });

  it('infers title from first h1 heading', () => {
    const { title } = convertMarkdown('# My Document\n\nSome text');
    expect(title).toBe('My Document');
  });

  it('uses explicit title option over inferred title', () => {
    const { title, html } = convertMarkdown('# Ignored\n\nText', { title: 'Custom Title' });
    expect(title).toBe('Custom Title');
    expect(html).toContain('<title>Custom Title</title>');
  });

  it('falls back to "Document" when no h1 present', () => {
    const { title } = convertMarkdown('Just some text without heading');
    expect(title).toBe('Document');
  });

  it('renders markdown body inside body tag', () => {
    const { html } = convertMarkdown('# Hello\n\nA **bold** word');
    expect(html).toContain('<h1>Hello</h1>');
    expect(html).toContain('<strong>bold</strong>');
  });

  it('includes light theme styles by default', () => {
    const { html } = convertMarkdown('text');
    expect(html).toContain('<style>');
    expect(html).toContain('font-family');
  });

  it('includes dark theme styles when theme is dark', () => {
    const { html } = convertMarkdown('text', { theme: 'dark' });
    expect(html).toContain('#0d1117');
  });

  it('does not include dark styles for light theme', () => {
    const { html } = convertMarkdown('text', { theme: 'light' });
    expect(html).not.toContain('#0d1117');
  });

  it('escapes special characters in title', () => {
    const { html } = convertMarkdown('text', { title: '<script>alert(1)</script>' });
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('renders code blocks with pre/code tags', () => {
    const { html } = convertMarkdown('```js\nconsole.log(1)\n```');
    expect(html).toContain('<pre>');
    expect(html).toContain('<code>');
  });
});
