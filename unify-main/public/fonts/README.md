# Unify — Self-hosted Fonts

Drop the following `.woff2` files into this folder to make the library fully self-contained (no CDN dependency):

**Rowdies** — https://fonts.google.com/specimen/Rowdies
- `Rowdies-Light.woff2` (300)
- `Rowdies-Regular.woff2` (400)
- `Rowdies-Bold.woff2` (700)

**Arimo** — https://fonts.google.com/specimen/Arimo
- `Arimo-Regular.woff2` (400)
- `Arimo-Medium.woff2` (500)
- `Arimo-SemiBold.woff2` (600)
- `Arimo-Bold.woff2` (700)

`@font-face` rules are declared in `styles/fonts.css`. Once the files are in place, the Google Fonts `<link>` in `app/layout.tsx` can be removed.
