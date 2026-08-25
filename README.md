# Mikhail Kirs — Portfolio

Static portfolio website for Mikhail Kirs, a London, Ontario–based Video Content Producer focused on Personal Brand Content, Local Business Storytelling, long-form city work and visual communication.

## Production pages

- `index.html` — home, selected work, about and contact
- `personal-brand.html` — Personal Brand Content and municipal campaign work
- `project-forest-city.html` — Local Business Storytelling / Forest City Spotlight
- `project-city-storytelling.html` — Long-Form Visual Storytelling
- `privacy.html` — privacy policy for the website and contact form

## Technology

The site is intentionally lightweight: semantic HTML, responsive CSS and small JavaScript modules for progressive enhancement such as motion, the shared footer and the contact dialog. Core page content and navigation are present in HTML and do not depend on JavaScript-generated markup.

The contact form and inbound email handling run as Vercel serverless endpoints under `api/` and use Resend through environment variables. Secrets must never be committed to the repository.

## Deployment

Production is deployed from `main` through Vercel. Preview work should be developed and verified on a non-production branch before merging to `main`.

## Source-of-truth rule

Professional positioning, project responsibilities, credits and results are verified before they are stated publicly. Private research, internal documents and sensitive material must not be copied into this public repository.
