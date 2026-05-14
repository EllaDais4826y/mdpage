# mdpage

Convert a single Markdown file into a self-contained, styled static HTML page with zero dependencies.

---

## Installation

```bash
npm install -g mdpage
```

## Usage

```bash
mdpage input.md -o output.html
```

This will generate a fully self-contained `output.html` file — styles and all assets are inlined, no external requests required.

### Options

| Flag | Description |
|------|-------------|
| `-o, --output <file>` | Output file path (default: `index.html`) |
| `--title <title>` | Set the page `<title>` tag |
| `--theme <name>` | Choose a built-in theme: `light` (default), `dark` |

### Example

```bash
mdpage README.md -o docs/index.html --title "My Project" --theme dark
```

### Programmatic Usage

```typescript
import { mdpage } from "mdpage";

const html = await mdpage("# Hello World\n\nThis is a paragraph.");
console.log(html); // Full HTML string, ready to save
```

## Why mdpage?

- ✅ Zero runtime dependencies
- ✅ Single-file output — just open in a browser
- ✅ Clean, readable default styles
- ✅ Works offline

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](./LICENSE)