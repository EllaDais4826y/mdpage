import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { inlineImages, addResponsiveImages, mimeForExt } from "./images";

describe("mimeForExt", () => {
  it("returns correct mime for known extensions", () => {
    expect(mimeForExt(".png")).toBe("image/png");
    expect(mimeForExt(".jpg")).toBe("image/jpeg");
    expect(mimeForExt(".svg")).toBe("image/svg+xml");
  });

  it("returns undefined for unknown extensions", () => {
    expect(mimeForExt(".bmp")).toBeUndefined();
    expect(mimeForExt(".tiff")).toBeUndefined();
  });

  it("is case-insensitive", () => {
    expect(mimeForExt(".PNG")).toBe("image/png");
    expect(mimeForExt(".JPG")).toBe("image/jpeg");
  });
});

describe("inlineImages", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "mdpage-img-"));
    // Create a tiny 1x1 PNG (minimal valid PNG bytes)
    const minimalPng = Buffer.from(
      "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489000000" +
      "0a49444154789c6260000000020001e221bc330000000049454e44ae426082",
      "hex"
    );
    fs.writeFileSync(path.join(tmpDir, "test.png"), minimalPng);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("inlines a local image as a data URI", () => {
    const html = `<img src="test.png" alt="test">`;
    const result = inlineImages(html, tmpDir);
    expect(result).toContain("data:image/png;base64,");
    expect(result).toContain('alt="test"');
  });

  it("leaves remote URLs unchanged", () => {
    const html = `<img src="https://example.com/img.png">`;
    const result = inlineImages(html, tmpDir);
    expect(result).toBe(html);
  });

  it("leaves data URIs unchanged", () => {
    const html = `<img src="data:image/png;base64,abc">`;
    const result = inlineImages(html, tmpDir);
    expect(result).toBe(html);
  });

  it("leaves missing local files unchanged", () => {
    const html = `<img src="missing.png">`;
    const result = inlineImages(html, tmpDir);
    expect(result).toBe(html);
  });
});

describe("addResponsiveImages", () => {
  it("adds responsive style to plain img tags", () => {
    const html = `<img src="a.png" alt="x">`;
    const result = addResponsiveImages(html);
    expect(result).toContain("max-width:100%");
  });

  it("does not override existing style", () => {
    const html = `<img src="a.png" style="width:50px">`;
    const result = addResponsiveImages(html);
    expect(result).not.toContain("max-width");
  });

  it("does not override explicit width attribute", () => {
    const html = `<img src="a.png" width="200">`;
    const result = addResponsiveImages(html);
    expect(result).not.toContain("max-width");
  });
});
