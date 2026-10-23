# Verified company branding

Inspected 2026-10-23 after initial proxy denial was resolved.

Sources:
- https://bonus-in.gudweb.si/
- https://bonus-in.gudweb.si/en/home/
- https://bonus-in.gudweb.si/wp-content/themes/bonus-inzeniring/assets/home/site.css?ver=1.12.4
- https://bonus-in.gudweb.si/wp-content/themes/bonus-inzeniring/assets/home/home.css?ver=1.12.4
- https://bonus-in.gudweb.si/wp-content/themes/bonus-inzeniring/assets/home/fonts/inter.css?ver=1.12.4
- Original English logo: https://bonus-in.gudweb.si/wp-content/themes/bonus-inzeniring/assets/fw/images/brand/bonus-engineering-logo-blue.png

Downloaded the actual English logo as `assets/bonus-logo.png`, preserving aspect ratio, without redrawing. Website markup specifies 580 × 122. Local Inter Latin and Latin Extended variable fonts support weights 100–900; source font CSS identifies OFL 1.1 / rsms.me/inter. Brand assets remain company property.

Exact source values: ink #1d1d1f; secondary #6e6e73; tertiary #86868b; white #ffffff; alternate #f5f5f7; line #d2d2d7; blue #0053be; hover blue #0066e0; navy/brand #26358b; deep brand #141c4a. Website typography uses Inter 400 body, 500 actions, 600 eyebrows, 650 section headings and 700 large headings, with tight heading tracking. The site pairs generous whitespace, fine separators, soft neutral fields, rounded cards and blue actions with engineering imagery.

HMI adaptation retains the real logo, typeface, white/gray surfaces, blue actions and navy labels. Website pill buttons and large radii are reduced to an 8px card radius for compact industrial clarity. Large responsive web headings become 19px screen titles. Marketing scroll effects, glass blur, shadows and large imagery are omitted to preserve predictable panel rendering. Alarm red is a functional HMI addition, not a corporate brand color.

`assets/site-source.css` and `assets/home-source.css` preserve the inspected CSS for traceability; they are not loaded as HMI styles. All runtime assets are local.
