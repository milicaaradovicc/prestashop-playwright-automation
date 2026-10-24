import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import { createUniqueUser } from '../utils/testData';

test.describe('Register', () => {
  let registration: RegistrationPage;

  test.beforeEach(async ({ page }) => {
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

  test('shows error when email is already registered', async () => {
    const user = createUniqueUser();

    // first registration succeeds
    await registration.register(user);
    await expect(registration.accountButton).toBeVisible();

    // sign out
    await registration.signOut();
    await expect(registration.signInLink).toBeVisible();

    // register again with the same email in the SAME shop instance
    await registration.goToRegistration();
    await registration.register(user);

    // error is shown and the user is not logged in
    await expect(registration.emailAlreadyUsedError).toBeVisible();
    await expect(registration.accountButton).toBeHidden();
  });

  test('rejects invalid email format', async () => {
    const user = createUniqueUser();

    await registration.fillForm({...user, email: 'milicaradovic'});
    await registration.acceptRequiredConsents();
    await registration.submit();

    // the field is invalid according to browser validation
    await expect(registration.email).toHaveJSProperty('validity.valid', false);

    await expect(registration.form).toBeVisible();
    await expect(registration.accountButton).toBeHidden();
  });

  test('does not register without accepting required consents', async () => {
    const user = createUniqueUser();

    await registration.fillForm(user);
    await registration.submit();

    await expect(registration.privacyCheckbox).toHaveJSProperty('validity.valid', false);
    await expect(registration.termsCheckbox).toHaveJSProperty('validity.valid', false);

    await expect(registration.form).toBeVisible();
    await expect(registration.accountButton).toBeHidden();
  });

  test('rejects first name containing digits', async () => {
    const user = createUniqueUser();

    await registration.fillForm({...user, firstName: 'Milica123'});
    await registration.acceptRequiredConsents();
    await registration.submit();

    await expect(registration.invalidFormatError).toBeVisible();

    await expect(registration.form).toBeVisible();
    await expect(registration.accountButton).toBeHidden();
  });

  test('rejects password shorter than 8 characters', async () => {
    const user = createUniqueUser();

    await registration.fillForm({...user, password: 'milica'});
    await registration.acceptRequiredConsents();
    await registration.submit();

    await expect(registration.password).toHaveJSProperty('validity.valid', false);

    await expect(registration.form).toBeVisible();
    await expect(registration.accountButton).toBeHidden();
  });

  test('does not submit form with empty required fields', async () => {
    await registration.submit();

    await expect(registration.firstName).toHaveJSProperty('validity.valid', false);
    await expect(registration.lastName).toHaveJSProperty('validity.valid', false);
    await expect(registration.email).toHaveJSProperty('validity.valid', false);
    await expect(registration.password).toHaveJSProperty('validity.valid', false);

    await expect(registration.privacyCheckbox).not.toBeChecked();
    await expect(registration.termsCheckbox).not.toBeChecked();

    await expect(registration.privacyCheckbox).toHaveJSProperty('validity.valid', false);
    await expect(registration.termsCheckbox).toHaveJSProperty('validity.valid', false);

    await expect(registration.form).toBeVisible();
    await expect(registration.accountButton).toBeHidden();
  });

});