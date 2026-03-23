import { chromium } from 'playwright';

const BASE_URL = 'http://151.145.81.195';
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.setDefaultTimeout(15000);

  // Capture JS bundle content
  const jsContents: {url: string, content: string}[] = [];
  page.on('response', async (resp) => {
    const url = resp.url();
    if (url.endsWith('.js') && url.includes('_next')) {
      try {
        const body = await resp.text();
        if (body.includes('answer_match') || body.includes('expected') && body.includes('validation')) {
          jsContents.push({ url, content: body });
        }
      } catch {}
    }
  });

  await page.goto(`${BASE_URL}/play/1-1`, { waitUntil: 'networkidle', timeout: 15000 });
  await sleep(5000);

  console.log(`Found ${jsContents.length} JS files with validation data`);

  for (const js of jsContents) {
    console.log(`\n=== ${js.url} (${js.content.length} bytes) ===`);

    // Extract all 'expected' values
    const expectedMatches = js.content.matchAll(/expected\s*:\s*["']([^"']+)["']/g);
    for (const m of expectedMatches) {
      console.log(`  expected: "${m[1]}"`);
    }

    // Extract validation blocks for level 1-1
    // Look for step instructions and their expected answers
    const stepMatches = js.content.matchAll(/instruction\s*:\s*\{[^}]*en\s*:\s*["']([^"']+)["'][^}]*\}[^}]*validation\s*:\s*\{[^}]*expected\s*:\s*["']([^"']+)["']/g);
    for (const m of stepMatches) {
      console.log(`  step: "${m[1]}" => expected: "${m[2]}"`);
    }

    // Extract around "pwd" to see what question is asked
    const pwdIdx = js.content.indexOf('pwd');
    if (pwdIdx > -1) {
      // Find nearby expected values
      const nearby = js.content.substring(Math.max(0, pwdIdx - 200), pwdIdx + 500);
      if (nearby.includes('expected')) {
        console.log(`\n  Near 'pwd':`);
        console.log(`  ${nearby.replace(/\n/g, ' ').substring(0, 600)}`);
      }
    }
  }

  // Also try to extract level definitions directly from the page's JS context
  const levelDefs = await page.evaluate(() => {
    // Try to find the level definitions in window or modules
    try {
      // Check if there's a way to access the level data
      const scripts = document.querySelectorAll('script[src]');
      return Array.from(scripts).map(s => s.getAttribute('src')).filter(s => s);
    } catch {
      return [];
    }
  });

  console.log('\n=== Script sources ===');
  for (const src of levelDefs) {
    console.log(`  ${src}`);
  }

  // Try fetching the main JS bundle directly
  for (const src of levelDefs) {
    if (src && src.includes('_next')) {
      try {
        const fullUrl = src.startsWith('http') ? src : `${BASE_URL}${src}`;
        const resp = await page.evaluate(async (url: string) => {
          const r = await fetch(url);
          const text = await r.text();
          // Extract expected values
          const matches: string[] = [];
          const regex = /expected\s*:\s*["']([^"']+)["']/g;
          let m;
          while ((m = regex.exec(text)) !== null) {
            matches.push(m[1]);
          }
          return { size: text.length, expectedValues: matches };
        }, fullUrl);
        if (resp.expectedValues.length > 0) {
          console.log(`\n  ${fullUrl} (${resp.size} bytes):`);
          for (const v of resp.expectedValues) {
            console.log(`    expected: "${v}"`);
          }
        }
      } catch {}
    }
  }

  await browser.close();
}

main().catch(console.error);
