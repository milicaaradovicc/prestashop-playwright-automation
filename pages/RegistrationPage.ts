import { Page, FrameLocator, Locator } from '@playwright/test';

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class RegistrationPage {
  readonly shop: FrameLocator;

  // header
  readonly signInLink: Locator;
  readonly createAccountLink: Locator;
  readonly accountButton: Locator;

  // form
  readonly form: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly privacyCheckbox: Locator;
  readonly termsCheckbox: Locator;
  readonly submitButton: Locator;

  // result
  readonly formError: Locator;
  readonly signOutLink: Locator;

  constructor(private readonly page: Page) {
    this.shop = page.frameLocator('#framelive');

    this.signInLink = this.shop.locator('a.header-block__action-btn[aria-label="Sign in"]');
    this.createAccountLink = this.shop.locator('a[data-link-action="display-register-form"]');
    this.accountButton = this.shop.locator('#userMenuButton');

    this.form = this.shop.locator('#customer-form');
    this.firstName = this.form.locator('input[name="firstname"]');
    this.lastName = this.form.locator('input[name="lastname"]');
    this.email = this.form.locator('input[name="email"]');
    this.password = this.form.locator('input[name="password"]');
    this.privacyCheckbox = this.form.locator('input[name="customer_privacy"]');
    this.termsCheckbox = this.form.locator('input[name="psgdpr"]');
    this.submitButton = this.form.getByRole('button', { name: 'Create account', exact: true });

    this.formError = this.shop.locator('.alert-danger, .help-block');
    this.signOutLink = this.shop.getByRole('link', { name: /sign out/i });
  }

  async open() {
    await this.page.goto('/');
    await this.signInLink.click({ timeout: 60_000 });
    await this.createAccountLink.click();
  }

  async fillForm(data: RegistrationData) {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.email.fill(data.email);
    await this.password.fill(data.password);
  }

  async acceptRequiredConsents() {
    await this.privacyCheckbox.check();
    await this.termsCheckbox.check();
  }

  async submit() {
    await this.submitButton.click();
  }

  async register(data: RegistrationData) {
    await this.fillForm(data);
    await this.acceptRequiredConsents();
    await this.submit();
  }
}