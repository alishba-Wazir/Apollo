# DESIGN.md: Glass UI System (Yellow / Black / White, Light + Dark)

This is the single source of truth for the look of the whole project (every page, not just the dashboard).
Your message ended mid-sentence, so this file covers everything discussed in this conversation: theme, glass cards, buttons, dropdowns, sidebar, icons, charts, layout and rules for AI coding agents. Tell me if anything is missing.

---

## 0. Rules for AI agents (read first)

1. Apply this file to **ALL pages and shared components**, not only the dashboard. List every file you changed.
2. **Never hard-code colors.** Use only the CSS variables from `src/styles/theme.css` (section 14).
3. Reuse the shared building blocks: `.glass` card, `.btn` / `.btn.primary`, the sidebar `.rail`, the glass dropdown `.menu`, Lucide icons. Do not create new variants.
4. Every new page must work in **both** `.theme-dark` and `.theme-light`.
5. Import `theme.css` once at the app root. Do not copy token values into page files.
6. Before finishing a task, check: both themes, mobile width (390px), keyboard focus, text contrast.

---

## 1. Design concept

- **Style:** glassmorphism. Frosted translucent panels floating over soft glowing yellow light.
- **Palette:** yellow, black and white only.
- **Dark mode:** near-black background, yellow glow, white text. Inspired by a futuristic dark HUD dashboard (glowing amber charts and dials on black).
- **Light mode:** half-white background (white fading into warm cream), frosted white cards with a soft border shadow.
- **Sidebar:** the same rounded pill panel in both themes, with a logo at the top and icons below.
- **Feel:** premium, calm, sporty. Rounded corners, soft blur, one strong yellow accent.

---

