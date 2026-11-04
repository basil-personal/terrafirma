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

## Custom domain: getterrafirma.com

Pages currently publishes at https://basil-personal.github.io/terrafirma/. Relative links support both this project URL and the custom domain.

In Namecheap, open Domain List → getterrafirma.com → Manage → Advanced DNS. Configure these Host Records with Automatic TTL:

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | basil-personal.github.io |

Replace conflicting parking/redirect/address records for `@` and `www`. Preserve email-related MX/TXT records. These instructions apply when Namecheap manages the domain's DNS.

Once DNS is ready, set the custom domain to `getterrafirma.com` in Repository Settings → Pages. After GitHub issues the certificate, enable Enforce HTTPS. Rebuild canonical metadata for the custom domain with:

```sh
SITE_ORIGIN=https://getterrafirma.com python3 build_site.py
```

GitHub adds `docs/CNAME` when the custom domain is saved. Keep that file in future commits.

## Contact and fonts

`docs/site-config.js` accepts a verified contact email for the email-draft handoff. It currently remains blank; the form reviews and copies inquiries without sending them. No private keys belong in this public file.

The current fonts are Instrument Serif and Inter. GT Sectra Display is the intended premium option once licensed webfont files are supplied.

Photography and font attribution are included on `/credits/`; font license files are in `docs/assets/licenses/`.
