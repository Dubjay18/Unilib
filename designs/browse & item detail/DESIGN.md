---
name: Academic Heritage
colors:
  surface: '#fff8f3'
  surface-dim: '#dfd9d4'
  surface-bright: '#fff8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f2ed'
  surface-container: '#f3ede7'
  surface-container-high: '#ede7e2'
  surface-container-highest: '#e7e1dc'
  on-surface: '#1d1b18'
  on-surface-variant: '#574240'
  inverse-surface: '#32302d'
  inverse-on-surface: '#f6f0ea'
  outline: '#8a716f'
  outline-variant: '#ddc0bd'
  surface-tint: '#a43b37'
  primary: '#5b0309'
  on-primary: '#ffffff'
  primary-container: '#7a1c1c'
  on-primary-container: '#ff8981'
  inverse-primary: '#ffb3ad'
  secondary: '#4059aa'
  on-secondary: '#ffffff'
  secondary-container: '#8fa7fe'
  on-secondary-container: '#1d3989'
  tertiary: '#003112'
  on-tertiary: '#ffffff'
  tertiary-container: '#004a1e'
  on-tertiary-container: '#5dbe73'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3ad'
  on-primary-fixed: '#410004'
  on-primary-fixed-variant: '#842322'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b6c4ff'
  on-secondary-fixed: '#00164e'
  on-secondary-fixed-variant: '#264191'
  tertiary-fixed: '#95f8a7'
  tertiary-fixed-dim: '#79db8d'
  on-tertiary-fixed: '#00210a'
  on-tertiary-fixed-variant: '#005323'
  background: '#fff8f3'
  on-background: '#1d1b18'
  surface-variant: '#e7e1dc'
typography:
  h1:
    fontFamily: Literata
    fontSize: 3.5rem
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Literata
    fontSize: 2.5rem
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Literata
    fontSize: 2.6rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Literata
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.05rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.95rem
    fontWeight: '400'
    lineHeight: '1.5'
  meta:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.85rem
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  section-padding-v: 110px
  container-margin: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system for this university library management system balances historical academic prestige with modern functional efficiency. The brand personality is **scholarly, reliable, and sophisticated**, evoking the atmosphere of a world-class institution's reading room while maintaining the speed of a high-tech digital tool.

The visual style is a **Contemporary-Classical Hybrid**. It utilizes a "Parchment" aesthetic—a soft, warm-toned background that reduces eye strain during long research sessions—paired with sharp, authoritative typography and accent bars that signal organizational hierarchy. This approach moves away from the sterile "SaaS blue" defaults toward an environment that feels curated, intentional, and intellectually grounding.

## Colors
The palette is rooted in traditional university colors to establish immediate trust and authority.

- **Oxford Crimson (#7a1c1c):** Used for primary actions, critical navigation states, and academic branding. It conveys passion for knowledge and institutional history.
- **Academic Navy (#1e3a8a):** Used as a secondary accent to differentiate departments, categories, or secondary data points, providing a professional contrast to the warmth of the crimson.
- **Parchment (#fdfbf7):** The global background color. It is warmer than pure white, providing a tactile, paper-like feel that enhances the "scholarly" narrative.
- **Dark Neutral (#1c1a17):** High-contrast text color for maximum legibility.
- **Border Parchment (#e6dec9):** A low-contrast border color that defines structure without creating the harsh visual noise of standard grays.

## Typography
The typographic system uses a high-contrast pairing of a sophisticated serif for information hierarchy and a clean, modern sans-serif for functional UI tasks.

- **Headlines & Stats (Literata):** A scholarly serif that mimics the high-quality printing of academic journals. Used for page titles, section headers, and key library metrics. *Note: As Fraunces was requested but Literata is the available high-quality literary alternative, Literata provides the same soft-serif warmth.*
- **Body & UI (Plus Jakarta Sans):** A friendly but professional sans-serif used for all data entry, book descriptions, and navigation elements. It ensures the system feels modern and accessible.
- **Vertical Rhythm:** Maintain generous line heights (1.5x - 1.6x) for body text to ensure comfortable reading of long abstracts and archival descriptions.

## Layout & Spacing
This design system utilizes a **Fixed Grid** approach for content-heavy pages and a **Fluid Layout** for management dashboards. 

- **Vertical Breath:** A core principle of this design is generous vertical padding (100px - 120px) between major sections to prevent the "cluttered database" feel common in legacy library software.
- **Grid:** Use a 12-column grid on desktop with 16px gutters.
- **Adaptive Strategy:**
  - **Desktop:** 1200px max-width container, centered.
  - **Tablet:** 8-column grid, reduced section padding to 64px.
  - **Mobile:** 4-column grid, 16px side margins, stack all sidebars.

## Elevation & Depth
Elevation is used sparingly and with a "tinted" approach to maintain the warm aesthetic.

- **Tonal Layers:** The primary depth comes from the contrast between the Parchment background (#fdfbf7) and the white Surface cards (#ffffff).
- **Soft Crimson Shadows:** Small elements like buttons or chips use a subtle shadow with a crimson tint (`rgba(122, 28, 28, 0.05)`) to feel integrated with the brand.
- **Academic Lift:** Interactive cards use a specific hover state that combines a vertical "lift" (translateY -6px) with a deep, diffused shadow. This makes book covers and search results feel tactile, like physical objects being lifted from a desk.

## Shapes
The shape language is controlled and precise, reflecting the structured nature of an archive.

- **Standard (8px):** The default radius for most UI components (buttons, input fields, cards). It is soft enough to be approachable but sharp enough to feel professional.
- **Large (12px - 20px):** Reserved for major content panels or main dashboard containers to create a "nested" look.
- **Accents:** Use a 6px vertical bar on the left edge of cards to indicate status or category (e.g., Crimson for overdue, Navy for reference, Green for available).

## Components
- **Buttons:** Primary buttons use Oxford Crimson with 8px rounding. Label text is Plus Jakarta Sans Semibold.
- **Cards:** White surfaces with a 1px border (#e6dec9). Must include the signature "Accent Bar" (6px) on the left side to define item status.
- **Input Fields:** Use the background color #fdfbf7 for the field itself with a #e6dec9 border to make them feel "recessed" into the white card surface.
- **Badges/Chips:** Use a tighter 4px radius. Success badges use the Green tint (#e2f0d9) with Green text; Error badges use the Red tint (#fce8e6).
- **Lists:** Archival lists should feature high horizontal padding and a subtle divider line (#e6dec9), ensuring each entry has sufficient white space to be read as a distinct record.
- **AI-Integrated Elements:** Components involving AI (search suggestions, auto-tagging) should use a subtle Academic Navy glow or border to distinguish them from standard static data.