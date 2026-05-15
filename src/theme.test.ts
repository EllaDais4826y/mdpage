import { buildCSS, DEFAULT_THEME, ThemeOptions } from "./theme";

describe("buildCSS", () => {
  it("returns a non-empty CSS string with default theme", () => {
    const css = buildCSS();
    expect(typeof css).toBe("string");
    expect(css.length).toBeGreaterThan(0);
  });

  it("includes default font-family in output", () => {
    const css = buildCSS();
    expect(css).toContain(DEFAULT_THEME.fontFamily);
  });

  it("includes default max-width in output", () => {
    const css = buildCSS();
    expect(css).toContain(DEFAULT_THEME.maxWidth);
  });

  it("applies custom textColor override", () => {
    const custom: ThemeOptions = { textColor: "#333333" };
    const css = buildCSS(custom);
    expect(css).toContain("#333333");
    expect(css).not.toContain(DEFAULT_THEME.textColor);
  });

  it("applies custom linkColor override", () => {
    const custom: ThemeOptions = { linkColor: "#ff6600" };
    const css = buildCSS(custom);
    expect(css).toContain("#ff6600");
  });

  it("applies custom maxWidth override", () => {
    const custom: ThemeOptions = { maxWidth: "960px" };
    const css = buildCSS(custom);
    expect(css).toContain("960px");
    expect(css).not.toContain(DEFAULT_THEME.maxWidth);
  });

  it("merges partial overrides with defaults", () => {
    const custom: ThemeOptions = { fontSize: "18px" };
    const css = buildCSS(custom);
    expect(css).toContain("18px");
    expect(css).toContain(DEFAULT_THEME.fontFamily);
    expect(css).toContain(DEFAULT_THEME.backgroundColor);
  });

  it("produces valid CSS structure with body selector", () => {
    const css = buildCSS();
    expect(css).toContain("body {");
    expect(css).toContain(".content {");
    expect(css).toContain("pre {");
  });
});
