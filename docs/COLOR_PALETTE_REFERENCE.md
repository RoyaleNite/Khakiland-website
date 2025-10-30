# 🎨 OFFICIAL COLOR PALETTE - Olive/Khaki Theme

## Master Color Palette

This is the **ONLY** color palette that should be used throughout the entire application.

### Primary Colors - Olive

| Usage | Hex Code | Tailwind Class | Purpose |
|-------|----------|----------------|---------|
| **Olive Light** | `#9C9A73` | `[#9C9A73]` | Secondary text (dark mode), icons (dark mode) |
| **Olive Default** | `#6B8E23` | `[#6B8E23]` | Primary buttons, active states, links, emphasis |
| **Olive Dark** | `#4B5320` | `[#4B5320]` | Hover states, borders (dark mode), accents |

### Secondary Colors - Khaki

| Usage | Hex Code | Tailwind Class | Purpose |
|-------|----------|----------------|---------|
| **Khaki Light** | `#C2B280` | `[#C2B280]` | Borders (light mode), subtle backgrounds |
| **Khaki Default** | `#D2B48C` | `[#D2B48C]` | Background accents, cards |
| **Khaki Dark** | `#6C541E` | `[#6C541E]` | Deep accents, shadows |

### Accent Color

| Usage | Hex Code | Tailwind Class | Purpose |
|-------|----------|----------------|---------|
| **Accent** | `#8B7D3A` | `[#8B7D3A]` | Secondary buttons, highlights, gradient stops |

### Background Colors

| Mode | Usage | Hex Code | Tailwind Class |
|------|-------|----------|----------------|
| **Light** | Main background | `#F5F4ED` | `[#F5F4ED]` |
| **Light** | Secondary background | `#E8E6D5` | `[#E8E6D5]` |
| **Dark** | Main background | `#2A2817` | `[#2A2817]` |
| **Dark** | Secondary background | `#3A3621` | `[#3A3621]` |

### Text Colors

| Mode | Usage | Hex Code | Tailwind Class |
|------|-------|----------|----------------|
| **Light** | Primary text | `#3B3A2E` | `[#3B3A2E]` |
| **Light** | Secondary text | `#5C5A44` | `[#5C5A44]` |
| **Dark** | Primary text | `#E8E6D5` | `[#E8E6D5]` |
| **Dark** | Secondary text | `#C2B280` | `[#C2B280]` |

---

## Status & Feedback Colors

These colors should ONLY be used for status indicators and feedback. They must be from the olive/khaki palette.

### Success State
- **Color:** `#6B8E23` (Olive Default - Green tint)
- **Usage:** Success messages, completed status, "paid" status, "delivered" status
- **Classes:** `text-[#6B8E23] bg-[#6B8E23]`

### Warning State
- **Color:** `#D2B48C` (Khaki Default - Yellow tint)
- **Usage:** Low stock warnings, "pending" status, "processing" status
- **Classes:** `text-[#D2B48C] bg-[#D2B48C]`

### Info State
- **Color:** `#9C9A73` (Olive Light)
- **Usage:** "shipped" status, informational messages
- **Classes:** `text-[#9C9A73] bg-[#9C9A73]`

### Error/Cancelled State
- **Color:** `#6C541E` (Khaki Dark)
- **Usage:** Cancelled orders, errors that aren't critical
- **For Critical Errors ONLY:** Use system red `#c1440e` (destructive color from theme)
- **Classes:** `text-[#6C541E] bg-[#6C541E]` or `text-destructive bg-destructive`

---

## Color Usage by Component Type

### Buttons

#### Primary Button (Call to Action)
```tsx
className="bg-gradient-to-r from-[#6B8E23] to-[#8B7D3A] hover:from-[#4B5320] hover:to-[#6B8E23]"
```

#### Secondary Button (Outline)
```tsx
className="border-[#6B8E23] text-[#6B8E23] dark:text-[#9C9A73] hover:bg-[#D2B48C]/20"
```

#### Ghost Button
```tsx
className="hover:bg-[#D2B48C]/20 dark:hover:bg-[#4B5320]/30"
```

### Cards

#### Standard Card
```tsx
className="border-[#C2B280] dark:border-[#4B5320] bg-white/90 dark:bg-[#3A3621]/90"
```

#### Card Header with Accent
```tsx
className="bg-gradient-to-r from-[#D2B48C]/30 to-[#C2B280]/30 dark:from-[#4B5320]/30 dark:to-[#6C541E]/30"
```

### Backgrounds

#### Page Background
```tsx
className="bg-gradient-to-br from-[#F5F4ED] via-[#E8E6D5] to-[#D2B48C] dark:from-[#2A2817] dark:via-[#3A3621] dark:to-[#2A2817]"
```

#### Section Background
```tsx
className="bg-[#D2B48C]/20 dark:bg-[#4B5320]/30"
```

### Borders

#### Standard Border
```tsx
className="border-[#C2B280] dark:border-[#4B5320]"
```

### Text & Headings

#### Primary Heading
```tsx
className="text-[#3B3A2E] dark:text-[#E8E6D5]"
```

#### Gradient Heading
```tsx
className="bg-gradient-to-r from-[#6B8E23] to-[#8B7D3A] bg-clip-text text-transparent"
```

#### Link Text
```tsx
className="text-[#6B8E23] dark:text-[#9C9A73] hover:underline"
```

#### Secondary Text
```tsx
className="text-[#5C5A44] dark:text-[#C2B280]"
```

### Form Elements

#### Input Fields
```tsx
className="border-[#C2B280] dark:border-[#4B5320] focus:border-[#6B8E23] dark:focus:border-[#9C9A73]"
```

