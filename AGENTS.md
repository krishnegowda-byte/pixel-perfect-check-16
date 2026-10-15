<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Catalogue data lives in src/data/*.json, exported from the live WooCommerce Store API; regenerate rather than hand-edit, so it stays the source of truth.
- Page URLs mirror the old WordPress site (/product/<slug>, /product-category/<path>, /about-us, /contact-us) so links and SEO carry over; old paths that changed get redirect routes.
- Enquiries go through a validated server function into the enquiries table (insert-only for visitors) — never write to it from the browser.
