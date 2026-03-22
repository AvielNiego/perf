import { test, expect } from '@playwright/test';

// Helper: dismiss the pre-lesson modal and wait for terminal to appear
async function dismissPreLessonAndWaitForTerminal(page) {
  await page.goto('/play/1-1');
  // Wait for the pre-lesson modal continue button
  const continueBtn = page.locator('button', { hasText: /בואו נתחיל|continue/i });
  await continueBtn.waitFor({ state: 'visible', timeout: 15000 });
  await continueBtn.click();
  // Wait for xterm to render
  await page.locator('.xterm').waitFor({ state: 'visible', timeout: 10000 });
  // Small extra delay for xterm to fully initialize
  await page.waitForTimeout(1000);
}

test.describe('Terminal Component', () => {

  test('1. Terminal appears after pre-lesson modal is dismissed', async ({ page }) => {
    await page.goto('/play/1-1');

    // Pre-lesson modal should be visible
    const continueBtn = page.locator('button', { hasText: /בואו נתחיל|continue/i });
    await continueBtn.waitFor({ state: 'visible', timeout: 15000 });

    // Terminal should NOT be visible yet (or at least the modal is on top)
    await continueBtn.click();

    // After clicking continue, xterm should appear
    const xterm = page.locator('.xterm');
    await expect(xterm).toBeVisible({ timeout: 10000 });
  });

  test('2. Typing whoami in terminal shows student', async ({ page }) => {
    await dismissPreLessonAndWaitForTerminal(page);

    // Click on terminal to focus
    await page.locator('.xterm').click();
    await page.waitForTimeout(300);

    // Type whoami and press Enter
    await page.keyboard.type('whoami', { delay: 50 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Check that "student" appears in the terminal output
    const xtermContent = await page.locator('.xterm').textContent();
    expect(xtermContent).toContain('student');
  });

  test('3. Command palette button inserts text into terminal', async ({ page }) => {
    await dismissPreLessonAndWaitForTerminal(page);

    // Find a command palette button (whoami is in the palette for level 1-1)
    const whoamiBtn = page.locator('button', { hasText: /^whoami$/ });
    await whoamiBtn.waitFor({ state: 'visible', timeout: 5000 });
    await whoamiBtn.click();
    await page.waitForTimeout(500);

    // The text "whoami" should appear in the terminal
    const xtermContent = await page.locator('.xterm').textContent();
    expect(xtermContent).toContain('whoami');
  });

  test('4. Special characters toggle shows special char buttons', async ({ page }) => {
    await dismissPreLessonAndWaitForTerminal(page);

    // Click the #!@ button to toggle special characters
    const specialBtn = page.locator('button', { hasText: '#!@' });
    await specialBtn.waitFor({ state: 'visible', timeout: 5000 });
    await specialBtn.click();
    await page.waitForTimeout(300);

    // Verify special character buttons appear: |, >, -
    const pipeBtn = page.locator('button', { hasText: /^\|$/ });
    const gtBtn = page.locator('button', { hasText: /^>$/ });
    const dashBtn = page.locator('button', { hasText: /^-$/ });

    await expect(pipeBtn).toBeVisible({ timeout: 3000 });
    await expect(gtBtn).toBeVisible({ timeout: 3000 });
    await expect(dashBtn).toBeVisible({ timeout: 3000 });

    // Also verify Ctrl+C and ENTER buttons appear
    const ctrlCBtn = page.locator('button', { hasText: 'Ctrl+C' });
    const enterBtn = page.locator('button', { hasText: 'ENTER' });
    await expect(ctrlCBtn).toBeVisible({ timeout: 3000 });
    await expect(enterBtn).toBeVisible({ timeout: 3000 });
  });

  test('5. Echo command prints text in terminal', async ({ page }) => {
    await dismissPreLessonAndWaitForTerminal(page);

    // Click terminal to focus
    await page.locator('.xterm').click();
    await page.waitForTimeout(300);

    // Type echo hello and press Enter
    await page.keyboard.type('echo hello', { delay: 50 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Check that "hello" appears in the terminal
    const xtermContent = await page.locator('.xterm').textContent();
    expect(xtermContent).toContain('hello');
  });

  test('6. Clear command clears the terminal', async ({ page }) => {
    await dismissPreLessonAndWaitForTerminal(page);

    // Click terminal to focus
    await page.locator('.xterm').click();
    await page.waitForTimeout(300);

    // First type something so we have content
    await page.keyboard.type('whoami', { delay: 50 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Verify "student" is there
    let xtermContent = await page.locator('.xterm').textContent();
    expect(xtermContent).toContain('student');

    // Now type clear
    await page.keyboard.type('clear', { delay: 50 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // After clear, the terminal content should no longer contain "student"
    // Note: clear sends \x1b[2J\x1b[H which resets the screen
    xtermContent = await page.locator('.xterm').textContent();
    expect(xtermContent).not.toContain('student');
  });

  test('7. Ctrl+C button sends ^C to terminal', async ({ page }) => {
    await dismissPreLessonAndWaitForTerminal(page);

    // First toggle special characters to reveal Ctrl+C button
    const specialBtn = page.locator('button', { hasText: '#!@' });
    await specialBtn.click();
    await page.waitForTimeout(300);

    // Click terminal and type something partial
    await page.locator('.xterm').click();
    await page.waitForTimeout(300);
    await page.keyboard.type('some partial command', { delay: 30 });
    await page.waitForTimeout(300);

    // Click the Ctrl+C button
    const ctrlCBtn = page.locator('button', { hasText: 'Ctrl+C' });
    await ctrlCBtn.waitFor({ state: 'visible', timeout: 3000 });
    await ctrlCBtn.click();
    await page.waitForTimeout(500);

    // Verify ^C appears in the terminal
    const xtermContent = await page.locator('.xterm').textContent();
    expect(xtermContent).toContain('^C');
  });

});
