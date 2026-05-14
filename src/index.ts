#!/usr/bin/env node

/**
 * mdpage - Entry point
 * Converts a single Markdown file into a self-contained, styled static HTML page.
 */

import { parseArgs } from './cli';
import { convertFile } from './converter';
import * as fs from 'fs';
import * as path from 'path';

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  // Help and version flags are handled inside parseArgs and exit early
  if (!args.input) {
    console.error('Error: No input file specified.');
    console.error('Usage: mdpage <input.md> [options]');
    console.error('Run `mdpage --help` for more information.');
    process.exit(1);
  }

  const inputPath = path.resolve(args.input);

  // Verify the input file exists
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  // Verify the input file has a .md or .markdown extension
  const ext = path.extname(inputPath).toLowerCase();
  if (ext !== '.md' && ext !== '.markdown') {
    console.warn(`Warning: Input file does not have a .md or .markdown extension: ${inputPath}`);
  }

  // Determine output path
  let outputPath: string;
  if (args.output) {
    outputPath = path.resolve(args.output);
  } else {
    // Default: same directory and name as input, but with .html extension
    const baseName = path.basename(inputPath, ext);
    outputPath = path.join(path.dirname(inputPath), `${baseName}.html`);
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    try {
      fs.mkdirSync(outputDir, { recursive: true });
    } catch (err) {
      console.error(`Error: Could not create output directory: ${outputDir}`);
      console.error((err as Error).message);
      process.exit(1);
    }
  }

  try {
    const html = await convertFile(inputPath, {
      title: args.title,
      theme: args.theme,
    });

    fs.writeFileSync(outputPath, html, 'utf-8');

    if (!args.quiet) {
      console.log(`✓ Converted: ${path.relative(process.cwd(), inputPath)}`);
      console.log(`  Output:    ${path.relative(process.cwd(), outputPath)}`);
    }
  } catch (err) {
    console.error(`Error: Failed to convert file: ${inputPath}`);
    console.error((err as Error).message);
    process.exit(1);
  }
}

main();
