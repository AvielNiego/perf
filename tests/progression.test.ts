import { test, expect } from '@playwright/test';

// Level 1-1: validation type is 'output_contains', expected 'PerfQuest'
// Level 1-2: validation type is 'answer_match', expected 'performance'

// Helper: clear localStorage before each test so we start fresh
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.removeItem('perfquest_progress'));
});

test.describe('Game Progression', () => {
  test('1. Complete level 1-1: pre-lesson -> answer -> post-lesson with XP', async ({ page }) => {
    await page.goto('/play/1-1');

    // Pre-lesson modal should appear
    const preLessonModal = page.locator('.fixed.inset-0');
    await expect(preLessonModal).toBeVisible({ timeout: 10000 });

    // Verify it contains the pre-lesson marker text
    await expect(preLessonModal.locator('text=📖')).toBeVisible();

    // Click continue button to start playing
    const continueBtn = preLessonModal.locator('button', { hasText: /בואו נתחיל/ });
    await expect(continueBtn).toBeVisible();
    await continueBtn.click();

    // Quest panel should now be visible with the answer input
    const answerInput = page.locator('input[name="answer"]');
    await expect(answerInput).toBeVisible({ timeout: 5000 });

    // Level 1-1 validation is output_contains with expected 'PerfQuest'
    // The answer input accepts the expected value
    await answerInput.fill('PerfQuest');

    // Submit via the form's submit button (checkmark)
    const submitBtn = page.locator('form button[type="submit"]');
    await submitBtn.click();

    // Post-lesson modal should appear
    const postLessonModal = page.locator('.fixed.inset-0');
    await expect(postLessonModal).toBeVisible({ timeout: 5000 });

    // Verify XP earned is shown: +100 XP
    await expect(postLessonModal.locator('text=+100 XP')).toBeVisible();

    // Verify it's the post-lesson (shows summary marker)
    await expect(postLessonModal.locator('text=✅')).toBeVisible();
  });

  test('2. XP tracking: XP shown after completing 1-1 and on profile', async ({ page }) => {
    // Complete level 1-1 first
    await page.goto('/play/1-1');
    await page.waitForSelector('.fixed.inset-0', { timeout: 10000 });

    // Click continue on pre-lesson
    await page.locator('button', { hasText: /בואו נתחיל/ }).click();

    // Fill answer and submit
    const answerInput = page.locator('input[name="answer"]');
    await expect(answerInput).toBeVisible({ timeout: 5000 });
    await answerInput.fill('PerfQuest');
    await page.locator('form button[type="submit"]').click();

    // Post-lesson shows XP
    await expect(page.locator('text=+100 XP')).toBeVisible({ timeout: 5000 });

    // Click continue to finish level
    await page.locator('button', { hasText: /המשך/ }).click();

    // Now navigate to profile
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Verify XP value of 100 is displayed on profile
    const xpDisplay = page.locator('text=100').first();
    await expect(xpDisplay).toBeVisible({ timeout: 5000 });

    // Also verify via the XP label directly under the number
    await expect(page.locator('.text-sm.text-\\[var\\(--text-secondary\\)\\]', { hasText: 'XP' }).first()).toBeVisible();
  });

  test('3. Level unlock: 1-2 accessible after completing 1-1', async ({ page }) => {
    // First check that 1-2 is NOT accessible before completing 1-1
    await page.goto('/play');
    await page.waitForLoadState('networkidle');

    // Level 1-2 link should have pointer-events-none (locked)
    const level12LinkBefore = page.locator('a[href="/play/1-2"]');
    // If locked, href will be '#' instead of '/play/1-2'
    // The locked levels use href='#' and have pointer-events-none + opacity-40
    const lockedLevel = page.locator('a[href="#"]', { hasText: /1-2|לוח המשימות/ });
    const unlockedLevel12 = page.locator('a[href="/play/1-2"]');

    // Before completion, 1-2 should be locked (href="#")
    // It may or may not exist as href="/play/1-2", so check the locked state
    const isLocked = await lockedLevel.count() > 0 || await unlockedLevel12.count() === 0;
    expect(isLocked).toBeTruthy();

    // Now complete level 1-1
    await page.goto('/play/1-1');
    await page.waitForSelector('.fixed.inset-0', { timeout: 10000 });
    await page.locator('button', { hasText: /בואו נתחיל/ }).click();

    const answerInput = page.locator('input[name="answer"]');
    await expect(answerInput).toBeVisible({ timeout: 5000 });
    await answerInput.fill('PerfQuest');
    await page.locator('form button[type="submit"]').click();

    // Wait for post-lesson and continue
    await expect(page.locator('text=+100 XP')).toBeVisible({ timeout: 5000 });
    await page.locator('button', { hasText: /המשך/ }).click();

    // Should navigate to next level or map. Go to /play explicitly.
    await page.goto('/play');
    await page.waitForLoadState('networkidle');

    // Now level 1-2 should be accessible (href="/play/1-2", not "#")
    const level12Unlocked = page.locator('a[href="/play/1-2"]');
    await expect(level12Unlocked).toBeVisible({ timeout: 5000 });

    // Verify it's clickable (no pointer-events-none class)
    const classAttr = await level12Unlocked.getAttribute('class');
    expect(classAttr).not.toContain('pointer-events-none');
  });

  test('4. Badge display: profile shows badge grid with mostly locked badges', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Badge section header should be visible
    await expect(page.locator('text=תגים').first()).toBeVisible({ timeout: 5000 });

    // BadgeDisplay component uses a grid of badges
    const badgeGrid = page.locator('.grid.grid-cols-3');
    await expect(badgeGrid).toBeVisible();

    // Most badges should be locked (have grayscale + opacity-40 classes)
    const lockedBadges = badgeGrid.locator('.grayscale');
    const lockedCount = await lockedBadges.count();
    expect(lockedCount).toBeGreaterThan(0);

    // With no progress, all badges should be locked
    const allBadgeCards = badgeGrid.locator('> div');
    const totalCount = await allBadgeCards.count();
    expect(totalCount).toBeGreaterThan(0);
    expect(lockedCount).toBe(totalCount);
  });

  test('5. Wrong answer handling: red border and error message on wrong answer', async ({ page }) => {
    await page.goto('/play/1-1');
    await page.waitForSelector('.fixed.inset-0', { timeout: 10000 });

    // Dismiss pre-lesson
    await page.locator('button', { hasText: /בואו נתחיל/ }).click();

    const answerInput = page.locator('input[name="answer"]');
    await expect(answerInput).toBeVisible({ timeout: 5000 });

    // Enter a wrong answer
    await answerInput.fill('WrongAnswer');
    await page.locator('form button[type="submit"]').click();

    // The input should get a red border class: border-[var(--accent-red)]
    // Check for the wrong answer error message (shown for 2 seconds)
    const errorMsg = page.locator('text=תשובה שגויה');
    await expect(errorMsg).toBeVisible({ timeout: 2000 });

    // The input should have the red border styling
    // Check the class contains the accent-red border indicator
    const inputClass = await answerInput.getAttribute('class');
    expect(inputClass).toContain('accent-red');
  });

  test('6. Hint system: clicking hint button shows hint in quest panel', async ({ page }) => {
    await page.goto('/play/1-1');
    await page.waitForSelector('.fixed.inset-0', { timeout: 10000 });

    // Dismiss pre-lesson
    await page.locator('button', { hasText: /בואו נתחיל/ }).click();
    await expect(page.locator('input[name="answer"]')).toBeVisible({ timeout: 5000 });

    // The hint button is the ❓ span with title containing "Hint"
    const hintButton = page.locator('span[title*="Hint"]');
    await expect(hintButton).toBeVisible();

    // Click hint
    await hintButton.click();

    // A hint box should appear with "Hint" label and hint content
    const hintDisplay = page.locator('text=Hint').first();
    await expect(hintDisplay).toBeVisible({ timeout: 3000 });

    // The hint text from act1.ts level 1-1 first hint:
    // "The echo command prints whatever you write after it."
    await expect(page.locator('text=The echo command prints whatever you write after it.')).toBeVisible();
  });

  test('7. localStorage persistence: completed level stays completed after reload', async ({ page }) => {
    // Complete level 1-1
    await page.goto('/play/1-1');
    await page.waitForSelector('.fixed.inset-0', { timeout: 10000 });
    await page.locator('button', { hasText: /בואו נתחיל/ }).click();

    const answerInput = page.locator('input[name="answer"]');
    await expect(answerInput).toBeVisible({ timeout: 5000 });
    await answerInput.fill('PerfQuest');
    await page.locator('form button[type="submit"]').click();

    await expect(page.locator('text=+100 XP')).toBeVisible({ timeout: 5000 });
    await page.locator('button', { hasText: /המשך/ }).click();

    // Verify localStorage was saved
    const progressBefore = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('perfquest_progress') || '{}');
    });
    expect(progressBefore.completedLevels).toContain('1-1');
    expect(progressBefore.xp).toBe(100);

    // Reload the page
    await page.goto('/play');
    await page.waitForLoadState('networkidle');

    // Verify localStorage still has the progress
    const progressAfter = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('perfquest_progress') || '{}');
    });
    expect(progressAfter.completedLevels).toContain('1-1');
    expect(progressAfter.xp).toBe(100);

    // Verify visually: level 1-1 should show as completed (checkmark)
    // Completed levels show '✅' instead of the level id
    await expect(page.locator('text=✅').first()).toBeVisible({ timeout: 5000 });

    // Level 1-2 should be unlocked (accessible)
    const level12 = page.locator('a[href="/play/1-2"]');
    await expect(level12).toBeVisible();
  });
});
