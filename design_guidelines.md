# Design Guidelines: SEEPE - Sistema de Localização de Setores

## Design Approach
**System Selected**: Clean, accessibility-focused design system inspired by Material Design principles
**Rationale**: Government/institutional directory requiring clarity, efficiency, and information hierarchy. Users need quick access to contact information and location details.

## Core Design Principles
1. **Information First**: Clear data hierarchy with easy scanning
2. **Accessibility**: High contrast, readable text, keyboard navigation
3. **Efficiency**: Minimal clicks to reach critical information
4. **Trust**: Professional, governmental aesthetic

## Typography System

### Font Family
- Primary: Inter (via Google Fonts CDN)
- Fallback: system-ui, -apple-system, sans-serif

### Type Scale
- **Hero/Display**: text-4xl (36px) font-bold
- **Page Titles**: text-3xl (30px) font-semibold
- **Section Headers**: text-2xl (24px) font-semibold
- **Card Titles**: text-xl (20px) font-semibold
- **Body Large**: text-lg (18px) font-normal
- **Body Regular**: text-base (16px) font-normal
- **Body Small**: text-sm (14px) font-normal
- **Labels/Meta**: text-xs (12px) font-medium uppercase tracking-wide

## Layout System

### Spacing Primitives
Use Tailwind units: **2, 4, 6, 8, 12, 16, 20** (e.g., p-4, m-8, gap-6)
- Micro spacing (within components): 2, 4
- Component padding: 4, 6, 8
- Section spacing: 12, 16, 20
- Page margins: 8, 12, 16

### Container Strategy
- **Max-width**: max-w-7xl for main content
- **Padding**: px-4 (mobile), px-6 (tablet), px-8 (desktop)
- **Page Layout**: Single column for focus, 2-3 columns for lists/grids

### Grid System
- Search results: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Statistics cards: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
- Detail sections: grid-cols-1 lg:grid-cols-3 (2/3 main content, 1/3 sidebar)

## Component Library

### Navigation
- **Header**: Fixed top, full-width, py-4, contains logo, main nav links, search icon
- **Logo**: SEE-PE text with government badge/seal icon
- **Nav Links**: Horizontal menu with hover underline indicator
- **Mobile**: Hamburger menu with slide-out drawer

### Hero Section (Homepage)
- **Height**: min-h-[400px] (not full viewport)
- **Layout**: Centered content with governmental building/education imagery as background
- **Content**: Large title, subtitle describing system, primary CTA button
- **Overlay**: Semi-transparent overlay for text readability
- **Stats Bar**: 3-4 stat cards below hero (Total Setores, Blocos, etc.)

### Search Component
- **Prominent placement**: Hero section and dedicated search page
- **Input**: Large (h-12), full-width on mobile, with search icon prefix
- **Advanced Filters**: Expandable section below main search (Bloco, Andar, Município dropdowns)
- **Autocomplete**: Dropdown suggestions as user types

### Cards (Setor Cards)
- **Structure**: Bordered cards with hover elevation effect
- **Padding**: p-6
- **Header**: Sigla (bold, larger) + Nome (regular)
- **Body**: Icon + text rows for Bloco, Andar, Email, Ramal
- **Footer**: Responsible persons, action buttons
- **Spacing**: gap-4 between elements

### Detail Page Layout
- **Main Content** (2/3 width):
  - Page title (Setor name + sigla)
  - Quick info grid (Bloco, Andar, Email in labeled boxes)
  - Description/Observações section
  - Responsáveis list with avatars/initials
  
- **Sidebar** (1/3 width):
  - Contact card (sticky position)
  - Phone numbers with click-to-call links
  - WhatsApp button if available
  - External contacts section

### List/Table Views
- **Phone Directory**: Table layout with sortable columns
- **Columns**: Setor | Ramal | Telefone | Actions
- **Row height**: py-4 for comfortable touch targets
- **Alternating rows**: Subtle background variation for readability

### Buttons & Actions
- **Primary CTA**: px-6 py-3, rounded-lg, font-medium
- **Secondary**: Outlined variant with same dimensions
- **Icon Buttons**: p-2, circular or square with rounded corners
- **Click-to-call**: tel: links styled as buttons with phone icon
- **WhatsApp**: Branded button with WhatsApp icon and API link

### Status & Badges
- **Última Atualização**: Small badge with clock icon
- **Ramal Count**: Pill-shaped badge showing number of phone lines
- **Building Blocks**: Letter badges (A, B, C, etc.) with distinct styling

### Icons
- **Library**: Heroicons (via CDN)
- **Usage**: 
  - Phone: phone icon
  - Email: envelope icon
  - Location: building/map-pin icon
  - Search: magnifying-glass icon
  - Filter: funnel icon
  - Person: user icon

### Empty States
- **No Results**: Centered message with search illustration icon
- **Guidance**: Suggest clearing filters or trying different keywords

### Loading States
- **Skeleton cards**: Animated pulse effect during data loading
- **Spinner**: Center-aligned for page transitions

## Accessibility Requirements
- **Form Labels**: All inputs have visible labels
- **Focus States**: Clear outline on keyboard focus (ring-2)
- **ARIA Labels**: All icon buttons have aria-label attributes
- **Contrast**: Ensure text meets WCAG AA standards
- **Touch Targets**: Minimum 44x44px for interactive elements

## Responsive Behavior
- **Mobile**: Single column, full-width cards, stacked navigation
- **Tablet**: 2-column grids, condensed filters
- **Desktop**: 3-column grids, sidebar layouts, expanded filters always visible

## Images
- **Hero Background**: Government building or education-themed imagery (classroom, students, institutional architecture). Low opacity overlay to ensure text readability.
- **Empty State Illustrations**: Simple line illustrations for no-results scenarios

This design creates a professional, efficient directory system optimized for finding sector information quickly while maintaining governmental credibility and accessibility standards.