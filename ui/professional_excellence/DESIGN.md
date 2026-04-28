---
name: Professional Excellence
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#575e70'
  on-secondary: '#ffffff'
  secondary-container: '#d9dff5'
  on-secondary-container: '#5c6274'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dce2f7'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#141b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
typography:
  h1:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  caption:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  grid_columns: '12'
  gutter: 24px
  margin: auto
---

## Brand & Style

The design system is engineered to evoke an atmosphere of high-stakes professionalism and seamless reliability. Targeted at elite service providers and discerning clients, the aesthetic sits at the intersection of **Corporate Modern** and **Minimalism**. 

The UI prioritizes "airiness" through generous white space and a fintech-inspired clarity that reduces cognitive load during complex transactions. It avoids decorative clutter, relying instead on precision typography and a structured layering system to build user trust. The emotional response should be one of calm confidence—reassuring users that they are engaging with a high-end, secure marketplace.

## Colors

The palette is anchored by **Deep Indigo (#4F46E5)**, a color chosen for its associations with intelligence and technical proficiency. This is balanced against a high-contrast grayscale stack to maintain a "Fintech" seriousness.

- **Primary Canvas:** Use `#FFFFFF` for the main page background to maximize the feeling of light.
- **Surfaces:** Use `#F9FAFB` for secondary sections, sidebar backgrounds, and card containers to create subtle tectonic shifts in the UI.
- **Typography:** Primary text remains near-black (`#111827`) for optimal readability. Muted text (`#6B7280`) is used strictly for meta-data and decorative labels to maintain a clean hierarchy.

## Typography

This design system utilizes **Manrope** for its geometric yet warm characteristics, providing a contemporary professional feel. 

Headings must be bold and impactful to establish a clear information architecture. Use H1 and H2 levels to anchor pages, utilizing the negative letter-spacing to create a "tight," editorial appearance. Body text should prioritize legibility with a generous line height. Labels and small meta-data should leverage the semi-bold or bold weights to ensure they remain legible even at smaller scales.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop environments, centering content within a 1280px max-width container. 

A strict 8px spacing scale governs the rhythm of the UI.
- **Vertical Rhythm:** Use `48px` (lg) or `80px` (xl) sections to create the "airy" feel requested. 
- **Component Padding:** Elements should utilize `24px` internal padding to ensure content does not feel cramped.
- **Grid:** A 12-column layout with `24px` gutters provides the structural backbone for marketplace listings and dashboard widgets.

## Elevation & Depth

The design system uses **Ambient Shadows** to create a sense of physical layering without introducing visual noise. Depth is communicated through two primary levels:

1.  **Level 1 (Resting Cards):** A very soft, diffused shadow (`0px 4px 20px rgba(0, 0, 0, 0.03)`) used on service provider cards and navigation bars.
2.  **Level 2 (Hover/Active):** An intensified shadow (`0px 10px 30px rgba(0, 0, 0, 0.06)`) that creates a "lift" effect, signaling interactivity.

Avoid heavy borders; use subtle `1px` strokes in `#F3F4F6` for separation when background colors are identical.

## Shapes

The shape language is structured to feel approachable yet precise. 

- **Cards & Containers:** Use a `16px` radius. This larger curve softens the professional indigo and lends a modern, friendly character to the marketplace.
- **Interactive Elements:** Buttons, input fields, and tags utilize a `12px` radius. This slight reduction in roundness compared to cards creates a clear visual distinction between "containers" and "actions."
- **Icons:** Should follow a rounded-corner style (2px corner radius on glyphs) to match the UI's geometry.

## Components

### Buttons
Primary buttons use the Deep Indigo (`#4F46E5`) with white text and a `12px` radius. Hover states should involve a subtle shift to a darker indigo. Use "Ghost" buttons (transparent background, indigo border) for secondary actions to maintain the airy aesthetic.

### Cards
Service provider cards are the core of the marketplace. They feature the `16px` radius, a white background, and the Level 1 shadow. Content should be padded by `24px` on all sides.

### Input Fields
Inputs use a `12px` radius and a `#F9FAFB` fill with a subtle `#E5E7EB` border. On focus, the border transitions to the Primary Indigo with a soft outer glow.

### Chips & Badges
Use for service categories or status. These should be semi-rounded (pill-style) with a low-opacity tint of the semantic colors (e.g., Success green at 10% opacity with 100% opacity text).

### Professional Identity Components
- **Trust Badges:** Small, high-contrast badges for "Verified" or "Top Rated" status using a gold or primary indigo accent.
- **Availability Indicators:** A small circular pulse using the Success green (`#10B981`) to show real-time provider status.