# APOLLO — Theme & CSS Design System Specification
*Comprehensive CSS Tokens, Variables, and Glassmorphism Architecture*

---

## 1. Global CSS Root Variables & Theme Modes

Apollo utilizes CSS Custom Properties with native `color-scheme` toggling between Dark Mode (`.theme-dark`, `[data-theme="dark"]`, `html.dark`) and Light Mode (`.theme-light`, `[data-theme="light"]`).

```css
/* ═══════════════════════════════════════════════════════════════
   ROOT COLOR TOKENS & SYSTEM VARIABLES
   ═══════════════════════════════════════════════════════════════ */

:root {
  --accent: #FFD60A; /* Signature Luminescent Gold */
  color-scheme: dark;
}

/* ─────────────────────────────────────────────────────────────
   DARK THEME (Obsidian Glass HUD)
   ───────────────────────────────────────────────────────────── */
:root,
.theme-dark,
[data-theme="dark"],
html.dark {
  color-scheme: dark;

  /* Core Canvas & Surfaces */
  --bg: linear-gradient(135deg, #070708 0%, #111008 55%, #1a1708 100%);
  --bg-primary: #070708;
  --bg-secondary: #111008;
  --text: #ffffff;
  --muted: rgba(255, 255, 255, 0.66);
  --text-muted: rgba(255, 255, 255, 0.66);
  --text-subtle: rgba(255, 255, 255, 0.45);

  /* Glass Elevation */
  --card: rgba(255, 255, 255, 0.065);
  --card-border: rgba(255, 255, 255, 0.15);
  --panel-bg: rgba(255, 255, 255, 0.065);
  --panel-bg-hover: rgba(255, 255, 255, 0.10);
  --highlight: rgba(255, 255, 255, 0.18);
  --line: rgba(255, 255, 255, 0.12);
  --border: rgba(255, 255, 255, 0.12);
  --border-subtle: rgba(255, 255, 255, 0.05);

  /* Shadows & Depth */
  --shadow: 0 22px 50px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 214, 10, 0.05);
  --shadow-sm: 0 4px 16px rgba(0, 0, 0, 0.40), inset 0 1px 0 0 rgba(255, 255, 255, 0.10);
  --shadow-lg: 0 24px 60px -10px rgba(0, 0, 0, 0.80), 0 0 30px rgba(255, 214, 10, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.20);

  /* Brand Accents & Buttons */
  --accent: #FFD60A;
  --accent-dim: rgba(255, 214, 10, 0.14);
  --accent-glow: rgba(255, 214, 10, 0.45);
  --on-accent: #0b0b0c;
  --chip: rgba(255, 214, 10, 0.16);
  --orb: rgba(255, 214, 10, 0.30);
  --orb-opacity: 0.30;
  --focus-ring: 0 0 0 3px rgba(255, 214, 10, 0.40);

  --btn-bg: rgba(255, 255, 255, 0.07);
  --btn-border: rgba(255, 255, 255, 0.28);
  --btn-shadow: 3px 3px 0 rgba(255, 214, 10, 0.28);
  --btn-hover-shadow: 5px 5px 0 rgba(255, 214, 10, 0.40);
  --btn-primary-border: #fff1a0;
  --btn-primary-shadow: 4px 4px 0 rgba(255, 214, 10, 0.38);

  /* Menus & Flyouts */
  --menu-bg: rgba(24, 22, 12, 0.88);
  --menu-hover: rgba(255, 214, 10, 0.16);
  --menu-shadow: 0 20px 40px rgba(0, 0, 0, 0.60);

  /* Charts & Telemetry */
  --chart: var(--accent);
  --chart-line: var(--accent);
  --chart-fill: rgba(255, 214, 10, 0.22);
  --chart-fill-transparent: rgba(255, 214, 10, 0);
  --chart-glow: rgba(255, 214, 10, 0.50);
  --chart-grid: var(--line);
  --bar-gradient-from: #FFD60A;
  --bar-gradient-to: #D97706;
  --track: rgba(255, 255, 255, 0.12);

  /* Semantic Alerts */
  --positive: #10B981;
  --positive-dim: rgba(16, 185, 129, 0.14);
  --negative: #EF4444;
  --negative-dim: rgba(239, 68, 68, 0.14);
  --warning: #F59E0B;
  --warning-dim: rgba(245, 158, 11, 0.14);
  --info: #3B82F6;
  --info-dim: rgba(59, 130, 246, 0.14);
}

/* ─────────────────────────────────────────────────────────────
   LIGHT THEME (Warm Pearl Cream & Solar Gold)
   ───────────────────────────────────────────────────────────── */
.theme-light,
[data-theme="light"],
html:not(.dark):not(.theme-dark) {
  color-scheme: light;

  /* Core Canvas & Surfaces */
  --bg: linear-gradient(135deg, #ffffff 0%, #fcfaf1 50%, #f2edd8 100%);
  --bg-primary: #ffffff;
  --bg-secondary: #fcfaf1;
  --text: #111111;
  --muted: #55554d;
  --text-muted: #55554d;
  --text-subtle: #7a7a72;

  /* Glass Elevation */
  --card: rgba(255, 255, 255, 0.62);
  --card-border: rgba(255, 255, 255, 0.95);
  --panel-bg: rgba(255, 255, 255, 0.62);
  --panel-bg-hover: rgba(255, 255, 255, 0.95);
  --highlight: rgba(255, 255, 255, 0.95);
  --line: rgba(17, 17, 17, 0.10);
  --border: rgba(17, 17, 17, 0.10);
  --border-subtle: rgba(0, 0, 0, 0.04);

  /* Shadows & Depth */
  --shadow: 0 16px 36px rgba(40, 32, 0, 0.12), 0 0 0 1px rgba(17, 17, 17, 0.08);
  --shadow-sm: 0 2px 10px rgba(0, 0, 0, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.90);
  --shadow-lg: 0 20px 48px -6px rgba(0, 0, 0, 0.10), inset 0 1px 0 0 rgba(255, 255, 255, 1.00);

  /* Brand Accents & Buttons */
  --accent: #FFCC00;
  --accent-dim: rgba(255, 204, 0, 0.20);
  --accent-glow: rgba(255, 204, 0, 0.35);
  --on-accent: #111111;
  --chip: rgba(255, 204, 0, 0.35);
  --orb: rgba(255, 204, 0, 0.42);
  --orb-opacity: 0.42;
  --focus-ring: 0 0 0 3px rgba(255, 204, 0, 0.40);

  --btn-bg: rgba(255, 255, 255, 0.60);
  --btn-border: rgba(17, 17, 17, 0.14);
  --btn-shadow: 3px 3px 0 rgba(17, 17, 17, 0.12);
  --btn-hover-shadow: 5px 5px 0 rgba(17, 17, 17, 0.30);
  --btn-primary-border: rgba(17, 17, 17, 0.35);
  --btn-primary-shadow: 4px 4px 0 rgba(17, 17, 17, 0.55);

  /* Menus & Flyouts */
  --menu-bg: rgba(255, 255, 255, 0.92);
  --menu-hover: rgba(255, 204, 0, 0.35);
  --menu-shadow: 0 16px 32px rgba(40, 32, 0, 0.16), 0 0 0 1px rgba(17, 17, 17, 0.08);

  /* Charts & Telemetry */
  --chart: var(--accent);
  --chart-line: var(--accent);
  --chart-fill: rgba(255, 204, 0, 0.28);
  --chart-fill-transparent: rgba(255, 204, 0, 0);
  --chart-glow: rgba(255, 204, 0, 0.40);
  --chart-grid: var(--line);
  --bar-gradient-from: #FFCC00;
  --bar-gradient-to: #D97706;
  --track: rgba(17, 17, 17, 0.10);

  /* Semantic Alerts */
  --positive: #059669;
  --positive-dim: rgba(5, 150, 105, 0.14);
  --negative: #DC2626;
  --negative-dim: rgba(220, 38, 38, 0.14);
  --warning: #D97706;
  --warning-dim: rgba(217, 119, 6, 0.14);
  --info: #2563EB;
  --info-dim: rgba(37, 99, 235, 0.14);
}
```

