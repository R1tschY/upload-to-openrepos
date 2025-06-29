import { firefox } from 'playwright';
import { parseArgs } from 'node:util';

const options = {
  username: { type: 'string', short: 'u' },
  password: { type: 'string', short: 'p' },
  appName: { type: 'string', short: 'a' },
  rpm: { type: 'string', multiple: true }, // Allows multiple RPM paths
};

const {
  values: { userName, password, appName, rpm },
} = parseArgs({ options });

for (const key of Object.keys(options)) {
  if (
    !values[key] ||
    (Array.isArray(values[key]) && values[key].length === 0)
  ) {
    throw new Error(`--${key} is required`);
  }
}

(async () => {
  const browser = await firefox.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://openrepos.net/');
  await page
    .getByRole('textbox', { name: 'Username or e-mail *' })
    .fill(userName);
  await page.getByRole('textbox', { name: 'Password *' }).fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.goto(`https://openrepos.net/content/${userName}/${appName}`);
  await page.getByRole('link', { name: 'Edit', exact: true }).click();
  await page
    .getByRole('group', { name: 'Application versions' })
    .getByLabel('Add a new file')
    .setInputFiles(rpm);
  await page.locator('#edit-field-packages-und-25-upload-button').click();
  await page.getByRole('button', { name: 'Save' }).click();

  // ---------------------
  await context.close();
  await browser.close();
})();
