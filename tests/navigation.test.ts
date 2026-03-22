import { test, expect } from '@playwright/test';

test.describe('PerfQuest Navigation Flow', () => {

  test('1. Landing page renders with PerfQuest title and Hebrew text', async ({ page }) => {
    await page.goto('/');
    // Wait for hydration - the page uses client-side rendering
    await page.waitForFunction(() => document.readyState === 'complete');
    // Verify "PerfQuest" is visible (split across two spans: "Perf" + "Quest")
    await expect(page.locator('h1')).toContainText('Perf');
    await expect(page.locator('h1')).toContainText('Quest');
    // Verify Hebrew text is visible
    await expect(page.locator('text=חקור ביצועים')).toBeVisible();
  });

  test('2. Start button navigates to /play', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => document.readyState === 'complete');
    // The start button may be hidden initially (opacity-0) during intro animation.
    // Click "skip intro" if visible, or wait for the button to appear.
    const skipBtn = page.locator('button:has-text("דלג על ההקדמה")');
    if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipBtn.click();
    }
    // Wait for the start link to become visible (opacity transition)
    const startLink = page.locator('a[href="/play"]');
    await expect(startLink).toBeVisible({ timeout: 15000 });
    await startLink.click();
    await expect(page).toHaveURL(/\/play$/);
  });

  test('3. Level map shows acts with Act 1 title and clickable level 1-1', async ({ page }) => {
    await page.goto('/play');
    // Wait for client-side hydration and data load (localStorage progress)
    await page.waitForFunction(() => !document.body.textContent?.includes('Loading...'), { timeout: 10000 });
    // Verify Act 1 Hebrew title is visible
    await expect(page.locator('text=ברוכים הבאים ל-PerfQuest')).toBeVisible({ timeout: 10000 });
    // Verify level 1-1 link is clickable
    const level11 = page.locator('a[href="/play/1-1"]');
    await expect(level11).toBeVisible();
    await expect(level11).toBeEnabled();
  });

  test('4. Click level 1-1 shows pre-lesson modal with Hebrew and English content', async ({ page }) => {
    await page.goto('/play/1-1');
    await page.waitForFunction(() => document.readyState === 'complete');
    // Pre-lesson modal should appear with Hebrew and English content
    // Look for the modal overlay (fixed inset-0 z-50)
    const modal = page.locator('.fixed.inset-0.z-50');
    await expect(modal).toBeVisible({ timeout: 10000 });
    // Verify Hebrew content
    await expect(modal.locator('text=עברית')).toBeVisible();
    // Verify English content
    await expect(modal.locator('text=English')).toBeVisible();
    // Verify level title in Hebrew
    await expect(modal.locator('text=צעדים ראשונים')).toBeVisible();
  });

  test('5. Pre-lesson continue button reveals terminal area', async ({ page }) => {
    await page.goto('/play/1-1');
    await page.waitForFunction(() => document.readyState === 'complete');
    // Wait for pre-lesson modal
    const continueBtn = page.locator('button:has-text("בואו נתחיל")');
    await expect(continueBtn).toBeVisible({ timeout: 10000 });
    await continueBtn.click();
    // After clicking continue, the phase changes to 'playing' and terminal area appears
    // The terminal container is a div with ref={terminalRef} inside the flex-1 min-h-0 wrapper
    const terminalArea = page.locator('.flex-1.min-h-0');
    await expect(terminalArea).toBeVisible({ timeout: 5000 });
  });

  test('6. Terminal container renders with content', async ({ page }) => {
    await page.goto('/play/1-1');
    await page.waitForFunction(() => document.readyState === 'complete');
    // Click through pre-lesson
    const continueBtn = page.locator('button:has-text("בואו נתחיל")');
    await expect(continueBtn).toBeVisible({ timeout: 10000 });
    await continueBtn.click();
    // Verify terminal container div is present - xterm creates a .xterm container
    // The Terminal component renders a div that xterm attaches to
    const terminalWrapper = page.locator('.flex-1.min-h-0');
    await expect(terminalWrapper).toBeVisible({ timeout: 5000 });
    // Check that the terminal div exists inside
    const terminalDiv = terminalWrapper.locator('div').first();
    await expect(terminalDiv).toBeVisible();
  });

  test('7. Command palette shows command buttons (whoami, pwd, echo)', async ({ page }) => {
    await page.goto('/play/1-1');
    await page.waitForFunction(() => document.readyState === 'complete');
    // Click through pre-lesson
    const continueBtn = page.locator('button:has-text("בואו נתחיל")');
    await expect(continueBtn).toBeVisible({ timeout: 10000 });
    await continueBtn.click();
    // Verify command palette buttons are visible
    await expect(page.locator('button:has-text("whoami")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('button:has-text("pwd")')).toBeVisible();
    await expect(page.getByRole('button', { name: 'echo', exact: true })).toBeVisible();
  });

  test('8. Quest panel shows quest description', async ({ page }) => {
    await page.goto('/play/1-1');
    await page.waitForFunction(() => document.readyState === 'complete');
    // Click through pre-lesson
    const continueBtn = page.locator('button:has-text("בואו נתחיל")');
    await expect(continueBtn).toBeVisible({ timeout: 10000 });
    await continueBtn.click();
    // Verify quest description in Hebrew is shown (use the div, not the button header)
    await expect(page.locator('div.rtl-content.text-sm.leading-snug').first()).toBeVisible({ timeout: 5000 });
    // Verify quest description in English is shown
    await expect(page.locator('div.ltr-content.text-xs.leading-snug').first()).toBeVisible();
  });

  test('9. Profile page loads with rank info', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForFunction(() => !document.body.textContent?.includes('Loading...'), { timeout: 10000 });
    // Verify profile header
    await expect(page.locator('text=פרופיל')).toBeVisible({ timeout: 10000 });
    // Verify rank section is visible (XP display)
    await expect(page.getByText('XP', { exact: true })).toBeVisible();
    // Verify rank title exists
    await expect(page.locator('text=דרגות')).toBeVisible();
  });

  test('10. Invalid level /play/99-99 shows not-found message gracefully', async ({ page }) => {
    await page.goto('/play/99-99');
    await page.waitForFunction(() => document.readyState === 'complete');
    // The GamePage component shows "שלב לא נמצא" (Level not found) when level is null
    await expect(page.locator('text=שלב לא נמצא')).toBeVisible({ timeout: 10000 });
    // Verify there's a link back to the map
    await expect(page.locator('a[href="/play"]')).toBeVisible();
    // Verify no crash - page should still be functional
    await expect(page.locator('text=חזרה למפה')).toBeVisible();
  });

});