---

## 2. Typography Scale & Fonts

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700;800&display=swap');

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  letter-spacing: -0.014em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, .kpi, .font-display {
  font-family: 'Space Grotesk', sans-serif;
  letter-spacing: -0.03em;
}

/* Fluid Typography Sizing */
:root {
  --text-xs:   11px;
  --text-sm:   12.5px;
  --text-base: 13.5px;
  --text-md:   15px;
  --text-lg:   18px;
  --text-xl:   24px;
  --text-2xl:  32px;
  --text-3xl:  44px;

  --fw-regular: 400;
  --fw-medium:  500;
  --fw-semi:    600;
  --fw-bold:    700;
  --fw-heavy:   800;
  --fw-black:   900;
}
```

---

## 3. Glassmorphic Surface Classes

```css
/* Standard Frosted Glass Surface */
.glass,
.glass-panel,
.obsidian-card,
.glass-card,
.glass-kpi-card {
  position: relative;
  background: var(--card) !important;
  -webkit-backdrop-filter: blur(22px) saturate(160%) !important;
  backdrop-filter: blur(22px) saturate(160%) !important;
  border: 1px solid var(--card-border) !important;
  border-radius: 24px;
  box-shadow: var(--shadow), inset 0 1px 0 var(--highlight) !important;
  color: var(--text) !important;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.2s ease;
}

/* Interactive Surface Elevation */
.glass:hover,
.glass-panel:hover,
.obsidian-card:hover,
.glass-card:hover {
  border-color: rgba(255, 214, 10, 0.35) !important;
}

