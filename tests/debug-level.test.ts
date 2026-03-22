import { test, expect } from '@playwright/test';

test('debug level 1-1', async ({ page }) => {
  // Clear localStorage
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());

  // Navigate to level 1-1
  await page.goto('/play/1-1');

  // Wait longer for hydration
  await page.waitForTimeout(5000);

  // Get the full page content
  const content = await page.content();
  console.log('Page URL:', page.url());

  // Check if loading is still showing
  const bodyText = await page.textContent('body');
  console.log('Body text (first 500):', bodyText?.substring(0, 500));

  // Look for any buttons
  const buttons = await page.locator('button').all();
  console.log(`Found ${buttons.length} buttons`);
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].textContent();
    console.log(`  Button ${i}: "${text}"`);
  }

  // Check for the locked state
  const locked = await page.locator('text=🔒').isVisible().catch(() => false);
  console.log('Locked icon visible:', locked);

  // Try waiting for Loading to disappear
  try {
    await page.locator('text=Loading').waitFor({ state: 'hidden', timeout: 10000 });
    console.log('Loading disappeared');
  } catch {
    console.log('Loading still visible after 10s');
  }

  // Check again
  const buttons2 = await page.locator('button').all();
  console.log(`After wait - Found ${buttons2.length} buttons`);
  for (let i = 0; i < buttons2.length; i++) {
    const text = await buttons2[i].textContent();
    console.log(`  Button ${i}: "${text}"`);
  }
});
