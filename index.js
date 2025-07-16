import { firefox } from 'playwright';
import { parseArgs } from 'node:util';

const options = {
  username: {
    type: 'string',
    short: 'u',
    default: process.env.OPENREPOS_USERNAME,
  },
  password: {
    type: 'string',
    short: 'p',
    default: process.env.OPENREPOS_PASSWORD,
  },
  appname: {
    type: 'string',
    short: 'a',
    default: process.env.OPENREPOS_APPNAME,
  },
  ['dry-run']: { type: 'boolean' },
  rpm: { type: 'string', multiple: true },
  rpms: { type: 'string', multiple: true },
};

const values = parseArgs({ options });
const {
  userName,
  password,
  appname: appName,
  rpm,
  rpms,
  ['dry-run']: dryRun,
} = values;

for (const key of ['username', 'password', 'appname']) {
  if (
    !values[key] ||
    (Array.isArray(values[key]) && values[key].length === 0)
  ) {
    throw new Error(`--${key} is required`);
  }
}

const all_rpms = [];
if (rpm) {
  all_rpms.push(...rpm);
}
if (rpms) {
  all_rpms.push(...rpms);
}
if (all_rpms.length === 0) {
  throw new Error('No RPMs specified');
}

(async () => {
  const browser = await firefox.launch({
    headless: true,
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
    .setInputFiles(all_rpms);
  await page.locator('#edit-field-packages-und-25-upload-button').click();
  if (!dryRun) {
    await page.getByRole('button', { name: 'Save' }).click();
  }

  // ---------------------
  await context.close();
  await browser.close();
})();
