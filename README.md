# Piedmont Environmental — Landscape Design &amp; Consultation

A standalone marketing website for Matthew Arnsberger's semi-retired landscape
design &amp; consultation practice, serving homeowners in the Chapel Hill / Carrboro, NC area.

Clean, modern, rustic theme ("forest &amp; stone") with subtle, nature-inspired
animations. No build step — plain HTML, CSS, and vanilla JS.

## Structure

```
index.html                     One-page scroll: hero, about, consultation & design,
                               gallery, past experience, articles, reviews, contact
past-installations.html        Past-experience sub-page
past-deer-fences.html          Past-experience sub-page (photo lightbox)
past-invasive-control.html     Past-experience sub-page
articles/                      3 recreated articles (publish dates removed)
  watering-new-plantings.html
  coyotes-in-our-neighborhoods.html
  how-to-eat-a-persimmon.html
logos.html                     The 4 logo options that were offered (Sprout Tile chosen)
css/style.css                  Design tokens, layout, components, animations
js/main.js                     Scroll reveals, scroll-reactive vine, lightbox,
                               testimonial carousel, mobile nav, drifting leaves
assets/logos/                  logo.svg (chosen), mark.svg, favicon, + 4 options
assets/img/                    Web-optimized WebP imagery
```

## Notes

- Contact is **email only** (matthew@piedmont-environmental.com); no phone numbers.
- No pricing / hourly rates are shown.
- Installations, deer fences, and invasive control are framed as **past experience**;
  current offering is consultation &amp; design only.
- All animations respect `prefers-reduced-motion`.
- Images were optimized from local originals to WebP (responsive max-widths).

## Run locally

Any static server works, e.g.:

```
python3 -m http.server 8137
```

then open http://localhost:8137/
