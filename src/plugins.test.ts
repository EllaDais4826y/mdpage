import {
  createPluginContext,
  applyBeforeParse,
  applyAfterParse,
  collectExtraCSS,
  collectExtraHead,
  type MdPagePlugin,
} from './plugins';

const uppercasePlugin: MdPagePlugin = {
  name: 'uppercase',
  beforeParse: (md) => md.toUpperCase(),
};

const wrapPlugin: MdPagePlugin = {
  name: 'wrap',
  afterParse: (html) => `<div class="wrap">${html}</div>`,
  extraCSS: () => '.wrap { padding: 1em; }',
  extraHead: () => '<meta name="generator" content="mdpage">',
};

describe('createPluginContext', () => {
  it('creates an empty context by default', () => {
    const ctx = createPluginContext();
    expect(ctx.plugins).toHaveLength(0);
  });

  it('stores provided plugins', () => {
    const ctx = createPluginContext([uppercasePlugin]);
    expect(ctx.plugins).toHaveLength(1);
  });
});

describe('applyBeforeParse', () => {
  it('applies beforeParse transforms in order', () => {
    const ctx = createPluginContext([uppercasePlugin]);
    expect(applyBeforeParse(ctx, 'hello')).toBe('HELLO');
  });

  it('skips plugins without beforeParse', () => {
    const ctx = createPluginContext([wrapPlugin]);
    expect(applyBeforeParse(ctx, 'hello')).toBe('hello');
  });
});

describe('applyAfterParse', () => {
  it('applies afterParse transforms', () => {
    const ctx = createPluginContext([wrapPlugin]);
    expect(applyAfterParse(ctx, '<p>hi</p>')).toBe(
      '<div class="wrap"><p>hi</p></div>'
    );
  });
});

describe('collectExtraCSS', () => {
  it('collects CSS from plugins that define extraCSS', () => {
    const ctx = createPluginContext([uppercasePlugin, wrapPlugin]);
    const css = collectExtraCSS(ctx);
    expect(css).toContain('.wrap { padding: 1em; }');
  });
});

describe('collectExtraHead', () => {
  it('collects head snippets from plugins', () => {
    const ctx = createPluginContext([wrapPlugin]);
    expect(collectExtraHead(ctx)).toContain('meta name="generator"');
  });
});
