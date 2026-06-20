---
name: Hospitality Modernism
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#584140'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#8c706f'
  outline-variant: '#e0bfbd'
  surface-tint: '#ae2f34'
  primary: '#ae2f34'
  on-primary: '#ffffff'
  primary-container: '#ff6b6b'
  on-primary-container: '#6d0010'
  inverse-primary: '#ffb3b0'
  secondary: '#755a1d'
  on-secondary: '#ffffff'
  secondary-container: '#fed88e'
  on-secondary-container: '#785d1f'
  tertiary: '#69519b'
  on-tertiary: '#ffffff'
  tertiary-container: '#a88ede'
  on-tertiary-container: '#3d246c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b0'
  on-primary-fixed: '#410006'
  on-primary-fixed-variant: '#8c1520'
  secondary-fixed: '#ffdea0'
  secondary-fixed-dim: '#e6c27a'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5b4304'
  tertiary-fixed: '#eaddff'
  tertiary-fixed-dim: '#d3bbff'
  on-tertiary-fixed: '#240554'
  on-tertiary-fixed-variant: '#513982'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
  sunset-orange: '#FF8A5B'
  emerald-green: '#4CAF8D'
  off-white: '#FAFAFA'
  border-gray: '#E6EAF0'
  background-alt: '#F5F7FA'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 32px
  gutter: 24px
  section-gap: 64px
---

## Brand & Style

This design system is built on the pillars of **Hospitality Modernism**. It rejects the cold, sterile aesthetic of traditional enterprise software in favor of warmth, tactility, and premium service. The brand personality is "The Digital Concierge"—elegant, proactive, and meticulously organized.

The visual style is a sophisticated blend of **Minimalism** and **Glassmorphism**. It prioritizes extreme clarity and generous whitespace to reduce cognitive load during complex event management. Tactile elements, such as soft layered shadows and high-radius corners, evoke the feeling of high-end physical stationery and luxury hotel interiors. The result is a high-performance SaaS tool that feels like a boutique lifestyle application.

## Colors

The palette centers on **Warm Coral**, a vibrant yet sophisticated primary hue that represents energy and celebration. This is balanced by **Champagne Gold** for accents of luxury and **Soft Lavender** for interactive highlights. 

Unlike typical enterprise platforms, this system uses **Emerald Green** sparingly for success states, maintaining a hospitality-first aesthetic. Backgrounds remain predominantly **Off White** to allow the rich primary gradients to stand out. Gradients should be used as subtle accents on primary actions or to denote high-level summary cards, ensuring the interface remains grounded and professional.

## Typography

The typography system utilizes **Hanken Grotesk** for headlines to provide a sharp, contemporary "editorial" feel that mimics high-fashion magazines and luxury branding. **Inter** is utilized for body copy and UI labels for its unparalleled legibility in data-dense SaaS environments.

Hierarchy is established through extreme scale contrasts. Large display titles are tightly tracked and bold, while body text remains spacious and airy. Labels often utilize slight uppercase tracking to provide a sense of refined "architectural" organization.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy for desktop layouts, centering content within a 1440px max-width container to maintain a curated, cinematic feel. A 12-column grid is used with generous 24px gutters.

The spacing rhythm is intentional and wide. We utilize a base-8 unit system but lean toward larger increments (32px, 48px, 64px) for layout margins to create a sense of luxury and "breathing room." On mobile, margins reduce to 16px, but vertical section gaps remain high to ensure the premium feel is maintained across form factors.

## Elevation & Depth

Depth is achieved through **Tonal Layering** combined with **Ambient Shadows**. Surfaces are tiered to represent hierarchy:
- **Level 0 (Background):** Off-white (#FAFAFA) flat surface.
- **Level 1 (Cards):** Pure White (#FFFFFF) with a soft 15% opacity shadow (Y: 4, Blur: 20) and a subtle 1px border (#E6EAF0).
- **Level 2 (Modals/Overlays):** Glassmorphism technique—60% white opacity with a 20px backdrop blur and a slight inner glow on the top edge.

Shadows should never be pure black; they are tinted with the `neutral_color` (#1F2937) at very low opacities to maintain a soft, natural appearance.

## Shapes

The shape language is defined by high-radius, friendly geometries. Standard components like buttons and input fields use an **8px (0.5rem)** radius, while larger containers and cards utilize **16px (1rem)** or **24px (1.5rem)**. 

This high level of roundedness softens the enterprise "edge" and aligns with modern hospitality design. Interactive elements should feel smooth and approachable, avoiding sharp corners entirely.

## Components

### Buttons
Primary buttons use the **Coral to Orange gradient** with white text. Hover states should feature a subtle scale-up (1.02x) and an increased shadow spread. Secondary buttons use a Champagne Gold outline with a light gold tinted background.

### Input Fields
Inputs are styled with a `background-alt` (#F5F7FA) fill and no border in their default state. Upon focus, they transition to a white background with a 1px `Primary` color border and a soft glow.

### Cards
Cards are the heart of the system. They must have a **24px roundedness** and use the Level 1 shadow. Header sections within cards should be separated by a subtle 1px horizontal rule (#E6EAF0).

### Chips & Tags
Used for event status (e.g., "Confirmed", "Pending"). These should use highly desaturated versions of the brand colors (e.g., pale lavender background with deep lavender text) to ensure they don't compete with primary actions.

### Glassmorphism Overlays
All dropdowns and slide-over panels must use the backdrop-blur effect to maintain visual context with the underlying workspace, evoking a sense of modern, layered sophistication.