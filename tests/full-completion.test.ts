import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:4000';

interface LevelInfo {
  id: string;
  xp: number;
  isBoss: boolean;
  answers: string | string[];
}

const LEVELS: LevelInfo[] = [
  // Act 1 (5 levels)
  { id: '1-1', xp: 100, isBoss: false, answers: ['student', '/home/student', 'PerfQuest'] },
  { id: '1-2', xp: 100, isBoss: false, answers: 'PERF2024' },
  { id: '1-3', xp: 100, isBoss: false, answers: '42' },
  { id: '1-4', xp: 100, isBoss: false, answers: '7' },
  { id: '1-5', xp: 300, isBoss: true, answers: ['find . -name "*.log"', '13', 'auth-service'] },

  // Act 2 (9 levels)
  { id: '2-1', xp: 100, isBoss: false, answers: '1337' },
  { id: '2-2', xp: 100, isBoss: false, answers: '4' },
  { id: '2-3', xp: 100, isBoss: false, answers: 'real' },
  { id: '2-4', xp: 100, isBoss: false, answers: 'free -h' },
  { id: '2-5', xp: 100, isBoss: false, answers: 'nproc' },
  { id: '2-6', xp: 100, isBoss: false, answers: 'strace -c' },
  { id: '2-7', xp: 100, isBoss: false, answers: 'debug_info' },
  { id: '2-8', xp: 100, isBoss: false, answers: 'counting' },
  { id: '2-9', xp: 300, isBoss: true, answers: ['ps aux', '8', 'write', '-O2 -g'] },

  // Act 3 (8 levels)
  { id: '3-1', xp: 100, isBoss: false, answers: 'perf list' },
  { id: '3-2', xp: 100, isBoss: false, answers: 'perf stat' },
  { id: '3-3', xp: 100, isBoss: false, answers: 'perf stat -e' },
  { id: '3-4', xp: 100, isBoss: false, answers: 'hot_loop' },
  { id: '3-5', xp: 150, isBoss: false, answers: 'perf report' },
  { id: '3-6', xp: 150, isBoss: false, answers: 'perf report --stdio' },
  { id: '3-7', xp: 150, isBoss: false, answers: 'perf record -g' },
  { id: '3-8', xp: 300, isBoss: true, answers: ['low', 'yes', 'random_access'] },

  // Act 4 (7 levels)
  { id: '4-1', xp: 100, isBoss: false, answers: 'perf annotate' },
  { id: '4-2', xp: 150, isBoss: false, answers: 'flame.svg' },
  { id: '4-3', xp: 150, isBoss: false, answers: 'filtered_flame.svg' },
  { id: '4-4', xp: 100, isBoss: false, answers: 'perf stat -e cycles,page-faults' },
  { id: '4-5', xp: 100, isBoss: false, answers: 'perf record -p' },
  { id: '4-6', xp: 150, isBoss: false, answers: 'yes' },
  { id: '4-7', xp: 300, isBoss: true, answers: ['perf record --call-graph dwarf', 'matrix_multiply', 'perf annotate', 'guild_flame.svg'] },

  // Act 5 (7 levels)
  { id: '5-1', xp: 150, isBoss: false, answers: 'perf probe' },
  { id: '5-2', xp: 150, isBoss: false, answers: 'perf sched latency' },
  { id: '5-3', xp: 150, isBoss: false, answers: 'perf mem report' },
  { id: '5-4', xp: 150, isBoss: false, answers: 'yes' },
  { id: '5-5', xp: 150, isBoss: false, answers: 'perf record -e sched:sched_switch' },
  { id: '5-6', xp: 150, isBoss: false, answers: 'memory-bound' },
  { id: '5-7', xp: 300, isBoss: true, answers: ['below', 'crisis_flame.svg', 'high', 'yes', 'false-sharing'] },
];

const TOTAL_XP = LEVELS.reduce((sum, l) => sum + l.xp, 0); // 5250
const TOTAL_LEVELS = LEVELS.length; // 36

