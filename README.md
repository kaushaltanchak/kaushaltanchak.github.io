# ShopDev

Static, multi-page ShopDev website built with semantic HTML, CSS and vanilla JavaScript. The site runs directly on GitHub Pages with no production build step, server runtime or backend.

## Pages

- Home: `/`
- Work index and nine case studies: `/work` and `/work/<project>`
- Services index and four service pages: `/services` and `/services/<service>`
- About: `/about`
- Contact: `/contact`

## Preview locally

From the repository root, run:

```powershell
python -m http.server 8000
```

Then open the local address printed by the server. This server is only for preview; GitHub Pages serves the files directly.

## Contact form

The contact form validates in the browser and submits inquiries asynchronously to Web3Forms. Set the public ShopDev Web3Forms access key in `js/contact-config.js` before publishing; submissions are delivered by Web3Forms and are not stored by this static site.

## Publish with GitHub Pages

Publish the repository root as the site source. The `CNAME` file points to `shopdev.studio`; keep the matching DNS records at the domain registrar and HTTPS enabled in the repository’s Pages settings. `robots.txt`, `sitemap.xml`, `.nojekyll`, GA4 and canonical metadata are retained for production. Internal links and canonical URLs use slashless paths. GitHub Pages currently redirects directory-index paths (for example `/contact`) to `/contact/`; serving those parent routes without a slash while retaining nested `/work/<project>` and `/services/<service>` routes requires host-level rewrites that GitHub Pages does not provide.

## Assets and project links

Images used by the site are stored under `assets/`. Each case study links to its corresponding live project site. The project copy uses the source repository’s verified content and does not add unverified results or metrics.
