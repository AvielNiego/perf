import { test, expect } from '@playwright/test';

test('debug level 1-1', async ({ page }) => {
  // Listen for all failed requests
  page.on('requestfailed', request => {
    console.log('FAILED REQUEST:', request.url(), request.failure()?.errorText);
  });
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log('HTTP ERROR:', response.status(), response.url());
    }
  });

  await page.goto('/play/1-1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
});
