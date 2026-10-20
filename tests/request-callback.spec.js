const { test, expect } = require('@playwright/test');

// Keep the fictional sample data together so it is easy to edit.
const sampleCustomer = {
  name: 'Maya Example',
  email: 'maya.example@example.com',
  phone: '202-555-0147',
  company: 'Example Lantern Studio',
  website: 'https://example.com',
  employees: '51-500',
};

test('submits a completed request for a call back', async ({ page }, testInfo) => {
  await page.goto('/');

  // Fill the contact details in the same order as the form.
  await page.getByLabel('Name').fill(sampleCustomer.name);
  await page.getByLabel('Email').fill(sampleCustomer.email);
  await page.getByLabel('Phone').fill(sampleCustomer.phone);
  await page.getByLabel('Company').fill(sampleCustomer.company);
  await page.getByLabel('Website').fill(sampleCustomer.website);

  // Check the completed inputs before submitting.
  await expect(page.getByLabel('Name')).toHaveValue(sampleCustomer.name);
  await expect(page.getByLabel('Email')).toHaveValue(sampleCustomer.email);
  await expect(page.getByLabel('Phone')).toHaveValue(sampleCustomer.phone);
  await expect(page.getByLabel('Company')).toHaveValue(sampleCustomer.company);
  await expect(page.getByLabel('Website')).toHaveValue(sampleCustomer.website);

  const employeeSelect = page.getByLabel('Number of Employees');
  await employeeSelect.selectOption({ label: sampleCustomer.employees });
  await expect(employeeSelect).toHaveValue(sampleCustomer.employees);

  // Capture the final form before the click that submits it.
  const screenshotPath = testInfo.outputPath('completed-form-before-submit.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach('completed form before submit', {
    path: screenshotPath,
    contentType: 'image/png',
  });

  await page.getByRole('button', { name: 'Request a call back' }).click();

  // Confirm both the real destination and the visible success state.
  await expect(page).toHaveURL(/\/thank-you\.html(?:[?#].*)?$/);
  await expect(page.getByText(/thank you/i).first()).toBeVisible();

  // Capture the confirmation after the form has been submitted successfully.
  const confirmationScreenshotPath = testInfo.outputPath('thank-you-after-submit.png');
  await page.screenshot({ path: confirmationScreenshotPath, fullPage: true });
  await testInfo.attach('thank-you page after submit', {
    path: confirmationScreenshotPath,
    contentType: 'image/png',
  });

  console.log('Success: the call-back request was submitted and the thank-you page was verified.');
});
