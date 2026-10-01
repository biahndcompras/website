import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/*
 * Guards the brand palette contract.
 *
 * The palette lives entirely in src/index.css and nothing in the TypeScript
 * tree references it, so `tsc` cannot see a mistake here and no component test
 * fails either. That is not hypothetical: a bulk rename once collapsed
 * --bia-blue, --bia-blue-light and --bia-blue-deep into --bia-blue-deep, which
 * left --bia-blue undefined. Every `var(--bia-blue)` in the stylesheet then
 * became an invalid declaration that silently fell back to the inherited value
 * on 50 rules, while 151 tests and `tsc --noEmit` stayed green. Only a browser
 * contrast pass caught it.
 *
 * So the invariant is asserted here against the real stylesheet, the same way
 * SecondaryPageShell.test.ts asserts layout against the real CSS.
 */

const css = readFileSync('src/index.css', 'utf8');
const logo = readFileSync('src/components/layout/BiaLogo.tsx', 'utf8');

const declared = new Set(
  [...css.matchAll(/^\s*(--bia-[a-z-]+)\s*:/gm)].map((match) => match[1]),
);
const referenced = new Set(
  [...css.matchAll(/var\((--bia-[a-z-]+)/g)].map((match) => match[1]),
);

/** Reads a token's value out of the :root block. */
const tokenValue = (name: string): string | undefined => {
  const match = new RegExp(`^\\s*${name}:\\s*([^;]+);`, 'm').exec(css);
  return match?.[1].trim();
};

/** Relative luminance of a hex colour, with or without a leading '#'. */
const luminance = (hex: string): number => {
  const digits = hex.replace('#', '');
  const channel = (offset: number) => {
    const s = parseInt(digits.slice(offset, offset + 2), 16) / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
};

/** WCAG contrast ratio between two hex colours. */
const contrast = (a: string, b: string): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe('palette tokens', () => {
  it('declares every --bia-* custom property that the stylesheet references', () => {
    const undefinedRefs = [...referenced].filter((name) => !declared.has(name));
    expect(undefinedRefs).toEqual([]);
  });

  it('declares every --bia-* custom property under a unique name', () => {
    // A rename that collapses two names into one is what broke the palette, and
    // the result is still a "declared" property -- just under the wrong name.
    const declarations = [...css.matchAll(/^\s*(--bia-[a-z-]+)\s*:/gm)].map((m) => m[1]);
    const duplicates = declarations.filter(
      (name, index) => declarations.indexOf(name) !== index,
    );
    expect(duplicates).toEqual([]);
  });

  it('keeps the brand blue and navy at the values taken from the official logo', () => {
    expect(tokenValue('--bia-blue')).toBe('#4a88fa');
    expect(tokenValue('--bia-navy')).toBe('#1c3565');
  });

  it('splits the brand blue into the three roles the contrast budget requires', () => {
    // #4A88FA cannot carry 4.5:1 text against mist, white or navy, so small
    // text needs one of the two siblings. Removing either would silently push
    // small text below AA.
    expect(tokenValue('--bia-blue-light')).toBe('#6fa6fd');
    expect(tokenValue('--bia-blue-deep')).toBe('#2a63c4');
  });

  it('uses a focus colour that clears 3:1 against both light and dark surfaces', () => {
    const focus = tokenValue('--bia-focus');
    expect(focus).toBe('#4480ee');

    // The focus ring lands on light and dark sections alike, so one value has to
    // clear 3:1 on every surface family rather than only the light ones. These
    // four are the whole set; adding a mid-luminance panel would break the
    // premise, because no single colour can sit 3:1 away from both mist
    // (L 0.874) and a mid surface (L ~0.13) at the same time.
    for (const surface of ['#e9f1fe', '#f4f8fe', '#1c3565', '#16294a']) {
      expect(contrast(focus!, surface)).toBeGreaterThanOrEqual(3);
    }
  });

  it('keeps a focus token that clears 3:1 on every solid background in the site', () => {
    // There is no single focus colour that can serve everything: the light and
    // dark surfaces are too far apart in luminance for one value to sit 3:1
    // from both, so each solid background family must have SOME token that
    // works on it. This asserts the pairing exists rather than pretending one
    // token covers the whole site.
    const focus = tokenValue('--bia-focus')!;
    const focusOnBlue = tokenValue('--bia-focus-on-blue')!;

    // The light/dark families the global ring is built for.
    for (const surface of ['#e9f1fe', '#f4f8fe', '#1c3565', '#16294a']) {
      expect(contrast(focus, surface)).toBeGreaterThanOrEqual(3);
    }
    // The one solid blue-deep panel (.home-talent) opts into the pale token.
    expect(contrast(focusOnBlue, tokenValue('--bia-blue-deep')!)).toBeGreaterThanOrEqual(3);
    // And it must be a real fallback: the global token genuinely cannot do it.
    expect(contrast(focus, tokenValue('--bia-blue-deep')!)).toBeLessThan(3);
  });

  it('makes the brand blue unusable for text in every ink the site uses', () => {
    // The real invariant, and a property of the colour rather than of any one
    // rule. #4A88FA sits at L 0.2597. Near-black would clear 4.5:1 against it
    // (6.19:1), but the site has no black ink and none of its actual inks come
    // close: mist 3.39:1, navy 3.55:1, slate 2.18:1. So --bia-blue is legal for
    // rules, borders, dots and decorative fills, but never behind a line of
    // text -- which is why every text-bearing fill resolves to blue-deep.
    const blue = tokenValue('--bia-blue')!;
    for (const ink of ['#e9f1fe', '#f4f8fe', '#1c3565', '#16294a', '#566878', '#ffffff']) {
      expect(contrast(blue, ink)).toBeLessThan(4.5);
    }
    // ...while it still clears the 3:1 bar for graphics and large text.
    expect(contrast(blue, '#ffffff')).toBeGreaterThanOrEqual(3);
  });

  it('paints every text-bearing surface with a colour that can carry 4.5:1 text', () => {
    // Each of these sits directly behind small text (0.6-0.7rem), so each must
    // resolve to a surface with enough headroom. This is the list that broke
    // when the copper band and the blue buttons were mapped onto the brand blue.
    const textBearingSurfaces = [
      '.site-header__contact-link:hover',
      '.home-hero__cta--solid:hover',
      '.home-talent',
      '.secondary-link:hover',
      '.careers-link--light:hover',
      '.careers-faq',
    ];

    // Selectors are often grouped (`:hover, :focus-visible { ... }`), so find the
    // selector anywhere and then take the block that actually follows it.
    const ruleBody = (selector: string): string => {
      const at = css.search(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`));
      if (at < 0) return '';
      const open = css.indexOf('{', at);
      const close = css.indexOf('}', open);
      return open < 0 || close < 0 ? '' : css.slice(open + 1, close);
    };

    for (const selector of textBearingSurfaces) {
      const body = ruleBody(selector);
      expect(body, `no rule found for ${selector}`).not.toBe('');
      // The surface may be the last background layer of a gradient, so look for
      // any var() fill rather than requiring a bare `background: var(...)`.
      const fills = [...body.matchAll(/var\((--bia-[a-z-]+)\)/g)].map((m) => m[1]);
      const light = /color:\s*var\(--bia-mist\)/.test(body);
      if (!light) continue; // rule does not put mist text on this surface
      const surface = fills.find((token) => !token.includes('mist') && !token.includes('line'));
      expect(surface, `${selector} has no tokenised surface`).toBeDefined();
      expect(
        contrast(tokenValue(surface!)!, tokenValue('--bia-mist')!),
        `${selector} sits on ${surface}, which cannot carry 4.5:1 mist text`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps muted body text above 4.5:1 on the light surfaces', () => {
    for (const surface of ['#e9f1fe', '#f4f8fe']) {
      expect(contrast(tokenValue('--bia-slate')!, surface)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('carries light text on the blue panel above 4.5:1', () => {
    expect(contrast(tokenValue('--bia-mist')!, tokenValue('--bia-blue-deep')!)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('logo', () => {
  it('ships the official artwork rather than a text placeholder', () => {
    expect(logo).toContain('viewBox="0 0 3687 927"');
    // Three letter paths plus the swoosh.
    expect([...logo.matchAll(/<path /g)]).toHaveLength(4);
    expect(logo).not.toContain('HONDURAS / FOODS');
  });

  it('drives the letters from currentColor so one asset covers both variants', () => {
    // The supplied "main white" and "main blue" files differ only in the letter
    // fill, so currentColor is what removes the need for a second asset.
    expect([...logo.matchAll(/fill="currentColor"/g)]).toHaveLength(3);
    expect(logo).not.toMatch(/fill="#1C3565"/);
  });

  it('pins the mark to the brand blue so the logo cannot drift off-palette', () => {
    expect(logo).toContain(`fill="${tokenValue('--bia-blue')!.toUpperCase()}"`);
  });
});