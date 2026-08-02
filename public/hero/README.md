# Hero media slot

Drop a file in this folder and the homepage picks it up automatically. No code
change, no redeploy trigger beyond the normal one — just add the file, commit,
push.

## What to name it

| File | What it does |
| --- | --- |
| `hero.mp4` | **Preferred.** A short silent loop. Used if present. |
| `hero.webp` | A still image. Used only if there is no `hero.mp4`. |
| *(neither)* | Falls back to the built-in animated product loop. Nothing breaks. |

Exact paths: `public/hero/hero.mp4`, `public/hero/hero.webp`.

## Specs

- **Aspect ratio:** 16:9
- **Resolution:** 1920×1080 (2560×1440 is fine; anything smaller will look soft)
- **Video length:** 6–10 seconds, seamless loop, **no audio track**
- **File size:** keep the mp4 under ~4 MB, the image under ~400 KB — this loads
  above the fold and a heavy file costs you real visitors
- **Format:** H.264 mp4 for video, WebP for stills

## What to generate

Restrained and premium — the Linear register, not a 3D showreel. The page
already has depth, glow and scroll motion around this slot, so the asset should
sit calmly inside it rather than compete.

Prompt to work from:

> A dark, premium product scene. Soft floating panels of a business dashboard
> rendered in deep charcoal and near-black, edges catching a faint violet rim
> light. Shallow depth of field, one panel in focus in the foreground, others
> drifting slowly out of focus behind it. Subtle volumetric haze. Slow, minimal
> camera drift — a few degrees only. No text, no logos, no faces, no hands.
> Cinematic, restrained, expensive. Dark background, high contrast, muted
> palette with a single violet accent.

Notes on why those constraints:

- **No text or logos** in the generated image. Generated text comes out
  misspelled, and the headline sits directly over this area.
- **No faces or hands.** They date fast and pull attention off the product.
- **Slow motion only.** Fast motion behind a headline makes the copy unreadable
  and reads as cheap.
- **Dark, violet accent.** It has to sit against `--color-bg` and the existing
  accent, or the hero will look like two different websites stacked.

## Checking it worked

After adding the file, load the homepage and confirm the hero shows your asset
instead of the animated fallback. If you still see the fallback, the filename or
folder is wrong — it is case-sensitive.
