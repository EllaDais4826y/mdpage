import { describe, it, expect } from 'vitest';
import { slugify, addHeadingAnchors, anchorCSS } from './anchor';

describe('slugify', () => {
  it('lowercases and trims text', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('Getting Started')).toBe('getting-started');
  });

  it('removes special characters', () => {
    expect(slugify('What is mdpage?')).toBe('what-is-mdpage');
  });

  it('collapses multiple spaces/underscores', () => {
    expect(slugify('foo  bar__baz')).toBe('foo-bar-baz');
  });

  it('returns empty string for blank input', () => {
    expect(slugify('   ')).toBe('');
  });
});

describe('addHeadingAnchors', () => {
  it('adds id and anchor link to h1', () => {
    const input = '<h1>Hello World</h1>';
    const result = addHeadingAnchors(input);
    expect(result).toContain('id="hello-world"');
    expect(result).toContain('href="#hello-world"');
    expect(result).toContain('class="heading-anchor"');
  });

  it('handles h2 through h6', () => {
    for (const level of [2, 3, 4, 5, 6]) {
      const input = `<h${level}>Section</h${level}>`;
      const result = addHeadingAnchors(input);
      expect(result).toContain(`id="section"`);
    }
  });

  it('deduplicates duplicate heading slugs', () => {
    const input = '<h2>Intro</h2><h2>Intro</h2>';
    const result = addHeadingAnchors(input);
    expect(result).toContain('id="intro"');
    expect(result).toContain('id="intro-1"');
  });

  it('does not overwrite existing id attribute', () => {
    const input = '<h3 id="custom-id">Title</h3>';
    const result = addHeadingAnchors(input);
    expect(result).toContain('id="custom-id"');
    expect((result.match(/id=/g) ?? []).length).toBe(1);
  });

  it('leaves non-heading tags unchanged', () => {
    const input = '<p>Just a paragraph</p>';
    expect(addHeadingAnchors(input)).toBe(input);
  });

  it('exports non-empty anchorCSS', () => {
    expect(anchorCSS.length).toBeGreaterThan(0);
    expect(anchorCSS).toContain('.heading-anchor');
  });
});
