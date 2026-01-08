# Tither Admin Web App Design Guidelines

## Design Approach

**Framework:** Material Design foundation with GoFundMe's clarity and Duolingo's playfulness, adapted for faith-based administrative workflows.

**Key Principles:**
- Clear hierarchy guiding non-technical users through complex processes
- Generous whitespace conveying trust and professionalism
- Bright accent moments for progress, success, and encouragement
- Subtle Catholic identity through iconography and language, not heavy visual treatment

## Typography

**Font Families:**
- Primary: Inter (via Google Fonts) - clean, readable for data and UI
- Headings: DM Sans (via Google Fonts) - friendly yet professional

**Type Scale:**
- Hero/Success Headlines: text-4xl md:text-5xl font-bold
- Section Headers: text-2xl md:text-3xl font-semibold
- Subsections: text-lg font-semibold
- Body: text-base
- Metrics/Numbers: text-3xl md:text-4xl font-bold (dashboard stats)
- Small/Helper: text-sm
- Micro-copy: text-xs

## Layout System

**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm

**Container Strategy:**
- Admin screens: max-w-7xl mx-auto px-6
- Onboarding wizard: max-w-2xl mx-auto (focused, centered)
- Dashboard: Full-width with inner max-w-7xl
- Public giving page: max-w-4xl mx-auto

**Grid Patterns:**
- Dashboard metrics: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
- Settings sections: grid-cols-1 lg:grid-cols-3 gap-8
- Donor list: Single column table/cards

## Component Library

### Navigation
**Top Navigation Bar:**
- Fixed header with logo left, nav tabs center, user profile right
- Height: h-16
- Tabs: Inline with px-6 py-4, active state with bottom border (border-b-2)
- Icons from Heroicons paired with labels

### Cards & Containers
**Metric Cards (Dashboard):**
- Rounded corners: rounded-xl
- Padding: p-6
- Border: border with subtle shadow (shadow-sm)
- Structure: Icon top-left, large number centered, label below, trend indicator bottom-right

**Content Cards:**
- Padding: p-8
- Border radius: rounded-lg
- Elevation: shadow-md on hover

### Forms & Inputs
**Input Fields:**
- Height: h-12
- Padding: px-4
- Border radius: rounded-lg
- Labels above with text-sm font-medium mb-2
- Helper text below with text-xs

**Buttons:**
- Primary CTA: h-12 px-8 rounded-lg font-semibold text-base
- Secondary: h-10 px-6 rounded-lg font-medium
- Icon buttons: h-10 w-10 rounded-lg

### Progress & Onboarding
**Wizard Steps:**
- Horizontal stepper at top showing 4-5 steps
- Current step highlighted with filled circle, completed with checkmark, upcoming outlined
- Step spacing: gap-4
- Step indicator size: h-10 w-10

**Success Celebrations:**
- Centered content with large icon (h-24 w-24)
- Headline + subtext + QR code display
- Primary CTA below for next action
- Confetti or subtle animation on mount

### Data Display
**Tables:**
- Row height: h-16
- Header: font-semibold with bg treatment
- Borders: border-b on rows
- Hover states on rows

**Empty States:**
- Centered icon (h-16 w-16)
- Headline + description + CTA
- Duolingo-inspired friendly illustration placeholder

## Public Giving Page Components

**Hero Section:**
- Organization logo centered, h-20
- Headline (organization name): text-3xl font-bold
- Donation amount selector with preset buttons ($25, $50, $100, Custom)
- Large primary CTA: "Give Now" button
- Trust badge footer: "Powered by Tither Pay • Secure processing"

**Content Modules:**
- About section with prose text (max-w-prose)
- Impact metrics in 3-column grid
- Recent activity feed with donor names (anonymized option)

## Micro-interactions

**Success States:**
- Checkmark animations on completion
- Gentle bounce on primary CTAs
- Slide-in notifications from top-right

**Loading States:**
- Skeleton screens matching content structure
- Spinner only for inline actions

**Transitions:**
- Page transitions: fade 150ms
- Modal/overlay: scale + fade 200ms
- Hover: transform scale-105 transition 150ms

## Images

**Dashboard:** No hero image - focus on metrics and quick actions

**Onboarding Wizard:** Small illustration icons for each step (64x64) showing organization, bank, checkmark, celebration

**Public Giving Page:**
- Optional organization photo banner (16:9 ratio, max-h-64)
- If no photo provided, subtle gradient header instead

**Success Screen:**
- Celebratory icon/illustration (hands raised, checkmark, church icon)
- QR code generated dynamically (200x200)

## Catholic Identity Elements

**Subtle Integration:**
- Cross icon in logo area (small, tasteful)
- "Bless" or "Grace" as part of success messaging
- Saint names as placeholder content where appropriate
- Liturgical calendar awareness for dashboard greetings

**Avoid:**
- Heavy religious imagery competing with functionality
- Stained glass patterns or ornate decorative elements
- Forced scriptural quotes in UI chrome