#### Checkbox/Radio
```tsx
className="border-[#C2B280] text-[#6B8E23] focus:ring-[#6B8E23]"
```

### Loading States

#### Spinner
```tsx
className="border-4 border-[#6B8E23] border-t-transparent"
```

### Status Badges

#### Pending/Processing
```tsx
className="bg-[#D2B48C] text-[#3B3A2E]"
```

#### Shipped/In Transit
```tsx
className="bg-[#9C9A73] text-white"
```

#### Delivered/Paid/Success
```tsx
className="bg-[#6B8E23] text-white"
```

#### Cancelled/Unpaid
```tsx
className="bg-[#6C541E] text-white"
```

#### Critical Error
```tsx
className="bg-destructive text-destructive-foreground"
// Uses system red #c1440e from theme
```

---

## Colors That Should NOT Be Used

### ❌ DO NOT USE:
- `amber-*` (except in system alerts)
- `yellow-*` (except in system alerts)
- `stone-*`
- `blue-*` (except for info badges)
- `purple-*`
- `orange-*` (except for warning badges)
- `gray-*` or `slate-*` (use our khaki/olive variants instead)

### ✅ EXCEPTIONS (System Colors):
These colors are ONLY for critical system feedback:
- `red-*` - Critical errors, deletion warnings
- `green-*` - Success confirmations (alternative: use `#6B8E23`)
- `orange-*` - Urgent warnings (alternative: use `#D2B48C`)

---

## CSS Variable Reference

From `/frontend/src/index.css`:

```css
@theme {
  /* Borders & Inputs */
  --color-border: #C2B280;
  --color-input: #C2B280;
  --color-ring: #6B8E23;

  /* Backgrounds */
  --color-background: #F5F4ED;
  --color-foreground: #3B3A2E;

  /* Primary */
  --color-primary: #6B8E23;
  --color-primary-foreground: #F5F4ED;

  /* Secondary */
  --color-secondary: #9C9A73;
  --color-secondary-foreground: #3B3A2E;

  /* Destructive */
  --color-destructive: #c1440e;
  --color-destructive-foreground: #F5F4ED;

  /* Muted */
  --color-muted: #D2B48C;
  --color-muted-foreground: #5C5A44;

  /* Accent */
  --color-accent: #8B7D3A;
  --color-accent-foreground: #3B3A2E;

  /* Cards & Popovers */
  --color-card: #FFFEF9;
  --color-card-foreground: #3B3A2E;
  --color-popover: #F5F4ED;
  --color-popover-foreground: #3B3A2E;
}

.dark {
  --color-background: #2A2817;
  --color-foreground: #E8E6D5;
  --color-card: #3A3621;
  --color-primary: #9C9A73;
  --color-secondary: #4B5320;
  --color-muted: #6C541E;
  --color-border: #4B5320;
  /* ... */
}
```

---

## Component-Specific Palette

### Navigation (Navbar)
- Background: `#F5F4ED/95` (light) | `#2A2817/95` (dark)
- Border: `#C2B280` (light) | `#4B5320` (dark)
- Icons: `#6B8E23` (light) | `#9C9A73` (dark)
- Links: `#5C5A44` (light) | `#C2B280` (dark)
- Staff links: `#6B8E23` (light) | `#9C9A73` (dark)

### Dashboard Stats Cards
- Background: `white/90` (light) | `#3A3621/90` (dark)
- Border: `#C2B280` (light) | `#4B5320` (dark)
- Icon backgrounds: `from-[#6B8E23] to-[#8B7D3A]`
- Numbers: `#3B3A2E` (light) | `#E8E6D5` (dark)

### Product Cards
- Background: `white/90` (light) | `#3A3621/90` (dark)
- Image background: `from-[#F5F4ED] to-[#D2B48C]` (light) | `from-[#3A3621] to-[#2A2817]` (dark)
- Price: `#6B8E23` (light) | `#9C9A73` (dark)
- Button: `from-[#6B8E23] to-[#8B7D3A]`

### Tables
- Header: `from-[#D2B48C]/30 to-[#C2B280]/30` (light) | `from-[#4B5320]/30 to-[#6C541E]/30` (dark)
- Row hover: `#D2B48C/20` (light) | `#4B5320/30` (dark)
- Borders: `#C2B280` (light) | `#4B5320` (dark)

---

## Quick Reference: Common Replacements

| Old Color | New Color | Usage |
|-----------|-----------|-------|
| `amber-600` | `[#6B8E23]` | Primary actions |
| `yellow-600` | `[#8B7D3A]` | Gradient stops |
| `amber-700` | `[#4B5320]` | Hover states |
| `stone-800` | `[#3A3621]` | Dark backgrounds |
| `stone-700` | `[#4B5320]` | Dark borders |
| `amber-200` | `[#C2B280]` | Light borders |
| `amber-100` | `[#D2B48C]` | Subtle backgrounds |

---

## Validation Checklist

Use this checklist to verify color consistency:

- [ ] No `amber-*` classes except `destructive` system colors
- [ ] No `yellow-*` classes except `destructive` system colors
- [ ] No `stone-*` classes
- [ ] All status badges use olive/khaki variants
- [ ] All buttons use olive/khaki gradients
- [ ] All borders use `#C2B280` (light) or `#4B5320` (dark)
- [ ] All loading spinners use `#6B8E23`
- [ ] All text uses defined text colors
- [ ] All backgrounds use defined background colors

---

**Last Updated:** October 28, 2025
**Version:** 1.0
**Status:** Official Color Palette
