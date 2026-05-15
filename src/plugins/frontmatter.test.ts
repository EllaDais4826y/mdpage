import { parseFrontMatter, metaTagsFromFrontMatter } from './frontmatter';

describe('parseFrontMatter', () => {
  it('returns original content unchanged when no front matter present', () => {
    const input = '# Hello\n\nSome text.';
    const result = parseFrontMatter(input);
    expect(result.metadata).toEqual({});
    expect(result.content).toBe(input);
  });

  it('strips front matter block from content', () => {
    const input = '---\ntitle: My Page\n---\n# Hello';
    const result = parseFrontMatter(input);
    expect(result.content).toBe('# Hello');
  });

  it('parses title from front matter', () => {
    const input = '---\ntitle: My Awesome Page\n---\nContent here.';
    const result = parseFrontMatter(input);
    expect(result.metadata.title).toBe('My Awesome Page');
  });

  it('parses multiple fields', () => {
    const input = '---\ntitle: Test\nauthor: Alice\ndate: 2024-01-15\ndescription: A test page\n---\nBody.';
    const result = parseFrontMatter(input);
    expect(result.metadata.title).toBe('Test');
    expect(result.metadata.author).toBe('Alice');
    expect(result.metadata.date).toBe('2024-01-15');
    expect(result.metadata.description).toBe('A test page');
    expect(result.content).toBe('Body.');
  });

  it('strips surrounding quotes from values', () => {
    const input = '---\ntitle: "Quoted Title"\nauthor: \'Bob\'\n---\n';
    const result = parseFrontMatter(input);
    expect(result.metadata.title).toBe('Quoted Title');
    expect(result.metadata.author).toBe('Bob');
  });

  it('handles Windows-style line endings', () => {
    const input = '---\r\ntitle: Win Page\r\n---\r\nContent.';
    const result = parseFrontMatter(input);
    expect(result.metadata.title).toBe('Win Page');
    expect(result.content).toBe('Content.');
  });
});

describe('metaTagsFromFrontMatter', () => {
  it('returns empty string when no relevant metadata', () => {
    expect(metaTagsFromFrontMatter({})).toBe('');
    expect(metaTagsFromFrontMatter({ title: 'Only Title' })).toBe('');
  });

  it('generates description meta tag', () => {
    const result = metaTagsFromFrontMatter({ description: 'Hello world' });
    expect(result).toContain('<meta name="description" content="Hello world">');
  });

  it('generates author and date meta tags', () => {
    const result = metaTagsFromFrontMatter({ author: 'Alice', date: '2024-01-01' });
    expect(result).toContain('<meta name="author" content="Alice">');
    expect(result).toContain('<meta name="date" content="2024-01-01">');
  });

  it('escapes special characters in attribute values', () => {
    const result = metaTagsFromFrontMatter({ description: 'A & B "quoted"' });
    expect(result).toContain('A &amp; B &quot;quoted&quot;');
  });
});
