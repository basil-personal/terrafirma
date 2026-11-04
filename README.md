# TerraFirma

AI-powered mineral management, delivered as a managed service.

## Hosting

GitHub Pages publishes `docs/` from `main`. No package installation or build service is required.

## Updating the site

Edit `build_site.py` for page content, `docs/style.css` for design, and `docs/script.js` for interactions. Run:

```sh
python3 build_site.py
```

Commit the updated source and `docs/`. GitHub Pages publishes the update automatically.

## Custom domain

The default build targets the GitHub project path `/terrafirma/`. Once getterrafirma.com is configured in GitHub Pages and DNS, rebuild with:

```sh
SITE_ORIGIN=https://getterrafirma.com SITE_BASE_PATH='' python3 build_site.py
```

Then add `docs/CNAME` containing `getterrafirma.com`. Do not configure the CNAME before the domain is ready.

## Contact and fonts

`docs/site-config.js` accepts a verified contact email for the email-draft handoff. It currently remains blank; the form reviews and copies inquiries without sending them. No private keys belong in this public file.

The current fonts are Instrument Serif and Inter. GT Sectra Display is the intended premium option once licensed webfont files are supplied.

Photography and font attribution are included on `/credits/`; font license files are in `docs/assets/licenses/`.
