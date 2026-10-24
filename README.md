# PrestaShop Register Tests

This is my solution for the Junior SDET assignment. I automated the Register page of the PrestaShop demo (https://demo.prestashop.com/) with Playwright and TypeScript.

## How to run

You need Node.js and npm.

    npm install
    npx playwright install
    npx playwright test

To open the report after the run:

    npx playwright show-report

If you want to see the browser while the tests run, add '--headed'.

## Project structure

- 'pages/RegistrationPage.ts' has the locators and actions for the page
- 'utils/testData.ts' creates a new unique user for every test
- 'tests/register.spec.ts' has the test scenarios
- 'playwright.config.ts' has the base URL and timeout

## What I tested

I started by exploring the form manually and then picked the cases that I think matter most for a new customer. I did not want many similar tests, so I chose one test for each rule.

1. Registration form opens and all fields are visible
2. User registers successfully with valid data
3. Error is shown when the email is already registered
4. Invalid email format is rejected
5. Registration is blocked when the required checkboxes are not accepted
6. First name with digits is rejected
7. Password shorter than 8 characters is rejected
8. Form is not submitted when the required fields are empty

I think the successful registration and the duplicate email are the most important ones, because they are the main flow and a common real problem. In the negative tests I also check that the user is not logged in, not only that an error appears.

## Problems I found while building it

- The whole shop is inside an iframe ('#framelive'), so every locator goes through it.
- Every time I open the demo, it creates a new shop with an empty database. Because of this, the duplicate email test registers, signs out and registers again in the same session. If I reloaded the page, the user would not exist anymore.
- Some links, like 'Sign in', appear more than once on the page. I made the locators more specific to avoid strict mode errors.
- The email and checkbox errors are shown by the browser, not by the page, so I could not find the message text in the page. I check the 'validity' of the field instead.
- The demo is slow to start, so I increased the test timeout.

## What I did not cover

- Optional fields (social title, birthdate, newsletter, partner offers)
- Password strength, only the minimum length is tested
- Special characters and maximum length in names
- Other browsers, I only use Chromium to keep the tests stable

## What I would improve in a real project

In a real project I would not use the public demo, because it is slow and can be unstable. I would ask for a clean test environment that starts fast. I would also ask the developers to add 'data-testid' attributes, so the locators do not depend on text and classes. To prepare the test data, I would create users through an API instead of the UI, so the tests are faster and more independent. Finally, I would run the tests in CI on every pull request and add Firefox and WebKit.

## Exploratory testing

I found three issues while exploring the demo. They are in [BUG_REPORTS.md](BUG_REPORTS.md).