## 2. Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
```

| Use | Font | Weight | Size / line |
|---|---|---|---|
| Page title (h1) | Space Grotesk | 700 | 32px / 1.1 |
| Card title (h2) | Space Grotesk | 700 | 18px / 1.2 |
| KPI number | Space Grotesk | 700 | 36px / 1 |
| Body, labels | Inter | 400-500 | 13-14px |
| Small / axis / chips | Inter | 500-600 | 12px |
| Buttons | Inter | 600 | 14px (13px small) |

---

## 3. Color tokens

Yellow is an accent **fill**, not body text (yellow text on white fails contrast). Text is white in dark mode and near-black in light mode.

| Token | Dark | Light |
|---|---|---|
| `--accent` | #FFD60A | #FFCC00 |
| `--bg` | gradient #070708 to #111008 to #1a1708 | gradient #fff to #fcfaf1 to #f2edd8 (half white) |
| `--text` | #ffffff | #111111 |
| `--muted` | rgba(255,255,255,.66) | #55554d |
| `--card` | rgba(255,255,255,.065) | rgba(255,255,255,.62) |
| `--card-border` | rgba(255,255,255,.15) | rgba(255,255,255,.95) |
| `--line` | rgba(255,255,255,.12) | rgba(17,17,17,.10) |
| `--chip` | rgba(255,214,10,.16) | rgba(255,204,0,.35) |
| `--on-accent` | #0b0b0c | #111111 |

Full values are in section 14.

---

## 4. Shape, spacing, depth

- Radius: cards 24px, buttons 14px, menu 16px, menu items 10px, sidebar pill 38px, chips 999px.
- Spacing scale: 6, 10, 14, 18, 20, 22, 24px. Card padding 20-22px. Gap between cards 18px. Page padding 24px.
- Glass blur: `blur(22px) saturate(160%)` on cards and menus, `blur(14px)` on buttons.
- Every glass surface has: a 1px translucent border, a soft outer shadow, and a 1px inner top highlight.
- **Light orbs:** glass needs something to blur. Keep 2-3 blurred yellow circles fixed behind the page (`.orb`, 520-560px, `blur(100px)`).

---

## 5. Glass card

```css
.glass {
  background: var(--card);
  -webkit-backdrop-filter: blur(22px) saturate(160%);
  backdrop-filter: blur(22px) saturate(160%);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  box-shadow: var(--shadow), inset 0 1px 0 var(--highlight);
}
```

All cards (KPI, charts, lists, forms, tables, modals, tooltips) use `.glass`.

---

## 6. Buttons

Frosted button with a hard offset "border shadow" behind it.

- **Default:** frosted background, thin border, light offset shadow.
- **Primary:** solid yellow, black text, stronger offset shadow.
- **Hover:** lifts up-left by 1px and the shadow grows. **Active:** presses down 2px.
- **Light mode:** the border is soft (14% black), not solid black.
- Sizes: 46px high (default), 36px (`.sm`). Minimum touch target 44px on mobile for default buttons.
- Focus ring: 3px yellow outline with 3px offset.
- Icon in button: 18px, 8px gap.

```css
.btn {
  font: 600 14px/1 Inter, system-ui, sans-serif;
  height: 46px; padding: 0 20px; border-radius: 14px; cursor: pointer;
  color: var(--text);
  background: var(--btn-bg);
  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
  border: 1.5px solid var(--btn-border);
  box-shadow: var(--btn-shadow);
  transition: transform .15s, box-shadow .15s;
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
}
.btn:hover  { transform: translate(-1px,-1px); box-shadow: var(--btn-hover-shadow); }
.btn:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 rgba(0,0,0,.3); }
.btn.primary { background: var(--accent); color: var(--on-accent); border-color: var(--btn-primary-border); box-shadow: var(--btn-primary-shadow); }
.btn.sm { height: 36px; padding: 0 14px; font-size: 13px; }
.btn:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
```

---

## 7. Dropdowns and selects (follow the theme)

**Use the custom glass dropdown everywhere** (button + frosted list). A native `<select>` list is drawn by the browser: it follows dark/light through `color-scheme` but can never be frosted.

- Trigger: a `.btn` with a chevron-down icon (18px).
- Panel: frosted glass (`--menu-bg`), 16px radius, 6px padding, min-width 210px, 8px below the trigger.
- Item: 10px 12px padding, 10px radius. Hover/focus = `--menu-hover` (soft yellow). Selected = solid `--accent` with a check icon.
- Behavior: opens on click; closes on outside click, Escape and after selecting; Arrow Up/Down move focus; Enter/Space select. Use `role="listbox"`, `role="option"`, `aria-expanded`, `aria-selected`.
- Same recipe for context menus, popovers, autocomplete lists and chart tooltips.

```css
.menu { position:absolute; top:calc(100% + 8px); right:0; z-index:20; margin:0; padding:6px; min-width:210px; list-style:none;
  background: var(--menu-bg);
  -webkit-backdrop-filter: blur(22px) saturate(160%); backdrop-filter: blur(22px) saturate(160%);
  border: 1px solid var(--card-border); border-radius: 16px; box-shadow: var(--menu-shadow); color: var(--text); }
.menu-item { display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-radius:10px; font:500 14px Inter,sans-serif; cursor:pointer; }
.menu-item:hover, .menu-item:focus-visible { background: var(--menu-hover); outline:none; }
.menu-item[aria-selected="true"] { background: var(--accent); color: var(--on-accent); }

