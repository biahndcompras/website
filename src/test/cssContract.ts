import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface CssRule {
  selectors: string[];
  declarations: Record<string, string>;
  conditions: string[];
}

/** Reads a workspace file relative to the project root. */
export function readSource(relativePath: string): string {
  const file = resolve(process.cwd(), relativePath);

  return existsSync(file) ? readFileSync(file, 'utf8') : '';
}

/** Minimal flat-CSS reader: enough to assert a layout contract without a DOM. */
export function parseCss(source: string): CssRule[] {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules: CssRule[] = [];
  const conditions: string[] = [];
  let prelude = '';
  let cursor = 0;

  const blockEnd = (open: number): number => {
    let depth = 0;

    for (let index = open; index < css.length; index += 1) {
      if (css[index] === '{') depth += 1;
      if (css[index] === '}') {
        depth -= 1;
        if (depth === 0) return index;
      }
    }

    return css.length;
  };

  while (cursor < css.length) {
    const char = css[cursor];

    if (char === '{') {
      const close = blockEnd(cursor);
      const body = css.slice(cursor + 1, close);
      const header = prelude.trim();

      if (header.startsWith('@')) {
        conditions.push(header);
        // The at-rule prelude is consumed with the opening brace; a rule inside
        // the block must not inherit it as part of its own selector.
        prelude = '';
        cursor += 1;
      } else {
        if (!body.includes('{')) {
          rules.push({
            selectors: header
              .split(',')
              .map((part) => part.trim())
              .filter(Boolean),
            declarations: Object.fromEntries(
              body
                .split(';')
                .map((declaration) => declaration.trim())
                .filter(Boolean)
                .map((declaration) => {
                  const separator = declaration.indexOf(':');

                  return [
                    declaration.slice(0, separator).trim(),
                    declaration.slice(separator + 1).trim(),
                  ];
                }),
            ),
            conditions: [...conditions],
          });
        }
        prelude = '';
        cursor = close + 1;
      }
      continue;
    }

    if (char === '}') {
      conditions.pop();
      prelude = '';
      cursor += 1;
      continue;
    }

    if (char === ';') {
      prelude = '';
      cursor += 1;
      continue;
    }

    prelude += char;
    cursor += 1;
  }

  return rules;
}

/** Splits a track list on top-level whitespace, keeping `minmax(...)` intact. */
export function splitTracks(value: string): string[] {
  const tracks: string[] = [];
  let depth = 0;
  let current = '';

  for (const char of value.trim()) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (/\s/.test(char) && depth === 0) {
      if (current) tracks.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  if (current) tracks.push(current);

  return tracks;
}

/** Indexes the parsed stylesheet for a single selector. */
export class CssContract {
  private readonly rules: CssRule[];

  constructor(source: string) {
    this.rules = parseCss(source);
  }

  rulesFor(selector: string): CssRule[] {
    return this.rules.filter((rule) => rule.selectors.includes(selector));
  }

  /** Every rule that targets at least one selector starting with `prefix`. */
  rulesWithPrefix(prefix: string): CssRule[] {
    return this.rules.filter((rule) =>
      rule.selectors.some((selector) => selector.startsWith(prefix)),
    );
  }

  /** Merges every declaration for a selector, optionally filtered by at-rule. */
  declarationsFor(selector: string, condition?: RegExp): Record<string, string> {
    return Object.assign(
      {},
      ...this.rulesFor(selector)
        .filter((rule) => (condition ? condition.test(rule.conditions.join(' ')) : true))
        .map((rule) => rule.declarations),
    );
  }
}

/**
 * Guards the project-wide overflow invariant: no rule may size a box with a
 * viewport unit that ignores the scrollbar gutter.
 */
export function viewportWidthDeclarations(css: CssContract, prefix = '.secondary-'): string[] {
  return css
    .rulesWithPrefix(prefix)
    .flatMap((rule) => Object.entries(rule.declarations))
    .filter(
      ([property, value]) =>
        /(^|-)width$/.test(property) && /(^|[^%\w])\d*\.?\d+vw\b/.test(value),
    )
    .map(([property, value]) => `${property}: ${value}`);
}
