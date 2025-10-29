# Header System Documentation

## Overview

Header system yang dibuat dari scratch dengan struktur modular dan optimal untuk B2C dan B2B.

## File Structure

```
resources/js/components/header/
├── B2CHeader.tsx              # Header untuk halaman B2C
├── B2BHeader.tsx              # Header untuk halaman B2B
├── components/
│   ├── Logo.tsx               # Komponen logo dengan variant B2C/B2B
│   ├── Navigation.tsx         # Komponen navigasi desktop
│   └── MobileMenu.tsx        # Komponen mobile menu
├── hooks/
│   └── useMobileMenu.ts      # Custom hook untuk mobile menu
├── types/
│   └── index.ts              # TypeScript interfaces
├── constants/
│   └── index.ts              # Konstanta navigasi dan konfigurasi
└── index.ts                  # Export semua komponen
```

## Features

### B2C Header

- Logo: "CAHAYA ANBIYA" + "WISATA INDONESIA"
- Navigation: Home, Destinations, Packages, About Us, Contact
- Actions: Login, Register buttons
- Mobile menu dengan slide-out dari kanan

### B2B Header

- Logo: "CAHAYA ANBIYA B2B" + "BUSINESS PORTAL"
- Navigation: Dashboard, Packages, Customers, Reports, Settings
- Actions: Profile, Logout buttons
- Mobile menu dengan slide-out dari kanan

### Common Features

- ✅ Sticky header (position: fixed)
- ✅ Scroll effect (background blur saat scroll)
- ✅ Mobile responsive
- ✅ Smooth animations
- ✅ Keyboard navigation (ESC to close)
- ✅ Auto-close on window resize
- ✅ Body scroll lock saat mobile menu open
- ✅ Backdrop blur effect
- ✅ Proper z-index layering

## CSS Integration

- Header positioning: `position: fixed !important`
- Z-index: `9999 !important`
- Height: `80px !important`
- Main content padding: `padding-top: 80px !important`
- Mobile optimizations included

## Usage

```tsx
// B2C Layout
import { B2CHeader } from '@/components/header';

// B2B Layout
import { B2BHeader } from '@/components/header';
```

## Technical Details

- Built with React 18 + TypeScript
- Uses Inertia.js for navigation
- Tailwind CSS for styling
- Custom hooks for state management
- Modular component architecture
- Zero dependencies on old header system
- Clean separation of concerns