/* Signature Gold Aura Card (Simulator & Highlighted Cards) */
.glass-gold-card {
  background: var(--card) !important;
  border: 1px solid rgba(255, 214, 10, 0.35) !important;
  box-shadow: var(--shadow), 0 0 28px rgba(255, 214, 10, 0.15) !important;
  backdrop-filter: blur(22px) saturate(160%) !important;
  -webkit-backdrop-filter: blur(22px) saturate(160%) !important;
  border-radius: 24px;
}

/* Ambient Blurred Orbs */
.orb {
  position: fixed;
  border-radius: 50%;
  background: var(--orb);
  filter: blur(100px);
  pointer-events: none;
  z-index: 0;
}
```

---

## 4. Button & Control CSS Architecture

```css
/* Primary Action Button (Solid Gold Pill) */
.btn-primary,
.btn.primary {
  background: linear-gradient(180deg, #FFE455 0%, #FFD91C 100%) !important;
  color: #050505 !important;
  font-weight: 800 !important;
  border-radius: 13px !important;
  padding: 9px 18px !important;
  font-size: 13px !important;
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
  box-shadow: 0 4px 18px rgba(255, 217, 28, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 7px !important;
  cursor: pointer;
}

.btn-primary:hover,
.btn.primary:hover {
  background: linear-gradient(180deg, #FFF178 0%, #FFE03D 100%) !important;
  box-shadow: 0 6px 24px rgba(255, 217, 28, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
  transform: translateY(-1px);
}

.btn-primary:active,
.btn.primary:active {
  transform: translateY(0);
}

/* Secondary Button (Frosted Glass with Border) */
.btn-secondary {
  background: rgba(255, 255, 255, 0.05) !important;
  color: var(--text) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 13px !important;
  padding: 9px 18px !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 7px !important;
  cursor: pointer;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 217, 28, 0.4) !important;
  color: #FFFFFF !important;
  transform: translateY(-1px);
}

/* Light Theme Variant for Secondary Buttons */
[data-theme="light"] .btn-secondary,
html:not(.dark) .btn-secondary {
  background: rgba(0, 0, 0, 0.04) !important;
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
  color: var(--text) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
}

[data-theme="light"] .btn-secondary:hover,
html:not(.dark) .btn-secondary:hover {
  background: rgba(0, 0, 0, 0.07) !important;
  border-color: rgba(255, 217, 28, 0.5) !important;
}
```

---

## 5. Navigation Rail & Sidebar CSS

```css
.rail {
  width: 76px;
  flex: 0 0 76px;
  border-radius: 38px;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.rail::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

.logo {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--accent);
  color: var(--on-accent);
  font: 700 16px/40px 'Space Grotesk', sans-serif;
  text-align: center;
  box-shadow: 0 0 24px var(--orb);
  flex-shrink: 0;
}

.nav {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  border: 0;
  background: transparent;
  color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, transform 0.15s;
  flex-shrink: 0;
}

.nav:hover {
  background: var(--chip);
  color: var(--text);
  transform: scale(1.05);
}

.nav.on,
.nav[aria-current="page"] {
  background: var(--accent);
  color: var(--on-accent);
  box-shadow: 0 4px 14px rgba(255, 214, 10, 0.28);
}

/* Horizontal Responsive Transformation for Mobile Rail */
@media (max-width: 720px) {
  .rail {
    flex-direction: row;
    width: 100%;
    flex-basis: 100%;
    border-radius: 28px;
    overflow-x: auto;
    min-height: 0;
    position: static;
    padding: 8px 12px;
  }
  .rail .sep,
  .rail .gap {
    display: none;
  }
}
```

---

## 6. Financial Charts, Sliders & Tables CSS

```css
/* Range Inputs / Self-Funding Sliders */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--track);
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  box-shadow: 0 0 10px rgba(255, 214, 10, 0.6);
  border: 2px solid #000;
  transition: transform 0.1s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

/* Glass Data Tables */
.glass-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.glass-table th {
  padding: 12px 16px;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted);
  border-bottom: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.02);
}

.glass-table td {
  padding: 14px 16px;
  font-size: 13px;
  color: var(--text);
  border-bottom: 1px solid var(--border-subtle);
  transition: background 0.15s ease;
}

.glass-table tr:hover td {
  background: rgba(255, 214, 10, 0.04);
}

/* Semantic Status Badges */
.badge-success {
  background: var(--positive-dim);
  color: var(--positive);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
}

.badge-warning {
  background: var(--warning-dim);
  color: var(--warning);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
}

.badge-danger {
  background: var(--negative-dim);
  color: var(--negative);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
}
```

---

## 7. Accessibility & Motion Prefs

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .btn:hover,
  .btn:active,
  .nav:hover {
    transform: none !important;
  }
}

:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 3px;
}
```
