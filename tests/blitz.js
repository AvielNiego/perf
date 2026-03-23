const { chromium } = require('@playwright/test');

const LEVELS = [
  { id: '1-1', answers: ['ubuntu', 'yes', 'PerfQuest'] },
  { id: '1-2', answers: ['PERF2024'] },
  { id: '1-3', answers: ['9'] },
  { id: '1-4', answers: ['7'] },
  { id: '1-5', answers: ['find . -name "*.log"', '9', 'auth-service'] },
  { id: '2-1', answers: ['PID'] },
  { id: '2-2', answers: ['4'] },
  { id: '2-3', answers: ['real'] },
  { id: '2-4', answers: ['free -h'] },
  { id: '2-5', answers: ['nproc'] },
  { id: '2-6', answers: ['strace -c'] },
  { id: '2-7', answers: ['debug_info'] },
  { id: '2-8', answers: ['counting'] },
  { id: '2-9', answers: ['%MEM', '1', '100', '-O2 -g'] },
  { id: '3-1', answers: ['perf list'] },
  { id: '3-2', answers: ['perf stat'] },
  { id: '3-3', answers: ['perf stat -e'] },
  { id: '3-4', answers: ['hot_loop'] },
  { id: '3-5', answers: ['perf report'] },
  { id: '3-6', answers: ['perf report --stdio'] },
  { id: '3-7', answers: ['perf record -g'] },
  { id: '3-8', answers: ['low', 'yes', 'random_access'] },
  { id: '4-1', answers: ['perf annotate'] },
  { id: '4-2', answers: ['flame.svg'] },
  { id: '4-3', answers: ['filtered_flame.svg'] },
  { id: '4-4', answers: ['perf stat -e cycles,page-faults'] },
  { id: '4-5', answers: ['perf record -p'] },
  { id: '4-6', answers: ['yes'] },
  { id: '4-7', answers: ['perf record --call-graph dwarf', 'matrix_multiply', 'perf annotate', 'guild_flame.svg'] },
  { id: '5-1', answers: ['perf probe'] },
  { id: '5-2', answers: ['perf sched latency'] },
  { id: '5-3', answers: ['perf mem report'] },
  { id: '5-4', answers: ['yes'] },
  { id: '5-5', answers: ['perf record -e sched:sched_switch'] },
  { id: '5-6', answers: ['memory-bound'] },
  { id: '5-7', answers: ['below', 'crisis_flame.svg', 'high', 'yes', 'false-sharing'] },
];

const BASE = 'http://151.145.81.195';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let passed = 0, failed = 0;

  for (const level of LEVELS) {
    try {
      // Navigate to the level
      await page.goto(`${BASE}/play/${level.id}`, { timeout: 10000 });
      await page.waitForTimeout(2000);

      // Wait for React hydration
      await page.waitForFunction(() => !document.body.innerText.includes('Loading...'), { timeout: 5000 }).catch(() => {});

      // Check if locked
      const body = await page.evaluate(() => document.body.innerText);
      if (body.includes('השלם את השלבים') || body.includes('locked')) {
        console.log(`${level.id}: LOCKED`);
        failed++;
        continue;
      }

      // Click pre-lesson continue
      const btn = page.locator('button').filter({ hasText: /נתחיל/ }).first();
      if (await btn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await btn.click({ force: true });
        await page.waitForTimeout(2000);
      } else {
        console.log(`${level.id}: NO BUTTON`);
        failed++;
        continue;
      }

      // Submit each answer
      for (const answer of level.answers) {
        const input = page.locator('input[name=answer]').first();
        await input.waitFor({ state: 'visible', timeout: 5000 });
        await input.fill(answer);
        await page.locator('button[type=submit]').first().click();
        await page.waitForTimeout(600);
      }

      await page.waitForTimeout(1000);

      // Check post-lesson appeared
      const postBtn = page.locator('button').filter({ hasText: /המשך/ }).first();
      const ok = await postBtn.isVisible({ timeout: 5000 }).catch(() => false);

      if (ok) {
        await postBtn.click({ force: true });
        await page.waitForTimeout(800);
        passed++;
        console.log(`${level.id}: PASS`);
      } else {
        failed++;
        // Debug: what's on screen
        const text = await page.evaluate(() => document.body.innerText.substring(0, 100));
        console.log(`${level.id}: FAIL — screen: ${text.replace(/\n/g, ' ').substring(0, 80)}`);
      }
    } catch (e) {
      failed++;
      console.log(`${level.id}: ERROR — ${e.message?.substring(0, 80)}`);
    }
  }

  console.log(`\nDONE: ${passed}/36 passed, ${failed} failed`);
  await browser.close();
})();
