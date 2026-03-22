import { test, expect, chromium } from '@playwright/test';

test('Visual game walkthrough', async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500,
  });
  const page = await browser.newPage({ viewport: { width: 430, height: 900 } });

  try {
    // 1. Open landing page — pause 3 seconds for animated intro
    console.log('Step 1: Opening landing page...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);

    // 2. Click "התחל חקירה" (start investigation) button
    console.log('Step 2: Clicking "התחל חקירה"...');
    const startBtn = page.locator('a[href="/play"]').first();
    await startBtn.waitFor({ state: 'visible', timeout: 15000 });
    await startBtn.click();

    // 3. Pause 2 seconds on the level map to show the acts
    console.log('Step 3: Viewing level map...');
    await page.waitForTimeout(2000);

    // 4. Click level 1-1
    console.log('Step 4: Clicking level 1-1...');
    const level11 = page.locator('a[href="/play/1-1"]').first();
    await level11.waitFor({ state: 'visible', timeout: 5000 });
    await level11.click();

    // 5. Pause 2 seconds to show the pre-lesson modal (Hebrew + English)
    console.log('Step 5: Viewing pre-lesson modal...');
    await page.waitForTimeout(2000);

    // 6. Click the continue button ("!בואו נתחיל")
    console.log('Step 6: Clicking continue on pre-lesson modal...');
    const preContinueBtn = page.locator('button').filter({ hasText: /נתחיל/ }).first();
    await preContinueBtn.waitFor({ state: 'visible', timeout: 5000 });
    await preContinueBtn.click();

    // 7. Pause 1 second to show the game play screen with terminal
    console.log('Step 7: Viewing game play screen...');
    await page.waitForTimeout(1000);

    // 8. Click on the terminal area
    console.log('Step 8: Clicking terminal...');
    const terminal = page.locator('.terminal-container').first();
    await terminal.waitFor({ state: 'visible', timeout: 5000 });
    await terminal.click();
    await page.waitForTimeout(500);

    // 9. Type "whoami" and press Enter — pause 1 second
    console.log('Step 9: Typing whoami...');
    await page.keyboard.type('whoami', { delay: 80 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // 10. Type "echo hello world" and press Enter — pause 1 second
    console.log('Step 10: Typing echo hello world...');
    await page.keyboard.type('echo hello world', { delay: 60 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // 11. Type "ls -a" and press Enter — pause 1 second
    console.log('Step 11: Typing ls -a...');
    await page.keyboard.type('ls -a', { delay: 60 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // 12. Click a command palette button (pwd) — pause 1 second, then press Enter
    console.log('Step 12: Clicking pwd palette button...');
    const pwdBtn = page.locator('button').filter({ hasText: 'pwd' }).first();
    await pwdBtn.waitFor({ state: 'visible', timeout: 3000 });
    await pwdBtn.click();
    await page.waitForTimeout(1000);
    // Focus terminal and press Enter to execute the inserted command
    await terminal.click();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // 13. Click the #!@ special chars button — pause 1 second
    console.log('Step 13: Clicking #!@ special chars button...');
    const specialBtn = page.locator('button').filter({ hasText: '#!@' }).first();
    await specialBtn.waitFor({ state: 'visible', timeout: 3000 });
    await specialBtn.click();
    await page.waitForTimeout(1000);

    // 14. Find the answer input, type the expected answer for level 1-1, submit
    // Level 1-1 validation: { type: 'output_contains', expected: 'PerfQuest' }
    console.log('Step 14: Submitting answer "PerfQuest"...');
    const answerInput = page.locator('input[name="answer"]').first();
    await answerInput.waitFor({ state: 'visible', timeout: 5000 });
    await answerInput.click();
    await answerInput.fill('PerfQuest');
    await page.waitForTimeout(500);
    // Click the submit (checkmark) button
    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.click();

    // 15. Pause 2 seconds to show the post-lesson modal with XP
    console.log('Step 15: Viewing post-lesson modal with XP...');
    await page.waitForTimeout(2000);

    // 16. Click continue to go to next level ("המשך ▶")
    console.log('Step 16: Clicking continue to next level...');
    const postContinueBtn = page.locator('button').filter({ hasText: /המשך/ }).first();
    await postContinueBtn.waitFor({ state: 'visible', timeout: 5000 });
    await postContinueBtn.click();

    // 17. Pause 2 seconds on the next level
    console.log('Step 17: Viewing next level...');
    await page.waitForTimeout(2000);

    // 18. Navigate to /profile — pause 3 seconds to show progress
    console.log('Step 18: Navigating to profile...');
    await page.goto('http://localhost:3000/profile');
    await page.waitForTimeout(3000);

    // 19. Wait 5 seconds before closing
    console.log('Step 19: Final pause before closing...');
    await page.waitForTimeout(5000);

    console.log('Visual walkthrough completed successfully!');
  } catch (err) {
    console.error('Test error at current step:', err);
    // Keep browser open for 10 seconds so user can see the error state
    await page.waitForTimeout(10000);
  }

  await browser.close();
});
