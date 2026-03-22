import { chromium } from 'playwright';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // Complete prerequisites
  await page.goto('http://localhost:4001/perf/play/1-1', { waitUntil: 'networkidle', timeout: 20000 });
  await sleep(3000);
  try { await page.locator('button:has-text("בואו נתחיל"), button:has-text("המשך"), button:has-text("הבנתי")').first().click({ timeout: 2000 }); } catch {}
  await sleep(500);
  const input = () => page.locator('input[name="answer"]').first();
  const submitBtn = () => page.locator('button[type="submit"]').first();

  await input().fill('student'); await submitBtn().click(); await sleep(1500);
  await input().fill('/home/student'); await submitBtn().click(); await sleep(1500);
  await input().fill('PerfQuest'); await submitBtn().click(); await sleep(2000);
  try { await page.locator('button:has-text("המשך"), button:has-text("לשלב הבא")').first().click({ timeout: 2000 }); } catch {}
  await sleep(1000);

  await page.goto('http://localhost:4001/perf/play/1-2', { waitUntil: 'networkidle', timeout: 20000 });
  await sleep(3000);
  try { await page.locator('button:has-text("בואו נתחיל"), button:has-text("המשך"), button:has-text("הבנתי")').first().click({ timeout: 2000 }); } catch {}
  await sleep(500);
  await input().fill('PERF2024'); await submitBtn().click(); await sleep(2000);
  try { await page.locator('button:has-text("המשך"), button:has-text("לשלב הבא")').first().click({ timeout: 2000 }); } catch {}
  await sleep(1000);

  // Now 1-3
  await page.goto('http://localhost:4001/perf/play/1-3', { waitUntil: 'networkidle', timeout: 20000 });
  await sleep(3000);
  try { await page.locator('button:has-text("בואו נתחיל"), button:has-text("המשך"), button:has-text("הבנתי")').first().click({ timeout: 2000 }); } catch {}
  await sleep(500);

  // Try answers with explicit submit button click and check border color
  const answers = ['3', '5', '7', '42', '0', '15', '10', '4', '2', '8', '6', '1', '9', '11', '12', '13', '14', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '30', '35', '40', '45', '50', '100', '200', '500', '1000'];

  for (const ans of answers) {
    await input().fill(ans);
    await submitBtn().click();
    await sleep(500);

    // Check if the input still has value (wrong answer clears it)
    const inputValue = await input().inputValue();

    // Check for error toast
    const pageText = await page.evaluate(() => document.body.innerText);
    const hasError = pageText.includes('שגוי') || pageText.includes('שגויה');

    // Check if the step/level changed
    const hasSuccess = pageText.includes('כל הכבוד') || pageText.includes('מצוין') || pageText.includes('עברת');
    const hasPostBtn = await page.locator('button:has-text("לשלב הבא"), button:has-text("סיום")').first().isVisible().catch(() => false);

    // Check if localStorage was updated
    const completed = await page.evaluate(() => {
      const data = localStorage.getItem('perfquest_progress');
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.completedLevels;
      }
      return [];
    });

    const isComplete = completed.includes('1-3');

    if (hasError || hasSuccess || hasPostBtn || isComplete) {
      console.log(`"${ans}" -> error=${hasError} success=${hasSuccess} postBtn=${hasPostBtn} completed=${isComplete} inputVal="${inputValue}"`);
    }

    if (hasSuccess || hasPostBtn || isComplete) {
      console.log(`SUCCESS! Answer: ${ans}`);
      await page.screenshot({ path: 'D:/dev/perf/tests/debug-1-3-success.png' });
      break;
    }
  }

  // Final check
  const completed = await page.evaluate(() => {
    const data = localStorage.getItem('perfquest_progress');
    return data ? JSON.parse(data).completedLevels : [];
  });
  console.log('\nCompleted levels:', completed);

  await page.screenshot({ path: 'D:/dev/perf/tests/debug-1-3-final.png' });
  await browser.close();
}

main().catch(console.error);
