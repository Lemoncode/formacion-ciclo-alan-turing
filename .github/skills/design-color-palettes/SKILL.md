---
name: design-color-palettes
description: "Choose and apply a varied color palette when generating UI. Use when: creating any frontend UI, designing layouts, picking colors for components, styling with CSS/Tailwind/DaisyUI, or whenever a visual design is needed. Prevents defaulting to the same blue/white/gray scheme every time. Triggers on: design, UI, component, layout, frontend, colors, palette, style, theme."
argument-hint: "mood or context (e.g. 'dark gaming', 'warm minimal', 'corporate', 'pastel soft')"
---

# Design Color Palettes

Avoid the default blue-white-gray palette. Pick from the options below based on the context and mood of the project. If no preference is given, **rotate** through them — do not always default to the same one.

---

## How to Choose

| Context / vibe               | Recommended palette              |
| ---------------------------- | -------------------------------- |
| Gaming, tech, 18-25 audience | Synthwave Neon or Cyberpunk      |
| Health, wellness, nature     | Forest Calm or Earthy Warm       |
| Finance, SaaS, corporate     | Slate Professional or Ocean Deep |
| Fashion, beauty, lifestyle   | Blossom or Rose Gold             |
| Kids, education, fun         | Candy Pop                        |
| Minimal, editorial           | Chalk & Ink                      |
| Dark elegance, luxury        | Obsidian Gold                    |

---

## Palette Library

### 1. Synthwave Neon

Dark retrofuturistic — very popular with 18-25 yr olds.

```css
--bg: #0d0d1a;
--surface: #1a1a2e;
--border: #2a2a4a;
--accent-1: #ff2d78; /* hot pink */
--accent-2: #00dfd8; /* cyan */
--accent-3: #b45aff; /* violet */
--text: #e8e8f0;
--muted: #7878a0;
```

Tailwind-ish: `bg-[#0d0d1a]`, pinks: `text-[#ff2d78]`, cyans: `text-[#00dfd8]`

---

### 2. Cyberpunk / Neon-Green

Black with electric accents — edgy, hacker aesthetic.

```css
--bg: #0a0a0a;
--surface: #111111;
--border: #1e1e1e;
--accent-1: #39ff14; /* electric green */
--accent-2: #ff10f0; /* magenta */
--accent-3: #ffe600; /* yellow */
--text: #f0f0f0;
--muted: #666;
```

---

### 3. Earthy Warm

Cozy, artisan, organic — great for food, travel, lifestyle.

```css
--bg: #fdf6ee;
--surface: #fff8f2;
--border: #e8d5c0;
--accent-1: #c2652a; /* terracotta */
--accent-2: #7a9e7e; /* sage green */
--accent-3: #e8b04b; /* amber */
--text: #2d1f10;
--muted: #9a826a;
```

DaisyUI theme: use `autumn` as base.

---

### 4. Ocean Deep

Deep navy blues with cool cyan — trustworthy, tech-forward.

```css
--bg: #05131f;
--surface: #0a2342;
--border: #0f3460;
--accent-1: #00b4d8; /* sky cyan */
--accent-2: #90e0ef; /* pale cyan */
--accent-3: #48cae4;
--text: #e8f4f8;
--muted: #7aa9be;
```

---

### 5. Forest Calm

Dark greens and creams — nature, eco, wellness.

```css
--bg: #0f1f10;
--surface: #1b3a1c;
--border: #2d5a2e;
--accent-1: #52b788; /* mint green */
--accent-2: #95d5b2; /* light green */
--accent-3: #d8f3dc; /* cream green */
--text: #f0faf0;
--muted: #74a97a;
```

DaisyUI theme: use `forest` as base.

---

### 6. Blossom

Soft pinks and lilacs — beauty, fashion, feminine aesthetic.

```css
--bg: #fff0f6;
--surface: #fce4ec;
--border: #f8bbd0;
--accent-1: #e91e8c; /* hot pink */
--accent-2: #9c27b0; /* purple */
--accent-3: #ff6f91; /* coral pink */
--text: #3d0020;
--muted: #b06080;
```

---

### 7. Slate Professional

Clean grays with a bold single accent — SaaS, dashboards, B2B.

```css
--bg: #f8fafc;
--surface: #ffffff;
--border: #e2e8f0;
--accent-1: #0f172a; /* almost black */
--accent-2: #6366f1; /* indigo */
--accent-3: #f59e0b; /* amber highlight */
--text: #1e293b;
--muted: #64748b;
```

Tailwind: `bg-slate-50`, `text-slate-800`, `indigo-500`, `amber-400`

---

### 8. Chalk & Ink

High-contrast editorial minimal — newspapers, blogs, portfolios.

```css
--bg: #f5f0e8;
--surface: #ffffff;
--border: #d6cfbf;
--accent-1: #1a1a1a; /* near-black */
--accent-2: #c0392b; /* editorial red */
--accent-3: #2980b9; /* link blue */
--text: #1a1a1a;
--muted: #888;
```

---

### 9. Obsidian Gold

Dark luxury — premium products, finance, events.

```css
--bg: #0a0a0a;
--surface: #111;
--border: #2a2a2a;
--accent-1: #c9a84c; /* gold */
--accent-2: #e8d5a3; /* light gold */
--accent-3: #6b4c0a; /* dark gold */
--text: #f0ebe0;
--muted: #888;
```

---

### 10. Candy Pop

Vibrant, playful — edtech, kids, fun games.

```css
--bg: #fff9fb;
--surface: #ffffff;
--border: #ffe4f0;
--accent-1: #ff5c8a; /* strawberry */
--accent-2: #ffb347; /* peach */
--accent-3: #4ecdc4; /* mint */
--accent-4: #a29bfe; /* lavender */
--text: #2d2d2d;
--muted: #999;
```

---

## Rules When Applying

1. **Pick ONE palette per project** — don't mix tokens from different palettes.
2. **Limit active colors**: 1 background + 1 surface + 1-2 accents + text + muted. More is noisy.
3. **Use muted for secondary text, labels, placeholders** — not for the main copy.
4. **Dark themes**: glow effects (`box-shadow: 0 0 12px <accent>55`) add depth on .hover states.
5. **Light themes**: use subtle `border` and `box-shadow` for depth instead of heavy borders.
6. **Gradient headers** work well when you combine `accent-1` → `accent-2` diagonally.
7. **DaisyUI**: map `--accent-1` → `--p` (primary), `--accent-2` → `--s` (secondary) in the theme config.

---

## Tailwind v4 Custom Theme Snippet

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-brand-bg: #0d0d1a;
  --color-brand-surface: #1a1a2e;
  --color-brand-pink: #ff2d78;
  --color-brand-cyan: #00dfd8;
  --color-brand-violet: #b45aff;
  --color-brand-text: #e8e8f0;
  --color-brand-muted: #7878a0;
}
```

Then use: `bg-brand-bg`, `text-brand-pink`, `border-brand-cyan`, etc.