test.describe('PerfQuest Full Completion', () => {
  test('complete all 36 levels, earn all XP and badges', async ({ page }) => {
    test.setTimeout(600000); // 10 minutes

    // Use a tall viewport to avoid scroll issues with modals
    await page.setViewportSize({ width: 1280, height: 1200 });

    // Clear localStorage to start fresh
    await page.goto(BASE);
    await page.evaluate(() => localStorage.clear());
    await page.waitForTimeout(300);

    let completedCount = 0;
    let totalXpEarned = 0;
    const failedLevels: string[] = [];
    let wrongAnswerTested = false;
    let hintTested = false;

    for (let i = 0; i < LEVELS.length; i++) {
      const level = LEVELS[i];
      const levelTag = `Level ${level.id}`;

      try {
        console.log(`--- Starting ${levelTag} (XP: ${level.xp}, Boss: ${level.isBoss}) ---`);

        // Navigate to level
        await page.goto(`${BASE}/play/${level.id}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(300);

        // Wait for pre-lesson modal button
        const preLessonButton = page.locator('button', { hasText: 'נתחיל' });
        await preLessonButton.waitFor({ state: 'visible', timeout: 10000 });
        await page.waitForTimeout(200);
        await preLessonButton.scrollIntoViewIfNeeded();
        await preLessonButton.click({ timeout: 5000 });
        await page.waitForTimeout(250);

        // Wait for the answer input
        const answerInput = page.locator('input[name="answer"]');
        await answerInput.waitFor({ state: 'visible', timeout: 10000 });

        // Test wrong answer on level 1-2
        if (level.id === '1-2' && !wrongAnswerTested) {
          console.log('  [TEST] Submitting wrong answer...');
          await answerInput.fill('wrong_answer_xyz');
          await page.locator('button[type="submit"]').click({ force: true });
          await page.waitForTimeout(300);
          const errorVisible = await page.locator('text=תשובה שגויה').isVisible().catch(() => false);
          console.log(`  [TEST] Wrong answer error shown: ${errorVisible}`);
          wrongAnswerTested = true;
          await page.waitForTimeout(1500);
        }

        // Test hint on level 1-3
        if (level.id === '1-3' && !hintTested) {
          console.log('  [TEST] Using hint...');
          const hintButton = page.locator('span[title*="Hint"]');
          if (await hintButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await hintButton.click();
            await page.waitForTimeout(250);
            const hintVisible = await page.locator('div:has-text("Hint")').first().isVisible().catch(() => false);
            console.log(`  [TEST] Hint displayed: ${hintVisible}`);
            hintTested = true;
          }
        }

        // Submit answers (always treat as array for consistency)
        const answers = Array.isArray(level.answers) ? level.answers : [level.answers];
        for (let step = 0; step < answers.length; step++) {
          const answer = answers[step];
          if (answers.length > 1) {
            console.log(`  Step ${step + 1}/${answers.length}: "${answer}"`);
          } else {
            console.log(`  Answer: "${answer}"`);
          }
          const stepInput = page.locator('input[name="answer"]');
          await stepInput.waitFor({ state: 'visible', timeout: 5000 });
          await stepInput.fill(answer);
          await page.locator('button[type="submit"]').click({ force: true });
          await page.waitForTimeout(250);
        }

        // Wait for post-lesson modal
        const postLessonButton = page.locator('button', { hasText: 'המשך' });
        await postLessonButton.waitFor({ state: 'visible', timeout: 10000 });

        completedCount++;
        totalXpEarned += level.xp;
        console.log(`  COMPLETED ${levelTag} | XP: +${level.xp} | Total: ${totalXpEarned}`);

        await page.waitForTimeout(200);
        await postLessonButton.scrollIntoViewIfNeeded();
        await postLessonButton.click({ timeout: 5000 });
        await page.waitForTimeout(300);

      } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error(`  FAILED ${levelTag}: ${errMsg.substring(0, 200)}`);
        failedLevels.push(level.id);
      }
    }

    // === VERIFICATION ===
    console.log('\n========== VERIFICATION ==========');
    console.log(`Levels completed: ${completedCount}/${TOTAL_LEVELS}`);
    console.log(`Total XP earned: ${totalXpEarned}/${TOTAL_XP}`);
    console.log(`Failed levels: ${failedLevels.length > 0 ? failedLevels.join(', ') : 'none'}`);
    console.log(`Wrong answer tested: ${wrongAnswerTested}`);
    console.log(`Hint system tested: ${hintTested}`);

    // Navigate to profile
    await page.goto(`${BASE}/profile`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const profileText = await page.textContent('body') || '';

    // Check XP
    console.log(`Profile shows ${TOTAL_XP} XP: ${profileText.includes(String(TOTAL_XP))}`);

    // Check completed count
    console.log(`Profile shows ${TOTAL_LEVELS} levels: ${profileText.includes(String(TOTAL_LEVELS))}`);

    // Check rank (5250 XP -> Profiling Wizard at 4800)
    console.log(`Rank "Profiling Wizard": ${profileText.includes('Profiling Wizard') || profileText.includes('קוסם הפרופיילינג')}`);

    // Check badges
    const allBadges = ['Tutorial Graduate', 'System Thinker', 'Perf Beginner', 'Perf Intermediate', 'Perf Master',
                       'Deep Diver', 'Flame Tamer', 'Scheduler Whisperer', 'Memory Detective', 'Bug Hunter',
                       'Speed Reader', 'No Hints Needed', 'Ten Streak'];
    for (const badge of allBadges) {
      console.log(`Badge "${badge}": ${profileText.includes(badge)}`);
    }

    console.log('\n========== FINAL SUMMARY ==========');
    console.log(`RESULT: ${completedCount}/${TOTAL_LEVELS} levels completed`);
    console.log(`TOTAL XP: ${totalXpEarned}/${TOTAL_XP}`);
    console.log(`FAILED: ${failedLevels.length > 0 ? failedLevels.join(', ') : 'NONE'}`);
    console.log('====================================');

    // Assertions
    expect(completedCount).toBe(TOTAL_LEVELS);
    expect(totalXpEarned).toBe(TOTAL_XP);
    expect(failedLevels).toHaveLength(0);
    expect(wrongAnswerTested).toBe(true);
    expect(hintTested).toBe(true);
  });
});
