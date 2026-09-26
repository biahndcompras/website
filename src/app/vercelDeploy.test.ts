import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SPATIAL_ROUTES = [
  '/nosotros',
  '/about',
  '/marcas',
  '/brands',
  '/calidad-y-sostenibilidad',
  '/quality',
  '/talento',
  '/careers',
  '/contactanos',
  '/contact',
] as const;

interface VercelConfig {
  cleanUrls?: boolean;
  rewrites?: { source: string; destination: string }[];
}

function readVercelConfig(): VercelConfig {
  const file = resolve(process.cwd(), 'vercel.json');

  return existsSync(file)
    ? (JSON.parse(readFileSync(file, 'utf8')) as VercelConfig)
    : {};
}

describe('vercel deployment config', () => {
  it('rewrites every unknown path to the SPA entry point', () => {
    /*
     * Without this, Vercel answers a direct request for a client route with
     * its own 404 page instead of the app. In-app navigation keeps working
     * because the router never hits the network, so the defect only surfaces
     * on a hard reload or a shared link — which reads as a broken page, not a
     * routing problem.
     */
    const config = readVercelConfig();

    expect(config.rewrites, 'vercel.json must declare rewrites').toBeDefined();
    expect(config.rewrites).toContainEqual({
      source: '/(.*)',
      destination: '/index.html',
    });
  });

  it('keeps clean URLs so the canonical paths are not served twice', () => {
    // /about and /about.html are the same page; only one may be reachable.
    expect(readVercelConfig().cleanUrls).toBe(true);
  });

  it('covers every client route the app declares', () => {
    // The catch-all source matches by construction; this asserts the route set
    // it is protecting is the one the router actually serves.
    const routeSource = readFileSync(resolve(process.cwd(), 'src/app/routes.ts'), 'utf8');

    for (const path of SPATIAL_ROUTES) {
      expect(routeSource, path).toContain(path);
    }
  });
});
