import { test, expect } from '@playwright/test';

test('debug level 1-1', async ({ page }) => {
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log('HTTP ERROR:', response.status(), response.url());
    }
  });

  // Clear localStorage
  await page.goto('http://localhost:4000/');
  await page.evaluate(() => localStorage.clear());
  await page.waitForTimeout(1000);

  // Navigate to level 1-1
  await page.goto('http://localhost:4000/play/1-1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  const bodyText = await page.textContent('body');
  console.log('Body text (first 500):', bodyText?.substring(0, 500));

  // Look for buttons
  const buttons = await page.locator('button').all();
  console.log(`Found ${buttons.length} buttons`);
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].textContent();
    console.log(`  Button ${i}: "${text}"`);
  }
});
