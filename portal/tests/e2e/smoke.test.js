// ============================================================
// E2E Smoke Test — verifies the app loads and key elements exist
// ============================================================
import { test, expect } from '@playwright/test';

test.describe('App Smoke Tests', () => {
  test('page loads without critical JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    // Wait for scripts to initialize
    await page.waitForTimeout(2000);

    // Filter out non-critical errors (Supabase connection fails in test env)
    const critical = errors.filter(
      (e) => !e.includes('supabase') && !e.includes('fetch') && !e.includes('NetworkError')
    );
    expect(critical).toEqual([]);
  });

  test('login screen is visible on load', async ({ page }) => {
    await page.goto('/');
    const loginScreen = page.locator('#loginScreen');
    await expect(loginScreen).toBeVisible();
  });

  test('login form has email and password inputs', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#loginEmail')).toBeVisible();
    await expect(page.locator('#loginPassword')).toBeVisible();
  });

  test('login form has submit button', async ({ page }) => {
    await page.goto('/');
    const btn = page.locator('#loginForm button[type="submit"]');
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('INICIAR SESIÓN');
  });

  test('app title is displayed', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#loginScreen h1')).toBeVisible();
    await expect(page.locator('#loginScreen h1')).toContainText('MAESTRO HVACR');
  });

  test('all critical CSS files load', async ({ page }) => {
    const failedCSS = [];
    page.on('response', (res) => {
      if (res.url().includes('.css') && !res.ok()) {
        failedCSS.push(res.url());
      }
    });
    await page.goto('/');
    await page.waitForTimeout(1000);
    expect(failedCSS).toEqual([]);
  });

  test('all Tier 0 scripts load', async ({ page }) => {
    const failedJS = [];
    page.on('response', (res) => {
      if (res.url().includes('.js') && !res.ok() && !res.url().includes('supabase')) {
        failedJS.push(res.url());
      }
    });
    await page.goto('/');
    await page.waitForTimeout(2000);
    expect(failedJS).toEqual([]);
  });

  test('meta theme-color is set', async ({ page }) => {
    await page.goto('/');
    const theme = await page.locator('meta[name="theme-color"]').getAttribute('content');
    expect(theme).toBeTruthy();
  });

  test('empty login shows validation', async ({ page }) => {
    await page.goto('/');
    // Click submit with empty fields — HTML5 validation prevents submission
    const emailInput = page.locator('#loginEmail');
    // Check required attribute
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('no other screens are visible on initial load', async ({ page }) => {
    await page.goto('/');
    const dashboardScreen = page.locator('#dashboardScreen');
    // Dashboard should exist but not be active/visible
    const isVisible = await dashboardScreen.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  });
});
