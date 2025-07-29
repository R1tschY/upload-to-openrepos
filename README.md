# Upload RPM packages to [openrepos.net](https://openrepos.net)
*in GitHub CI with Playwright*

## Description

This GitHub Action automates the process of uploading RPM packages to [OpenRepos.net](https://openrepos.net), a community repository for
mobile applications. It uses Playwright to automate browser interactions, logging into your OpenRepos account and 
uploading specified RPM files to your application page.

## Prerequisites

- An account on [OpenRepos.net](https://openrepos.net)
- An existing application on OpenRepos where you want to upload RPM packages
- RPM package files ready for upload

## Inputs

| Input       | Description                                      | Required | Default |
|-------------|--------------------------------------------------|----------|---------|
| `login`     | Username or e-mail of OpenRepos.net account      | Yes      | -       |
| `password`  | Corresponding Password                           | Yes      | -       |
| `app-name`  | Application name as it appears in OpenRepos URL  | Yes      | -       |
| `rpms`      | RPM file names delimited by new lines            | Yes      | -       |

## Usage

Add the following to your GitHub workflow file:

```yaml
name: Upload RPMs to OpenRepos.net

on:
  release:
    types: [published]

jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - name: Upload to OpenRepos
        uses: R1tschY/upload-to-openrepos@v1
        with:
          login: ${{ vars.OPENREPOS_USERNAME }}
          password: ${{ secrets.OPENREPOS_PASSWORD }}
          app-name: 'your-app'
          rpms: |
            ./RPMS/your-app-1.0.0.armv7hl.rpm
            ./RPMS/your-app-1.0.0.aarch64.rpm
```

## Security Notes

- It's recommended to store your OpenRepos credentials as GitHub secrets
- The action uses a headless browser to interact with OpenRepos.net

## How It Works

1. The action launches a Firefox browser using Playwright
2. It logs into OpenRepos.net with the provided credentials
3. Navigates to your application page
4. Uploads the specified RPM files
5. Saves the changes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
