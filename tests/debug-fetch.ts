import { chromium } from 'playwright';

const BASE_URL = 'http://151.145.81.195';
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.setDefaultTimeout(15000);

  // Capture all responses to find level data
  const responses: {url: string, body: string}[] = [];
  page.on('response', async (resp) => {
    const url = resp.url();
    if (url.includes('level') || url.includes('_next/data') || url.includes('api')) {
      try {
        const body = await resp.text();
        if (body.length < 5000) {
          responses.push({ url, body });
        } else {
          responses.push({ url, body: body.substring(0, 500) + '...' });
        }
      } catch {}
    }
  });

  await page.goto(`${BASE_URL}/play/1-1`, { waitUntil: 'networkidle', timeout: 15000 });
  await sleep(3000);

  // Get the full page HTML
  const html = await page.evaluate(() => document.documentElement.outerHTML);

  // Look for __NEXT_DATA__ or similar embedded data
  const nextData = await page.evaluate(() => {
    const el = document.getElementById('__NEXT_DATA__');
    return el ? el.textContent : null;
  });

  console.log('=== __NEXT_DATA__ ===');
  if (nextData) {
    const parsed = JSON.parse(nextData);
    console.log(JSON.stringify(parsed, null, 2).substring(0, 3000));
  } else {
    console.log('No __NEXT_DATA__ found');
  }

  // Get body text
  console.log('\n=== Body Text ===');
  const text = await page.evaluate(() => document.body.innerText);
  console.log(text);

  // Check localStorage
  console.log('\n=== localStorage ===');
  const ls = await page.evaluate(() => {
    const items: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) items[key] = localStorage.getItem(key) || '';
    }
    return items;
  });
  console.log(JSON.stringify(ls, null, 2));

  // Check responses
  console.log('\n=== Intercepted Responses ===');
  for (const r of responses) {
    console.log(`URL: ${r.url}`);
    console.log(`Body: ${r.body.substring(0, 200)}`);
    console.log('---');
  }

  // Look for script tags containing level data
  const scripts = await page.evaluate(() => {
    const tags = document.querySelectorAll('script');
    const results: string[] = [];
    for (const tag of tags) {
      const text = tag.textContent || '';
      if (text.includes('expected') || text.includes('validation') || text.includes('answer_match')) {
        results.push(text.substring(0, 500));
      }
    }
    return results;
  });
  console.log('\n=== Scripts with validation ===');
  for (const s of scripts) {
    console.log(s);
    console.log('---');
  }

  // Try to access the level object directly from React fiber
  const levelData = await page.evaluate(() => {
    // Try to find the level data in the React component tree
    try {
      const rootEl = document.getElementById('__next');
      if (!rootEl) return null;
      // @ts-ignore
      const fiber = rootEl._reactRootContainer?._internalRoot?.current ||
                    Object.keys(rootEl).filter(k => k.startsWith('__reactFiber'))[0] &&
                    (rootEl as any)[Object.keys(rootEl).filter(k => k.startsWith('__reactFiber'))[0]];
      if (!fiber) return 'No fiber found';
      return 'Fiber found but complex to traverse';
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  });
  console.log('\n=== React fiber ===');
  console.log(levelData);

  await browser.close();
}

main().catch(console.error);
