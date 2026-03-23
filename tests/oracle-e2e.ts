import { chromium, Page } from 'playwright';

const BASE_URL = 'http://151.145.81.195';
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const LEVELS = [
  '1-1','1-2','1-3','1-4','1-5',
  '2-1','2-2','2-3','2-4','2-5','2-6','2-7','2-8','2-9',
  '3-1','3-2','3-3','3-4','3-5','3-6','3-7','3-8',
  '4-1','4-2','4-3','4-4','4-5','4-6','4-7',
  '5-1','5-2','5-3','5-4','5-5','5-6','5-7',
];

// Each level's answers: for multi_step levels, array of per-step answer alternatives
// For single-step levels, array of alternatives for that one answer
interface LevelDef {
  type: 'single' | 'multi';
  // For single: alternatives for the one answer
  // For multi: array of arrays of alternatives per step
  steps: string[][];
}

const ANSWERS: Record<string, LevelDef> = {
  '1-1': { type: 'multi', steps: [['student', 'ubuntu'], ['yes'], ['PerfQuest']] },
  '1-2': { type: 'single', steps: [['PERF2024', 'perf2024']] },
  '1-3': { type: 'single', steps: [['42']] },
  '1-4': { type: 'single', steps: [['7']] },
  '1-5': { type: 'multi', steps: [['find . -name "*.log"', "find . -name '*.log'"], ['13'], ['auth-service']] },
  '2-1': { type: 'single', steps: [['1337']] },
  '2-2': { type: 'single', steps: [['4']] },
  '2-3': { type: 'single', steps: [['real']] },
  '2-4': { type: 'single', steps: [['free -h']] },
  '2-5': { type: 'single', steps: [['nproc']] },
  '2-6': { type: 'single', steps: [['strace -c']] },
  '2-7': { type: 'single', steps: [['debug_info']] },
  '2-8': { type: 'single', steps: [['counting']] },
  '2-9': { type: 'multi', steps: [['ps aux'], ['8'], ['write'], ['-O2 -g', '-g -O2', '-g']] },
  '3-1': { type: 'single', steps: [['perf list']] },
  '3-2': { type: 'single', steps: [['perf stat']] },
  '3-3': { type: 'single', steps: [['perf stat -e']] },
  '3-4': { type: 'single', steps: [['hot_loop']] },
  '3-5': { type: 'single', steps: [['perf report']] },
  '3-6': { type: 'single', steps: [['perf report --stdio']] },
  '3-7': { type: 'single', steps: [['perf record -g']] },
  '3-8': { type: 'multi', steps: [['low'], ['yes'], ['random_access']] },
  '4-1': { type: 'single', steps: [['perf annotate']] },
  '4-2': { type: 'single', steps: [['flame.svg']] },
  '4-3': { type: 'single', steps: [['filtered_flame.svg']] },
  '4-4': { type: 'single', steps: [['perf stat -e cycles,page-faults']] },
  '4-5': { type: 'single', steps: [['perf record -p']] },
  '4-6': { type: 'single', steps: [['yes']] },
  '4-7': { type: 'multi', steps: [['perf record --call-graph dwarf'], ['matrix_multiply'], ['perf annotate'], ['guild_flame.svg']] },
  '5-1': { type: 'single', steps: [['perf probe']] },
  '5-2': { type: 'single', steps: [['perf sched latency']] },
  '5-3': { type: 'single', steps: [['perf mem report']] },
  '5-4': { type: 'single', steps: [['yes']] },
  '5-5': { type: 'single', steps: [['perf record -e sched:sched_switch']] },
  '5-6': { type: 'single', steps: [['memory-bound']] },
  '5-7': { type: 'multi', steps: [['below'], ['crisis_flame.svg'], ['high'], ['yes'], ['false-sharing']] },
};

async function dismissPreLesson(page: Page): Promise<boolean> {
  const patterns = ['נתחיל', 'בואו נתחיל', 'הבנתי', 'קדימה', 'המשך', 'Continue', 'Start'];
  for (let attempt = 0; attempt < 3; attempt++) {
    for (const pat of patterns) {
      try {
        const btn = page.locator(`button:has-text("${pat}")`).first();
        if (await btn.isVisible({ timeout: 800 })) {
          await btn.click();
          await sleep(800);
          return true;
        }
      } catch {}
    }
    await sleep(500);
  }
  return false;
}

