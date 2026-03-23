import { chromium } from 'playwright';

const BASE_URL = 'http://151.145.81.195';
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.setDefaultTimeout(15000);

  await page.goto(`${BASE_URL}/play/1-1`, { waitUntil: 'networkidle', timeout: 15000 });
  await sleep(3000);

  // Extract the full expected values with better regex
  const results = await page.evaluate(async () => {
    const resp = await fetch('/_next/static/chunks/0oo5l11g5rv92.js');
    const text = await resp.text();

    // Look for expected values more carefully - they might use escaped quotes
    const matches: string[] = [];
    // Match expected:"..." or expected:'...'
    const regex = /expected\s*:\s*"((?:[^"\\]|\\.)*)"/g;
    let m;
    while ((m = regex.exec(text)) !== null) {
      matches.push(m[1]);
    }

    // Also look for the level 1-5 step 1 area specifically
    const findIdx = text.indexOf('find . -name');
    if (findIdx > -1) {
      const snippet = text.substring(findIdx - 50, findIdx + 100);
      matches.push('SNIPPET: ' + snippet);
    }

    // Look for command_run type validations near "find"
    const cmdRunIdx = text.indexOf('command_run');
    if (cmdRunIdx > -1) {
      const snippets: string[] = [];
      let idx = 0;
      while ((idx = text.indexOf('command_run', idx)) !== -1) {
        snippets.push(text.substring(idx - 30, idx + 120));
        idx += 11;
        if (snippets.length > 5) break;
      }
      matches.push('CMD_RUN snippets: ' + JSON.stringify(snippets));
    }

    return matches;
  });

  for (const r of results) {
    console.log(r);
  }

  await browser.close();
}

main().catch(console.error);
