import { test, expect } from '@playwright/test';

test.describe('Historical Fantasy Football Stats', () => {
  test('rank column displays row positions correctly', async ({ page }) => {
    await page.goto('/');

    // Wait for data to load
    await expect(page.getByText('Loading data...')).toBeHidden({ timeout: 10000 });

    // Verify rank column header exists
    await expect(page.getByRole('columnheader', { name: '#' })).toBeVisible();

    // Get the first few rows and verify they have correct rank numbers
    const rows = page.locator('tbody tr');

    // First row should show rank 1
    const firstRowRank = rows.first().locator('td').first();
    await expect(firstRowRank).toHaveText('1');

    // Second row should show rank 2
    const secondRowRank = rows.nth(1).locator('td').first();
    await expect(secondRowRank).toHaveText('2');

    // Third row should show rank 3
    const thirdRowRank = rows.nth(2).locator('td').first();
    await expect(thirdRowRank).toHaveText('3');
  });

  test('scoring modal saves and persists changes', async ({ page }) => {
    await page.goto('/');

    // Wait for data to load
    await expect(page.getByText('Loading data...')).toBeHidden({ timeout: 10000 });

    // Open scoring settings
    await page.getByRole('button', { name: 'Scoring Settings' }).click();
    await expect(page.getByRole('heading', { name: 'Scoring Settings' })).toBeVisible();

    // Get the PPR input by finding the label and its adjacent input
    const pprLabel = page.getByText('Points per Reception');
    const pprInput = pprLabel.locator('..').locator('input');

    // Verify initial value is 1 (full PPR - the default)
    await expect(pprInput).toHaveValue('1');

    // Change PPR to 0.5 (half PPR)
    await pprInput.fill('0.5');
    await expect(pprInput).toHaveValue('0.5');

    // Save changes
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Modal should close
    await expect(page.getByRole('heading', { name: 'Scoring Settings' })).toBeHidden();

    // Reopen modal and verify the value persisted
    await page.getByRole('button', { name: 'Scoring Settings' }).click();
    await expect(page.getByRole('heading', { name: 'Scoring Settings' })).toBeVisible();

    // Verify PPR is still 0.5
    const pprInputAgain = pprLabel.locator('..').locator('input');
    await expect(pprInputAgain).toHaveValue('0.5');

    // Close modal
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('loads and displays player data', async ({ page }) => {
    await page.goto('/');

    // Check header is present
    await expect(page.locator('h1')).toContainText('Historical Fantasy Football Stats');

    // Wait for data to load (loading indicator should disappear)
    await expect(page.getByText('Loading data...')).toBeHidden({ timeout: 10000 });

    // Check that the table is present with data
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Check that we have rows in the table
    const rows = page.locator('tbody tr');
    await expect(rows.first()).toBeVisible();

    // Check that fantasy points column exists
    await expect(page.getByRole('columnheader', { name: 'Fantasy Pts' })).toBeVisible();

    // Check that position dropdown is present
    await expect(page.locator('select').first()).toBeVisible();

    // Check that scoring settings button is present
    await expect(page.getByRole('button', { name: 'Scoring Settings' })).toBeVisible();

    // Click on scoring settings and verify modal opens
    await page.getByRole('button', { name: 'Scoring Settings' }).click();
    await expect(page.getByRole('heading', { name: 'Scoring Settings' })).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'Scoring Settings' })).toBeHidden();

    // Filter by position (QB)
    await page.locator('select').first().selectOption('QB');

    // Verify table still has data and shows QB-specific columns
    await expect(page.getByRole('columnheader', { name: 'Pass Yds' })).toBeVisible();
  });
});