async function clickPostLesson(page: Page): Promise<boolean> {
  await sleep(500);
  const patterns = ['המשך', 'לשלב הבא', 'סיום', 'Continue', 'Next', 'Finish'];
  for (let attempt = 0; attempt < 5; attempt++) {
    for (const pat of patterns) {
      try {
        const btn = page.locator(`button:has-text("${pat}")`).first();
        if (await btn.isVisible({ timeout: 800 })) {
          await btn.click();
          await sleep(800);
          return true;
        }
      } catch {}
    }
    await sleep(800);
  }
  return false;
}

async function getCurrentStepFromPage(page: Page): Promise<{current: number, total: number}> {
  const text = await page.evaluate(() => document.body.innerText).catch(() => '');
  const m = text.match(/(\d+)\/(\d+)/);
  if (m) return { current: parseInt(m[1]), total: parseInt(m[2]) };
  return { current: 1, total: 1 };
}

async function submitAndCheck(page: Page, answer: string, levelId: string): Promise<'next_step' | 'level_done' | 'wrong' | 'no_input'> {
  // Get step before
  const stepBefore = await getCurrentStepFromPage(page);

  const input = page.locator('input[name="answer"]').first();
  try {
    await input.waitFor({ timeout: 3000 });
  } catch {
    return 'no_input';
  }

  await input.fill('');
  await sleep(50);
  await input.fill(answer);
  await sleep(150);

  // Click submit - try button[type="submit"] first, then any button near the input
  try {
    const submitBtn = page.locator('button[type="submit"]').first();
    if (await submitBtn.isVisible({ timeout: 500 })) {
      await submitBtn.click();
    } else {
      // Try the checkmark button or any button near the form
      const formBtn = page.locator('form button, .quest-input button, button:near(input[name="answer"])').first();
      await formBtn.click();
    }
  } catch {
    // Fallback: press Enter
    await input.press('Enter');
  }

  await sleep(1200);

  // Check if level is completed
  if (await isLevelCompleted(page, levelId)) {
    return 'level_done';
  }

  // Check for success text
  const bodyText = await page.evaluate(() => document.body.innerText).catch(() => '');
  const successWords = ['כל הכבוד', 'מעולה', 'הצלחת', 'עברת', 'סיימת'];
  if (successWords.some(w => bodyText.includes(w))) {
    return 'level_done';
  }

  // Check if step advanced
  const stepAfter = await getCurrentStepFromPage(page);
  if (stepAfter.current > stepBefore.current) {
    return 'next_step';
  }

  // Check if the answer was wrong
  if (bodyText.includes('שגוי') || bodyText.includes('נסו שוב') || bodyText.includes('wrong') || bodyText.includes('incorrect')) {
    return 'wrong';
  }

  // If step didn't change, assume wrong
  return 'wrong';
}

async function isLevelCompleted(page: Page, levelId: string): Promise<boolean> {
  try {
    return await page.evaluate((lid: string) => {
      const data = localStorage.getItem('perfquest_progress');
      if (data) {
        const parsed = JSON.parse(data);
        return (parsed.completedLevels || []).includes(lid);
      }
      return false;
    }, levelId);
  } catch {
    return false;
  }
}

