import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

test('responsive image: srcset widths, dimensions, lazy offscreen, AVIF/WebP', async ({ page, request }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const imageRequests: string[] = [];
  page.on('request', (r) => r.resourceType() === 'image' && imageRequests.push(r.url()));
  await page.goto('/feature-tests/image-pipeline');

  const offscreen = page.getByTestId('offscreen-image');
  const info = await offscreen.evaluate((img: HTMLImageElement) => ({
    tag: img.parentElement?.tagName,
    imgSrcset: img.getAttribute('srcset'),
    sources: [...(img.parentElement?.querySelectorAll('source') ?? [])].map((s) => ({
      type: s.getAttribute('type'),
      srcset: s.getAttribute('srcset') ?? '',
    })),
    width: img.getAttribute('width'),
    height: img.getAttribute('height'),
    loading: img.getAttribute('loading'),
    complete: img.complete && img.naturalWidth > 0,
  }));

  // @responsive-image renders <picture><source srcset type=…><img>; the srcset lives on <source>.
  const srcsets = [info.imgSrcset ?? '', ...info.sources.map((s) => s.srcset)].filter(Boolean);
  const widths = new Set(srcsets.flatMap((s) => [...s.matchAll(/\s(\d+)w/g)].map((m) => m[1])));
  expect(widths.size).toBeGreaterThanOrEqual(2);
  expect(Number(info.width)).toBeGreaterThan(0);
  expect(Number(info.height)).toBeGreaterThan(0);
  expect(info.loading).toBe('lazy');

  const offscreenUrls = srcsets.join(',').match(/\/assets\/[^\s,]+/g)!;
  // The offscreen image has not been requested (or loaded) before scrolling.
  expect(imageRequests.filter((u) => offscreenUrls.some((o) => u.endsWith(o)))).toEqual([]);
  expect(info.complete).toBe(false);
  expect(imageRequests.length, 'above-the-fold image did load').toBeGreaterThan(0);

  const modern = info.sources.find((s) => s.type === 'image/avif') ?? info.sources.find((s) => s.type === 'image/webp');
  const firstUrl = modern!.srcset.split(',')[0].trim().split(/\s+/)[0];
  const res = await request.get(firstUrl);
  const contentType = res.headers()['content-type'];
  expect(contentType).toMatch(/image\/(avif|webp)/);

  await offscreen.scrollIntoViewIfNeeded();
  await expect.poll(() => offscreen.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  evidence(
    `<picture> sources ${info.sources.map((s) => s.type).join('/')} with widths ${[...widths].join(',')}w; img ${info.width}x${info.height} loading=lazy, 0 requests for it until scrolled; ${firstUrl} -> ${contentType}`,
  );
});
