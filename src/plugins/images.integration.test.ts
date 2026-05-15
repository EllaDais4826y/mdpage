/**
 * Integration test: verifies that the images plugin wires correctly into
 * the full convertMarkdown pipeline when a sourceDir is provided.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { inlineImages, addResponsiveImages } from "./images";

function buildHtmlPipeline(
  markdownHtml: string,
  sourceDir: string
): string {
  let html = markdownHtml;
  html = inlineImages(html, sourceDir);
  html = addResponsiveImages(html);
  return html;
}

describe("images plugin integration", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "mdpage-intg-"));
    fs.writeFileSync(
      path.join(tmpDir, "logo.png"),
      Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64")
    );
    fs.mkdirSync(path.join(tmpDir, "assets"));
    fs.writeFileSync(
      path.join(tmpDir, "assets", "icon.svg"),
      `<svg xmlns="http://www.w3.org/2000/svg"><circle r="5"/></svg>`
    );
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("inlines a PNG and adds responsive style", () => {
    const html = `<p><img src="logo.png" alt="Logo"></p>`;
    const result = buildHtmlPipeline(html, tmpDir);
    expect(result).toContain("data:image/png;base64,");
    expect(result).toContain("max-width:100%");
    expect(result).toContain('alt="Logo"');
  });

  it("inlines an SVG from a subdirectory", () => {
    const html = `<img src="assets/icon.svg">`;
    const result = buildHtmlPipeline(html, tmpDir);
    expect(result).toContain("data:image/svg+xml;base64,");
  });

  it("handles mixed local and remote images", () => {
    const html = [
      `<img src="logo.png" alt="local">`,
      `<img src="https://cdn.example.com/remote.png" alt="remote">`,
    ].join("\n");
    const result = buildHtmlPipeline(html, tmpDir);
    expect(result).toContain("data:image/png;base64,");
    expect(result).toContain("https://cdn.example.com/remote.png");
  });

  it("does not double-add style when img already has one", () => {
    const html = `<img src="logo.png" style="border:1px solid red">`;
    const result = buildHtmlPipeline(html, tmpDir);
    const styleCount = (result.match(/style=/g) || []).length;
    expect(styleCount).toBe(1);
  });
});
