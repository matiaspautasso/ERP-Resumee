import { expect, test } from '@playwright/test';

test('admin signs in and registers a product that appears with formatted price', async ({
  page,
}) => {
  await page.goto('/login');
  await page.fill('input[name=email]', 'admin@erp.local');
  await page.fill('input[name=password]', 'Admin123!');
  await page.click('button[type=submit]');

  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();

  const sku = `E2E-${Date.now()}`;
  await page.fill('input[name=sku]', sku);
  await page.fill('input[name=name]', 'E2E Widget');
  await page.fill('input[name=unitPrice]', '1500');
  await page.click('button:has-text("Add product")');

  const row = page.getByTestId(`product-${sku}`);
  await expect(row).toBeVisible();
  await expect(row).toContainText('15.00');
});

test('redirects an unauthenticated visitor to the login screen', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});
