# Selected Work Detail Architecture

## Status

**Master reference:** `personal-brand.html` in production.

**Preview implementation branch:** `preview/selected-work-detail-architecture`

**Production rule:** do not merge or deploy these changes until an explicit `deploy` instruction is given.

The three Selected Work detail pages are one visual system. Personal Brand is the master. Local Business Storytelling and Long-Form Visual Storytelling must reproduce the same architecture, page rhythm, typography, card construction, responsive behavior and navigation pattern. Only project-specific words and imagery change.

---

## 1. Source of truth

The approved Personal Brand page establishes the system through:

- `personal-brand.html`
- `styles.css`
- approved palette overrides in `assets/css/part-8.css`

The two other detail pages use a shared architecture stylesheet:

- `assets/css/selected-work-detail-template.css`

That stylesheet reproduces the **final rendered Personal Brand geometry**, including the later mobile normalization rules in `styles.css`. Personal Brand itself is not refactored or modified.

---

## 2. Global visual system

### Typeface

- **Inter** throughout.
- No serif typefaces.
- No alternate display font.
- Display hierarchy comes from size, weight, line-height and tracking rather than font changes.

### Approved palette

- Background: `#F4EFE6`
- Main text / dark blue: `#20364A`
- Dusty rose: `#D87B89`
- Mist blue: `#D8E9EE`
- Soft lilac: `#C7B6DD`
- Muted green: `#7E9C86`
- Button blue: `#326E8B`
- Accent purple: `#69418C`
- Surface: inherited `#FFFDF9`
- Strong surface / cream card: inherited `#FFFAF1`

### Container

Desktop/tablet global container:

- Width: `min(calc(100% - 48px), 1220px)`

Final mobile detail-page container:

- Width: `min(calc(100% - 28px), 1220px)`

---

## 3. Page sequence — must remain identical

Every Selected Work detail page follows this exact reading sequence:

1. Sticky global header.
2. Hero: eyebrow + large statement/question on the left, portrait/cover composition on the right.
3. Four asymmetric concept cards in a 2 × 2 editorial arrangement.
4. First deep-dive row: large H2 on the left + cream statement card with coloured underlay on the right.
5. Second deep-dive/context row: large H2 on the left + cream statement card with coloured underlay on the right.
6. Thin divider + one text navigation link.
7. No separate project-template facts strip, gallery template, episode grid or project-list layout.
8. No footer on these detail pages, matching the current approved Personal Brand page.

The architecture is the constant. Project content is the variable.

---

## 4. Hero — desktop

Section:

- Padding: `68px 0 86px`
- No top border.

Grid:

- Columns: `minmax(0, 1.08fr) 420px`
- Gap: `clamp(48px, 5vw, 78px)`
- Minimum height: `650px`
- Vertical alignment: center

Text column:

- Intro max width: `720px`
- Eyebrow bottom margin: `20px`
- Eyebrow size: `clamp(1rem, 1.2vw, 1.12rem)`
- Eyebrow tracking: `.13em`

Main display statement:

- Max width: `690px`
- Size: `clamp(3.5rem, 6.4vw, 6.3rem)`
- Line-height: `.94`
- Letter-spacing: `-.058em`
- Balanced text wrapping

### Hero visual stack

Overall visual:

- Width: `420px`
- Height: `559px`
- Aligned to the right on desktop

All three layers share:

- Width: `420px`
- Height: `559px`
- Radius: `40px 21px 40px 21px`

Upper/right coloured underlay:

- Dusty rose
- Offset: `+30px / -24px`
- Rotation: `4.5deg`

Lower/left coloured underlay:

- Soft lilac
- Offset: `-25px / +22px`
- Rotation: `-3.8deg`

Front image card:

- Border: `5px solid var(--bg)`
- Background: surface
- Shadow: `0 24px 48px rgba(32, 54, 74, .14)`
- Image: `object-fit: cover`

---

## 5. Four concept cards — desktop

Core section:

- Padding: `82px 0 54px`

Grid:

- Two equal columns
- Max width: `1120px`
- Column gap: `clamp(68px, 8vw, 118px)`
- Row gap: `48px`

Base card:

