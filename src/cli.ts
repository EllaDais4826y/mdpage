#!/usr/bin/env node
/**
 * CLI entry point for mdpage.
 * Parses command-line arguments and invokes the markdown-to-HTML converter.
 */

import * as path from 'path';
import * as fs from 'fs';
import { convertFile } from './converter';

const VERSION = '1.0.0';

function printHelp(): void {
  console.log(`
mdpage v${VERSION} — Convert a Markdown file into a self-contained HTML page

Usage:
  mdpage <input.md> [options]

Options:
  -o, --output <file>   Output HTML file (default: same name as input with .html)
  -t, --title <title>   Page title (default: derived from filename)
  --no-toc              Disable table of contents generation
  -h, --help            Show this help message
  -v, --version         Show version number

Examples:
  mdpage README.md
  mdpage docs/guide.md -o public/guide.html
  mdpage notes.md --title "My Notes"
`);
}

function printVersion(): void {
  console.log(`mdpage v${VERSION}`);
}

interface CliOptions {
  input: string;
  output: string;
  title?: string;
  toc: boolean;
}

function parseArgs(argv: string[]): CliOptions | null {
  const args = argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    printHelp();
    return null;
  }

  if (args.includes('-v') || args.includes('--version')) {
    printVersion();
    return null;
  }

  const input = args[0];
  if (!input || input.startsWith('-')) {
    console.error('Error: No input file specified.');
    printHelp();
    process.exit(1);
  }

  let output: string | undefined;
  let title: string | undefined;
  let toc = true;

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if ((arg === '-o' || arg === '--output') && args[i + 1]) {
      output = args[++i];
    } else if ((arg === '-t' || arg === '--title') && args[i + 1]) {
      title = args[++i];
    } else if (arg === '--no-toc') {
      toc = false;
    } else {
      console.error(`Error: Unknown option "${arg}"`);
      process.exit(1);
    }
  }

  // Default output: same path as input but with .html extension
  if (!output) {
    const parsed = path.parse(input);
    output = path.join(parsed.dir, `${parsed.name}.html`);
  }

  // Default title: capitalize the filename stem
  if (!title) {
    const stem = path.parse(input).name;
    title = stem.charAt(0).toUpperCase() + stem.slice(1).replace(/[-_]/g, ' ');
  }

  return { input, output, title, toc };
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv);
  if (!options) return;

  const { input, output, title, toc } = options;

  if (!fs.existsSync(input)) {
    console.error(`Error: Input file not found: "${input}"`);
    process.exit(1);
  }

  try {
    await convertFile(input, output, { title, toc });
    console.log(`✓ Converted "${input}" → "${output}"`);
  } catch (err) {
    console.error(`Error during conversion: ${(err as Error).message}`);
    process.exit(1);
  }
}

main();