select.native { background:var(--btn-bg); color:var(--text); border:1.5px solid var(--btn-border); border-radius:14px; height:46px; padding:0 14px; box-shadow:var(--btn-shadow); font:600 14px Inter,sans-serif; }
select.native option { background:var(--menu-bg); color:var(--text); }
```

---

## 8. Left sidebar (same in both themes)

A rounded glass pill, 76px wide, `border-radius: 38px`, sticky on the left.

Order, top to bottom:
1. Logo tile (44px, yellow, 14px radius, soft glow). Replace "TF" with the real logo.
2. Expand chevron button.
3. Divider line.
4. Group 1: Dashboard, Invoices.
5. Group 2: Members, Workouts, Staff.
6. Group 3: Payments, Plans, QR check-in.
7. Group 4: Schedule, Equipment.
8. Flexible spacer, then Settings at the bottom.

Groups are separated by a 10px gap. Each item is a 48x48 button, 16px radius.
States: default = `--muted`; hover = `--chip` background; **active = solid `--accent` with `--on-accent` icon**.
Every item needs an `aria-label`. On screens under 720px the pill becomes a horizontal scrolling bar.

```css
.rail { width:76px; border-radius:38px; padding:18px 0; display:flex; flex-direction:column; align-items:center; gap:6px; position:sticky; top:24px; min-height:calc(100vh - 48px); }
.nav { width:48px; height:48px; border-radius:16px; border:0; background:transparent; color:var(--muted); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background .15s,color .15s; }
.nav:hover { background:var(--chip); color:var(--text); }
.nav.on { background:var(--accent); color:var(--on-accent); }
@media (max-width:720px){ .rail{ flex-direction:row; width:100%; border-radius:28px; overflow-x:auto; min-height:0; position:static; } }
```

---

## 9. Icons (professional set)

Use **Lucide** only. Never hand-draw icons or mix icon families.

```bash
npm install lucide-react        # React
# or: npm install lucide-static  # plain SVG
```

| Item | Lucide icon |
|---|---|
| Dashboard | `layout-dashboard` |
| Invoices | `receipt-text` |
| Members | `users` |
| Workouts | `dumbbell` |
| Staff | `user-cog` |
| Payments | `credit-card` |
| Plans | `wallet-cards` |
| QR check-in | `qr-code` |
| Schedule | `calendar-days` |
| Equipment | `wrench` |
| Settings | `sliders-horizontal` |
| Expand menu | `chevron-right` |
| Dropdown | `chevron-down`, `check` |
| Theme toggle | `sun`, `moon` |

Rules: stroke `currentColor` (icons follow the theme); stroke width 1.75; sizes 22px (sidebar), 18px (buttons, menus); icon-only buttons need `aria-label`.

---

## 10. Charts and graphs (same palette)

Charts use the theme tokens, so they switch with the theme.

- **Line / area:** line `--chart` (yellow in dark, black in light), 3px round stroke; area fill = gradient from `--accent` (55-80% opacity) to transparent; grid lines `--line`.
- **Bars:** `--accent` fill, 5px radius, opacity steps (.35 to 1) so recent values stand out; in light mode add a thin dark outline.
- **Ring / gauge:** track `--track`, progress `--accent`, 12px round cap, big number in the center (Space Grotesk 38px).
- **Tooltips:** `.glass` style, 12px text, 600 weight.
- **Axis labels:** 12px `--muted`.

Only about three colors are distinguishable, so for several series use: series 1 `--accent`; series 2 white (dark) or black (light); series 3 `--muted` gray. Add dashed lines, opacity steps and direct labels so color is never the only cue. Beyond four series, use a table or small multiples. Give every chart an `aria-label` summary.

---

## 11. Layout

- Page root: flex row, wrap, gap 24px, padding 24px, background `--bg`.
- Sidebar: `flex: 0 0 76px`. Main: `flex: 999 1 560px; min-width: 0` (stacks under the sidebar on phones).
- Header: title + subtitle on the left; on the right the dropdown, theme toggle, secondary buttons and **one** primary button.
- KPI row: `grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 18px`.
- Chart row: wide chart card `flex: 2 1 440px` + side card `flex: 1 1 260px`.
- Lists and tables: inside a `.glass` card; rows 10px 12px padding, 16px radius, subtle `--line` border.
- Forms: labels 13px `--muted` above inputs; inputs use the same frosted style as `.btn` (46px high, 14px radius).
- Modals/drawers: `.glass` with a dimmed, blurred backdrop.
- Wide tables scroll inside an `overflow-x: auto` box.
- Breakpoints: 720px (sidebar becomes a top bar), 1280-1440px is the target desktop width.

---

## 12. Theme switching

```js
const root = document.documentElement;
function setTheme(t){
  root.classList.remove('theme-dark','theme-light');
  root.classList.add('theme-' + t);
  try { localStorage.setItem('theme', t); } catch(e){}
}
let saved = null; try { saved = localStorage.getItem('theme'); } catch(e){}
setTheme(saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
```

A Light/Dark button in the top bar (sun/moon icon) calls `setTheme`. Put the class on `<html>`.

---

## 13. Accessibility

- Text contrast at least 4.5:1. Yellow is a fill with dark text on it; never yellow text on white.
- Real `<button>`, `<a>`, `<input>` + `<label>`; never clickable divs.
- Visible focus ring on every interactive element (3px yellow outline).
- Icon-only buttons have `aria-label`; decorative SVGs have `aria-hidden="true"`.
- Respect `prefers-reduced-motion`: remove the hover lift and transitions.
- Do not rely on color alone for chart series or status.

---

## 14. Complete `theme.css` (copy as-is)

Save as `src/styles/theme.css` and import it once at the app root.

```css
/* ---------- tokens ---------- */
:root { --accent: #FFD60A; }
.theme-light { --accent: #FFCC00; }

.theme-dark {
  color-scheme: dark;
  --bg: linear-gradient(135deg, #070708 0%, #111008 55%, #1a1708 100%);
  --text: #ffffff;
  --muted: rgba(255,255,255,.66);
  --card: rgba(255,255,255,.065);
  --card-border: rgba(255,255,255,.15);
  --shadow: 0 22px 50px rgba(0,0,0,.55), 0 0 0 1px rgba(255,214,10,.05);
  --highlight: rgba(255,255,255,.18);
  --line: rgba(255,255,255,.12);
  --btn-bg: rgba(255,255,255,.07);
  --btn-border: rgba(255,255,255,.28);
  --btn-shadow: 3px 3px 0 rgba(255,214,10,.28);
  --btn-hover-shadow: 5px 5px 0 rgba(255,214,10,.4);
  --btn-primary-border: #fff1a0;
  --btn-primary-shadow: 4px 4px 0 rgba(255,214,10,.38);
  --chip: rgba(255,214,10,.16);
  --orb: rgba(255,214,10,.30);
  --chart: var(--accent);
  --track: rgba(255,255,255,.12);
  --on-accent: #0b0b0c;
  --menu-bg: rgba(24,22,12,.78);
  --menu-hover: rgba(255,214,10,.16);
  --menu-shadow: 0 20px 40px rgba(0,0,0,.6);
}

.theme-light {
  color-scheme: light;
  --bg: linear-gradient(135deg, #ffffff 0%, #fcfaf1 50%, #f2edd8 100%);
  --text: #111111;
  --muted: #55554d;
  --card: rgba(255,255,255,.62);
  --card-border: rgba(255,255,255,.95);
  --shadow: 0 16px 36px rgba(40,32,0,.12), 0 0 0 1px rgba(17,17,17,.08);
  --highlight: rgba(255,255,255,.95);
  --line: rgba(17,17,17,.10);
  --btn-bg: rgba(255,255,255,.6);
  --btn-border: rgba(17,17,17,.14);
  --btn-shadow: 3px 3px 0 rgba(17,17,17,.12);
  --btn-hover-shadow: 5px 5px 0 rgba(17,17,17,.3);
  --btn-primary-border: rgba(17,17,17,.35);
  --btn-primary-shadow: 4px 4px 0 rgba(17,17,17,.55);
  --chip: rgba(255,204,0,.35);
  --orb: rgba(255,204,0,.42);
  --chart: #111111;
  --track: rgba(17,17,17,.10);
  --on-accent: #111111;
  --menu-bg: rgba(255,255,255,.82);
  --menu-hover: rgba(255,204,0,.35);
  --menu-shadow: 0 16px 32px rgba(40,32,0,.16), 0 0 0 1px rgba(17,17,17,.08);
}

/* ---------- base ---------- */
* { box-sizing: border-box; }
body { margin: 0; font-family: Inter, system-ui, sans-serif; color: var(--text); background: var(--bg); min-height: 100vh; transition: background .3s, color .3s; }
h1, h2 { font-family: 'Space Grotesk', sans-serif; margin: 0; }
.icon { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; flex: none; }
.icon.sm { width: 18px; height: 18px; }
.orb { position: fixed; border-radius: 50%; background: var(--orb); filter: blur(100px); pointer-events: none; z-index: 0; }

/* ---------- glass ---------- */
.glass { background: var(--card); -webkit-backdrop-filter: blur(22px) saturate(160%); backdrop-filter: blur(22px) saturate(160%); border: 1px solid var(--card-border); border-radius: 24px; box-shadow: var(--shadow), inset 0 1px 0 var(--highlight); }

/* ---------- buttons ---------- */
.btn { font: 600 14px/1 Inter, system-ui, sans-serif; height: 46px; padding: 0 20px; border-radius: 14px; cursor: pointer; color: var(--text); background: var(--btn-bg); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px); border: 1.5px solid var(--btn-border); box-shadow: var(--btn-shadow); transition: transform .15s, box-shadow .15s; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
.btn:hover { transform: translate(-1px,-1px); box-shadow: var(--btn-hover-shadow); }
.btn:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 rgba(0,0,0,.3); }
.btn.primary { background: var(--accent); color: var(--on-accent); border-color: var(--btn-primary-border); box-shadow: var(--btn-primary-shadow); }
.btn.sm { height: 36px; padding: 0 14px; font-size: 13px; }
.btn:focus-visible, .nav:focus-visible, .menu-item:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }

/* ---------- sidebar ---------- */
.rail { width: 76px; flex: 0 0 76px; border-radius: 38px; padding: 18px 0; display: flex; flex-direction: column; align-items: center; gap: 6px; position: sticky; top: 24px; min-height: calc(100vh - 48px); }
.logo { width: 44px; height: 44px; border-radius: 14px; background: var(--accent); color: var(--on-accent); font: 700 18px/44px 'Space Grotesk', sans-serif; text-align: center; box-shadow: 0 0 28px var(--orb); }
.nav { width: 48px; height: 48px; border-radius: 16px; border: 0; background: transparent; color: var(--muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background .15s, color .15s; }
.nav:hover { background: var(--chip); color: var(--text); }
.nav.on { background: var(--accent); color: var(--on-accent); }
.sep { width: 36px; height: 1px; background: var(--line); margin: 6px 0; }
.gap { height: 10px; }
@media (max-width: 720px) { .rail { flex-direction: row; width: 100%; flex-basis: 100%; border-radius: 28px; overflow-x: auto; min-height: 0; position: static; } .rail .sep, .rail .gap { display: none; } }

/* ---------- dropdown ---------- */
.dd { position: relative; }
.menu { position: absolute; right: 0; top: calc(100% + 8px); z-index: 20; margin: 0; padding: 6px; min-width: 210px; list-style: none; background: var(--menu-bg); -webkit-backdrop-filter: blur(22px) saturate(160%); backdrop-filter: blur(22px) saturate(160%); border: 1px solid var(--card-border); border-radius: 16px; box-shadow: var(--menu-shadow); color: var(--text); }
.menu[hidden] { display: none; }
.menu-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 10px; font: 500 14px Inter, sans-serif; cursor: pointer; }
.menu-item:hover, .menu-item:focus-visible { background: var(--menu-hover); outline: none; }
.menu-item[aria-selected="true"] { background: var(--accent); color: var(--on-accent); }
select.native { background: var(--btn-bg); color: var(--text); border: 1.5px solid var(--btn-border); border-radius: 14px; height: 46px; padding: 0 14px; box-shadow: var(--btn-shadow); font: 600 14px Inter, sans-serif; }
select.native option { background: var(--menu-bg); color: var(--text); }

/* ---------- small parts ---------- */
.label { font-size: 13px; color: var(--muted); }
.kpi { margin-top: 10px; font: 700 36px/1 'Space Grotesk', sans-serif; }
.chip { display: inline-block; margin-top: 14px; padding: 5px 10px; border-radius: 999px; background: var(--chip); font-size: 12px; font-weight: 600; }
.axis { display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: var(--muted); }

@media (prefers-reduced-motion: reduce) { * { transition: none !important; } .btn:hover, .btn:active { transform: none; } }
```

---

## 15. Suggested file structure

```
src/
  styles/theme.css        <- section 14 (global, imported once)
  components/
    Sidebar.jsx           <- section 8
    Button.jsx            <- section 6
    Dropdown.jsx          <- section 7
    Card.jsx              <- section 5
    charts/               <- section 10
  pages/                  <- every page uses the components above
DESIGN.md                 <- this file
```

---

## 16. New page checklist

- [ ] Uses `theme.css` variables only (no hard-coded colors)
- [ ] Sidebar present with the correct item active
- [ ] Cards are `.glass`, buttons are `.btn`, dropdowns are the glass `.menu`
- [ ] Lucide icons only
- [ ] Looks right in dark and light mode
- [ ] Works at 390px width and with keyboard only
- [ ] One primary button per view
- [ ] Sample numbers are replaced with real data

---

## 17. Notes

- The logo "TF" is a placeholder; replace it with the real logo.
- Demo numbers and names are sample data.
- A working example of everything here is in `demo.html`.