- Minimum height: `226px`
- Padding: `46px 48px 42px`
- Radius: `34px 17px 34px 17px`
- Front layer: strong cream surface
- Front border: `1px solid rgba(184, 170, 156, .48)`
- Front shadow: `0 18px 38px rgba(32, 54, 74, .09)`

Card heading:

- Size: `clamp(2.15rem, 3.2vw, 3rem)`
- Line-height: `1.01`
- Letter-spacing: `-.045em`

Card body:

- Max width: `430px`
- Top margin: `22px`
- Size: `clamp(1.22rem, 1.8vw, 1.55rem)`
- Weight: `500`
- Line-height: `1.36`

### Fixed four-card colour order

1. Accent purple
2. Muted green
3. Dusty rose
4. Button blue

### Fixed asymmetric placement

Card 1 underlay:

- `translate(-18px, -15px) rotate(-2.4deg)`

Card 2:

- Card top offset: `38px`
- Underlay: `translate(18px, 14px) rotate(2.8deg)`

Card 3:

- Width: `88%`
- Top offset: `10px`
- Left offset: `clamp(38px, 5vw, 70px)`
- Underlay: `translate(-16px, 16px) rotate(2.2deg)`

Card 4:

- Width: `94%`
- Top offset: `28px`
- Right aligned
- Underlay: `translate(17px, 15px) rotate(2.6deg)`

---

## 6. First deep-dive row — desktop

Grid:

- Columns: `minmax(0, 1fr) 500px`
- Gap: `clamp(56px, 7vw, 92px)`
- Max width: `1120px`
- Top margin: `96px`
- Top padding: `68px`
- Top border: `1px solid var(--line)`
- Vertical alignment: center

H2:

- Size: `clamp(2.45rem, 4.6vw, 4.55rem)`
- Line-height: `.98`
- Letter-spacing: `-.052em`
- Left title block max width: `520px`

Statement card:

- Width: `500px`
- Minimum height: `226px`
- Padding: `46px 48px 42px`
- Radius: `34px 17px 34px 17px`
- Front cream card construction matches concept cards
- Default text accent: purple
- Default underlay: soft lilac
- Underlay transform: `translate(-18px, -15px) rotate(-2.4deg)`

Statement body:

- Max width: `410px`
- Size: `clamp(1.05rem, 1.35vw, 1.22rem)`
- Weight: `560`
- Line-height: `1.42`

Emphasis line:

- Top margin: `22px`
- Size: `clamp(1.35rem, 1.85vw, 1.62rem)`
- Weight: `800`
- Line-height: `1.25`
- Letter-spacing: `-.022em`

---

## 7. Second deep-dive/context row — desktop

Section:

- Top border: `1px solid var(--line)`
- Padding: `50px 0 50px`

Grid:

- Columns: `minmax(0, 1fr) 500px`
- Gap: `clamp(56px, 7vw, 92px)`
- Max width: `1120px`
- Vertical alignment: center

Title block:

- Max width: `560px`
- H2 uses the same final normalized scale as the first deep-dive H2:
  - `clamp(2.45rem, 4.6vw, 4.55rem)`
  - line-height `.98`
  - letter-spacing `-.052em`

Context statement card:

- Same `500px × min 226px` cream-card construction
- Dusty-rose text accent
- Dusty-rose underlay
- Underlay transform: `translate(18px, 15px) rotate(2.4deg)`

Bottom link row:

- Top margin: `38px`
- Top padding: `22px`
- Top border: `1px solid var(--line)`
- Link colour: accent purple
- Link size: `clamp(1.15rem, 1.7vw, 1.4rem)`

---

## 8. Tablet — max-width 1050px

Hero:

- Padding: `54px 0 70px`
- One column
- Gap: `34px`
- Remove hero minimum height
- Intro max width: `820px`
- Visual centered

Core:

- Padding: `72px 0 52px`
- Concept column gap: `44px`
- Cards min height: `214px`
- Card padding: `40px 38px 36px`
- Cards 3 and 4 return to `width: 100%`; left offset removed

Deep-dive and context:

- One column
- Gap: `42px`
- First deep-dive top margin: `82px`
- First deep-dive top padding: `58px`
- Text blocks max width: `720px`
- Statement card width: `min(500px, 100%)`
- Statement card aligned left
- Context padding: `48px 0 52px`
- Bottom link top margin: `36px`
- Bottom link top padding: `22px`

---

## 9. Mobile — max-width 700px

This is the final production Personal Brand mobile rhythm and overrides the earlier looser mobile draft.

### Container

- Side space: `14px` each side through `calc(100% - 28px)`

### Hero

- Padding: `28px 0 38px`
- Grid gap: `20px`
- Eyebrow bottom margin: `12px`
- Eyebrow size: `.86rem`
- Eyebrow tracking: `.12em`
- Main statement max width: `15ch`
- Main statement size: `32px`
- Line-height: `.99`
- Letter-spacing: `-.043em`

Hero visual:

- `250px × 334px`
- Top margin: `4px`
- Radius: `28px 14px 28px 14px`
- Rose underlay: `translate(+16px, -12px) rotate(3.6deg)`
- Lilac underlay: `translate(-14px, +12px) rotate(-2.8deg)`
- Front border: `4px`
- Shadow: `0 16px 28px rgba(32, 54, 74, .10)`

### Four cards

Core padding:

- `34px 0 28px`

Grid:

- One column
- Row gap: `20px`

Each card:

- Width: `100%`
- No minimum height
- No desktop margins/offset widths
- Padding: `21px 20px 20px`
- Radius: `22px 12px 22px 12px`

Underlays:

- Odd cards: `translate(-5px, -4px) rotate(-.9deg)`
- Even cards: `translate(5px, 4px) rotate(.9deg)`

Card heading:

- `25px`
- Line-height `1.03`
- Letter-spacing `-.04em`

Card body:

- Top margin `9px`
- `16px`
- Line-height `1.38`

### First deep-dive

- Gap: `16px`
- Top margin: `32px`
- Top padding: `27px`

H2:

- `28px`
- Line-height `1.02`
- Letter-spacing `-.04em`

Statement card:

- Width `100%`
- No minimum height
- Padding `21px 20px 20px`
- Radius `22px 12px 22px 12px`
- Underlay `translate(-5px, -4px) rotate(-.9deg)`

Statement body:

- `16px`
- Line-height `1.4`

Paragraph spacing:

- `12px`

Emphasis:

- `20px`
- Line-height `1.25`

### Second context row

- Section padding: `26px 0 24px`
- Grid gap: `16px`
- H2: same `28px / 1.02 / -.04em`
- Context underlay: `translate(5px, 4px) rotate(.9deg)`

Bottom link:

- Top margin: `18px`
- Top padding: `14px`
- Link size: `16px`

---

## 10. Content rules for the two transferred pages

### Local Business Storytelling

Current preview content is intentionally limited to facts already present on the existing Forest City Spotlight page:

- Forest City Spotlight
- Local Business Storytelling
- short-form social video
- London, Ontario
- `@forestcityspotlight`
- public credit: `Filmed and Edited by Mikhail Kirs / @mikki.kirs6haa`
- current golf-course episode wording

Hero image in the architecture preview:

- `assets/images/selected-work/Local_Cover.png`

No new business names, responsibilities, strategy claims, metrics or production roles are to be invented.

### Long-Form Visual Storytelling

Current preview content is intentionally limited to wording already present on the existing page:

- research
- scripting
- historical context
- visual storytelling
- longer scripts / longer story structure
- filming and final edit
- London
- Belgrade

Hero image in the architecture preview:

- `assets/images/London_Bridge.jpeg`

No additional responsibilities, research methods, historical claims or project outcomes are to be invented.

---

## 11. Non-negotiable architecture rule

When copy or images are revised later, **do not redesign the page**.

Allowed changes:

- eyebrow wording
- H1 wording
- four card headings and descriptions
- deep-dive H2 wording
- statement-card wording
- hero image / project-specific image crop
- final text-link destination and label

Not allowed without separate approval:

- new section order
- changing number of concept cards
- new grid systems
- replacing asymmetric cream cards
- alternate typography
- different breakpoint logic
- desktop-only composition collapsed mechanically for mobile
- adding generic agency-style services/facts/gallery blocks
- modifying approved Personal Brand architecture as part of this work
