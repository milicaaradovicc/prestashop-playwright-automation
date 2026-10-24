import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import { createUniqueUser } from '../utils/testData';

test.describe('Register', () => {
  let registration: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(120_000); // the demo instance starts slowly
    registration = new RegistrationPage(page);
    await registration.open();
  });

  test('registration form opens and the fields are visible', async () => {
    await expect(registration.firstName).toBeVisible();
    await expect(registration.lastName).toBeVisible();
    await expect(registration.email).toBeVisible();
    await expect(registration.password).toBeVisible();
    await expect(registration.privacyCheckbox).toBeVisible();
    await expect(registration.termsCheckbox).toBeVisible();
    await expect(registration.submitButton).toBeVisible();
  });

  test('user registers successfully with valid data', async () => {
    const user = createUniqueUser();

    await registration.register(user);

    await expect(registration.form).toBeHidden();
    await expect(registration.accountButton).toBeVisible();
    await expect(registration.signInLink).toBeHidden();
  });
});