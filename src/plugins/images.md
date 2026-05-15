# Image Inlining Plugin

The `images` plugin makes the HTML output truly self-contained by converting
local image references into inline base64 data URIs.

## Features

- **`inlineImages(html, sourceDir)`** — Scans all `<img src="...">` tags in the
  rendered HTML. For each `src` that points to a local file (relative to the
  original Markdown file's directory), the file is read and embedded as a
  `data:<mime>;base64,<data>` URI.
- **`addResponsiveImages(html)`** — Appends `style="max-width:100%;height:auto;"`
  to any `<img>` that does not already carry an explicit `style` or `width`
  attribute, ensuring images never overflow narrow viewports.
- **`mimeForExt(ext)`** — Helper that maps file extensions to MIME types.
  Supported: `.png`, `.jpg`/`.jpeg`, `.gif`, `.svg`, `.webp`, `.ico`.

## Supported formats

| Extension | MIME type         |
|-----------|-------------------|
| .png      | image/png         |
| .jpg      | image/jpeg        |
| .jpeg     | image/jpeg        |
| .gif      | image/gif         |
| .svg      | image/svg+xml     |
| .webp     | image/webp        |
| .ico      | image/x-icon      |

## Skipped images

Images are left untouched when:
- The `src` starts with `http://` or `https://`
- The `src` is already a `data:` URI
- The local file does not exist on disk
- The file extension is not in the supported list
