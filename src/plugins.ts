/**
 * Plugin system for mdpage — allows extending the markdown processing pipeline.
 */

export interface MdPagePlugin {
  name: string;
  /** Transform raw markdown before parsing */
  beforeParse?: (markdown: string) => string;
  /** Transform the rendered HTML body after parsing */
  afterParse?: (html: string) => string;
  /** Inject additional CSS into the page */
  extraCSS?: () => string;
  /** Inject additional HTML into the <head> */
  extraHead?: () => string;
}

export interface PluginContext {
  plugins: MdPagePlugin[];
}

export function createPluginContext(plugins: MdPagePlugin[] = []): PluginContext {
  return { plugins };
}

export function applyBeforeParse(ctx: PluginContext, markdown: string): string {
  return ctx.plugins.reduce(
    (md, plugin) => (plugin.beforeParse ? plugin.beforeParse(md) : md),
    markdown
  );
}

export function applyAfterParse(ctx: PluginContext, html: string): string {
  return ctx.plugins.reduce(
    (h, plugin) => (plugin.afterParse ? plugin.afterParse(h) : h),
    html
  );
}

export function collectExtraCSS(ctx: PluginContext): string {
  return ctx.plugins
    .filter((p) => p.extraCSS)
    .map((p) => p.extraCSS!())
    .join('\n');
}

export function collectExtraHead(ctx: PluginContext): string {
  return ctx.plugins
    .filter((p) => p.extraHead)
    .map((p) => p.extraHead!())
    .join('\n');
}
