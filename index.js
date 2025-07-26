import { firefox } from 'playwright';

function getInput(name, opts) {
  const val = process.env[`INPUT_${name.toUpperCase()}`];
  if (opts && opts.required && !val) {
    throw new Error(`Required input is missing: ${name}`);
  }
  if (opts && opts.list) {
    return val.split('\n').map((i) => i.trim());
  }
  return val.trim();
}

const login = getInput('login', { required: true });
const password = getInput('password', { required: true });
const appName = getInput('app-name', { required: true });
const rpms = getInput('rpms', { required: true }).split(/\r?\n/);
const dryRun = getInput('dry-run') === 'true';

if (dryRun) {
  console.warn('Doing dry run ...');
}

(async () => {
  const browser = await firefox.launch({
    headless: true,
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  console.info('📦 Opening webpage ...');
  await page.goto('https://openrepos.net/');

  console.info('🔑 Login ...');
  await page.getByRole('textbox', { name: 'Username or e-mail *' }).fill(login);
  await page.getByRole('textbox', { name: 'Password *' }).fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();

  console.info('📱 Open app page ...');
  await page.goto(`https://openrepos.net/content/${login}/${appName}`);

  console.info('✏️ Start editing app ...');
  await page.getByRole('link', { name: 'Edit', exact: true }).click();

  console.info('📦 Uploading files ...');
  await page
    .getByRole('group', { name: 'Application versions' })
    .getByLabel('Add a new file')
    .setInputFiles(rpms);
  await page.locator('[id^="edit-field-packages-und-"][id$="-upload-button"]').click();

  if (!dryRun) {
    console.info('💾 Saving changes ...');
    await page.getByRole('button', { name: 'Save' }).click();
    console.info(`✅ New RPMs ready at https://openrepos.net/content/${login}/${appName}`);
  } else {
    console.info('🔎 Previewing changes ...');
    await page.getByRole('button', { name: 'Preview' }).click();
    console.info(`✅ Dry run successfully finished`);
  }

  // ---------------------
  await context.close();
  await browser.close();
})();
