import { chromium } from 'playwright';
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const known: Record<string, string[]> = {
    '1-1': ['student', '/home/student', 'PerfQuest'],
    '1-2': ['PERF2024'], '1-3': ['99'], '1-4': ['7'],
    '1-5': ['find . -name "*.log"', '13', 'auth-service'],
    '2-1': ['1337'], '2-2': ['4'],
  };
  for (const [level, answers] of Object.entries(known)) {
    await page.goto(`http://localhost:4001/perf/play/${level}`, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(3000);
    try { await page.locator('button:has-text("בואו נתחיל"), button:has-text("המשך"), button:has-text("הבנתי")').first().click({ timeout: 2000 }); } catch {}
    await sleep(500);
    for (const ans of answers) {
      await page.locator('input[name="answer"]').first().fill(ans);
      await page.locator('button[type="submit"]').first().click();
      await sleep(1500);
    }
    try { await page.locator('button:has-text("המשך"), button:has-text("לשלב הבא")').first().click({ timeout: 2000 }); } catch {}
    await sleep(500);
  }

  await page.goto('http://localhost:4001/perf/play/2-3', { waitUntil: 'networkidle', timeout: 20000 });
  await sleep(3000);
  try { await page.locator('button:has-text("בואו נתחיל"), button:has-text("המשך"), button:has-text("הבנתי")').first().click({ timeout: 2000 }); } catch {}
  await sleep(500);

  // Specific targeted answers
  const tryAnswers = [
    '2.345', '2.35', '2.34', '0m2.345s',
    'Intel Core i7-9750H', 'Intel Core', 'i7-9750H',
    'real 0m2.345s', 'real\t0m2.345s', 'real    0m2.345s',
    '2.345s', '0m2.345', '2.100',
    // Maybe the answer format is like "2.00" -> answer is literally 2.00
    '2.00', '2.0', '2',
  ];

  for (const ans of tryAnswers) {
    await page.locator('input[name="answer"]').first().fill(ans);
    await page.locator('button[type="submit"]').first().click();
    await sleep(600);

    const isComplete = await page.evaluate(() => {
      const data = localStorage.getItem('perfquest_progress');
      return data ? JSON.parse(data).completedLevels?.includes('2-3') : false;
    });
    const text = await page.evaluate(() => document.body.innerText);
    const hasError = text.includes('שגוי');
    console.log(`"${ans}" -> error=${hasError} complete=${isComplete}`);
    if (isComplete) { console.log(`SUCCESS!`); break; }
  }

  await browser.close();
}
main().catch(console.error);
