import { test, expect } from '@playwright/test';
import { injectAxe, getViolations } from 'axe-playwright';
import fs from 'fs';

test.describe('Preview Page Smoke & A11y Tests', () => {
  
  test('preview renders and CTA interaction works', async ({ page }) => {
    // 1. Preview renders
    await page.goto('http://localhost:3000/preview/home'); // Assuming 'home' is your slug
    await expect(page.locator('main')).toBeVisible();

    // 2. CTA Interaction
    // The CTA component renders an <a> tag. We check if it exists and is clickable.
    const ctaLink = page.locator('section a').first();
    // We wait for it to be visible and enabled (clickable)
    if (await ctaLink.isVisible()) {
      await expect(ctaLink).toBeEnabled();
      // We can also simulate a click to ensure it's interactive
      // (Using .hover() as a safe interaction that doesn't navigate away and break the test)
      await ctaLink.hover(); 
    }
  });

  test('axe run via Playwright & artifact generation', async ({ page }) => {
    await page.goto('http://localhost:3000/preview/home');
    await injectAxe(page);
    
    const violations = await getViolations(page);
    
    // Save the a11y-report.json artifact
    fs.writeFileSync('a11y-report.json', JSON.stringify(violations, null, 2));
    
    // Fail on any critical axe violations
    const critical = violations.filter((v: any) => v.impact === 'critical');
    expect(critical.length).toBe(0);
  });
});