async function playLevel(page: Page, levelId: string): Promise<'PASS' | 'FAIL' | 'STUCK'> {
  const levelDef = ANSWERS[levelId];
  if (!levelDef) {
    console.log(`  No answer data for level ${levelId}`);
    return 'FAIL';
  }

  console.log(`\n--- Level ${levelId} (${levelDef.steps.length} steps) ---`);

  // Navigate
  try {
    await page.goto(`${BASE_URL}/play/${levelId}`, { waitUntil: 'networkidle', timeout: 15000 });
  } catch {
    try { await page.goto(`${BASE_URL}/play/${levelId}`, { timeout: 15000 }); } catch {}
  }

  await sleep(3000);

  // Check if already completed
  if (await isLevelCompleted(page, levelId)) {
    console.log(`  Already completed!`);
    return 'PASS';
  }

  // Check if locked
  const bodyText = await page.evaluate(() => document.body.innerText).catch(() => '');
  if (bodyText.includes('השלם את השלבים הקודמים') || bodyText.includes('locked')) {
    console.log(`  LOCKED`);
    return 'STUCK';
  }

  // Dismiss pre-lesson
  const dismissed = await dismissPreLesson(page);
  console.log(`  Pre-lesson dismissed: ${dismissed}`);
  await sleep(3000); // Wait for terminal

  // Process each step
  for (let stepIdx = 0; stepIdx < levelDef.steps.length; stepIdx++) {
    const alternatives = levelDef.steps[stepIdx];
    console.log(`  Step ${stepIdx + 1}/${levelDef.steps.length}: trying ${alternatives.join(' | ')}`);

    let stepPassed = false;
    for (const answer of alternatives) {
      console.log(`    Submitting: "${answer}"`);
      const result = await submitAndCheck(page, answer, levelId);
      console.log(`    Result: ${result}`);

      if (result === 'level_done') {
        console.log(`  Level DONE!`);
        await clickPostLesson(page);
        return 'PASS';
      }
      if (result === 'next_step') {
        stepPassed = true;
        break;
      }
      if (result === 'no_input') {
        // Maybe level is already done or input not visible
        if (await isLevelCompleted(page, levelId)) {
          await clickPostLesson(page);
          return 'PASS';
        }
        console.log(`  No input found`);
        await page.screenshot({ path: `D:/dev/perf/tests/debug-${levelId}-noinput-${stepIdx}.png` }).catch(() => {});
        return 'STUCK';
      }
      // Wrong answer, try next alternative
      await sleep(300);
    }

    if (!stepPassed) {
      // For the last step, check if level completed anyway
      if (await isLevelCompleted(page, levelId)) {
        await clickPostLesson(page);
        return 'PASS';
      }
      console.log(`  Step ${stepIdx + 1} FAILED with all alternatives`);
      await page.screenshot({ path: `D:/dev/perf/tests/debug-${levelId}-fail-${stepIdx}.png` }).catch(() => {});
      return 'FAIL';
    }

    await sleep(500);
  }

  // After all steps, check completion
  await sleep(2000);
  if (await isLevelCompleted(page, levelId)) {
    await clickPostLesson(page);
    return 'PASS';
  }

  // Try post-lesson button
  await clickPostLesson(page);
  if (await isLevelCompleted(page, levelId)) {
    return 'PASS';
  }

  // Double-check
  const finalText = await page.evaluate(() => document.body.innerText).catch(() => '');
  if (['כל הכבוד', 'מעולה', 'הצלחת', 'עברת', 'סיימת'].some(w => finalText.includes(w))) {
    await clickPostLesson(page);
    return 'PASS';
  }

  console.log(`  Level not confirmed completed after all steps`);
  await page.screenshot({ path: `D:/dev/perf/tests/debug-${levelId}-end.png` }).catch(() => {});
  return 'FAIL';
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);

  const results: { level: string; status: string }[] = [];
  let passed = 0, failed = 0, stuck = 0;

  console.log('=== PerfQuest Oracle Playthrough ===');
  console.log(`Server: ${BASE_URL}`);
  console.log(`Total levels: ${LEVELS.length}\n`);

  for (let i = 0; i < LEVELS.length; i++) {
    const levelId = LEVELS[i];
    try {
      const status = await playLevel(page, levelId);
      results.push({ level: levelId, status });
      if (status === 'PASS') passed++;
      else if (status === 'FAIL') failed++;
      else stuck++;
      console.log(`  >> Level ${levelId}: ${status}`);

      // Progress report every 5 levels
      if ((i + 1) % 5 === 0) {
        console.log(`\n  === Progress: ${i + 1}/${LEVELS.length} | PASS=${passed} FAIL=${failed} STUCK=${stuck} ===\n`);
      }

      // If stuck/locked, stop trying since levels are sequential
      if (status === 'STUCK') {
        const bt = await page.evaluate(() => document.body.innerText).catch(() => '');
        if (bt.includes('השלם') || bt.includes('locked')) {
          console.log(`  Remaining levels locked.`);
          for (let j = i + 1; j < LEVELS.length; j++) {
            results.push({ level: LEVELS[j], status: 'STUCK' });
            stuck++;
          }
          break;
        }
      }
    } catch (e: any) {
      console.log(`  ERROR: ${e.message?.substring(0, 200)}`);
      results.push({ level: levelId, status: 'FAIL' });
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('  FINAL RESULTS');
  console.log('='.repeat(60));
  for (const r of results) {
    const icon = r.status === 'PASS' ? '[OK]' : r.status === 'FAIL' ? '[XX]' : '[--]';
    console.log(`  ${icon} Level ${r.level}: ${r.status}`);
  }
  console.log(`\n  Total: ${passed}/${LEVELS.length} passed, ${failed} failed, ${stuck} stuck`);
  console.log('='.repeat(60));

  await browser.close();
}

main().catch(console.error);
