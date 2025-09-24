# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lynkable (링커블)** - Korean influencer marketing platform connecting Korean brands with Southeast Asian influencers through group buying campaigns. Built as a progressive web app (PWA) with TWA (Trusted Web Activity) Android support.

**Tech Stack**: Next.js 15 (App Router), React 19, TypeScript, Supabase, Tailwind CSS, PWA

## Development Commands

### Core Development
```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Clean build (removes .next directory)
npm run build:clean

# Fast build with debug
npm run build:fast

# Bundle analysis
npm run analyze

# PWA validation
npm run pwa:check
```

### Build Variants
- `npm run build:pwa` - Production PWA build
- `npm run dev:clean` - Clean development start

## Architecture Overview

### Application Structure
- **App Router**: Next.js 15 app directory structure (`src/app/`)
- **PWA Layer**: Service worker, offline support, native app features
- **TWA**: Android wrapper (`twa-app/`) for native app store distribution
- **Authentication**: Supabase Auth with SSR support
- **Real-time**: Supabase realtime subscriptions for chat functionality
- **Mobile-First**: Responsive design with mobile tab navigation

### Key Directories
- `src/app/` - App Router pages and layouts
- `src/components/` - Shared React components
- `src/lib/` - Utilities and service configurations
- `src/hooks/` - Custom React hooks for PWA features
- `twa-app/` - Android TWA wrapper application
- `public/` - Static assets, PWA manifest, logos

### Core Features
1. **Campaign Management** - Brand-influencer campaign creation and matching
2. **Real-time Chat** - Supabase realtime messaging between brands and influencers
3. **Dashboard Analytics** - Performance metrics with Chart.js visualizations
4. **PWA Features** - Offline support, native gestures, haptic feedback
5. **Authentication** - Supabase Auth with middleware protection

## Key Architectural Patterns

### Supabase Integration
- **Client-side**: `@/lib/supabase/client` for browser operations
- **Server-side**: `@/lib/supabase/server` for SSR/API routes
- **Middleware**: `@/lib/supabase/middleware` for session management
- **Types**: `@/lib/database.types.ts` for type safety

### PWA Architecture
- **Layout**: Mobile-first with adaptive navigation (`MobileTabNavigation.tsx`)
- **Features**: PWA install prompts, network status, native toasts
- **Hooks**: `usePWAFeatures()`, `useNativeToast()` for PWA functionality
- **Gestures**: Swipe navigation for mobile app-like experience

### Route Structure
- `/` - Landing page with hero section and campaign forms
- `/campaigns` - Campaign listing and management
- `/campaigns/[id]` - Individual campaign details with admin/match/upload subpages
- `/influencers` - Influencer directory and profiles
- `/dashboard` - Analytics dashboard with performance metrics
- `/chat` - Real-time messaging interface
- `/auth` - Authentication pages with Supabase callbacks

### Component Architecture
- **Layout Components**: `AdaptiveLayout`, `NavBar`, mobile navigation
- **PWA Components**: Install prompts, status indicators, network monitoring
- **Shared UI**: Reusable cards, forms, and interactive elements
- **Chart Integration**: Chart.js for dashboard analytics

## Development Guidelines

### Supabase Configuration
Environment variables required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### PWA Development
- Service worker registration in `next.config.ts` with `next-pwa`
- Manifest configuration for app-like behavior
- iOS-specific meta tags and splash screens in layout
- Offline-first caching strategy with NetworkFirst handler

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` maps to `./src/*`
- Next.js plugin integration for App Router types

### Mobile & TWA Considerations
- Android TWA wrapper in `twa-app/` directory
- Mobile-first responsive design
- Touch gestures and haptic feedback integration
- Safe area handling for mobile browsers

### Real-time Features
- Supabase realtime subscriptions for chat messages
- Automatic scroll-to-bottom for new messages
- Channel cleanup on component unmount

## TWA (Android) Development

The `twa-app/` directory contains an Android wrapper using Trusted Web Activity:
- Gradle-based build system
- Release builds available as `.aab` (Android App Bundle)
- Custom app icons and splash screens
- Manifest configuration for native app store distribution

Build TWA: Navigate to `twa-app/` and use standard Android Gradle commands.

## Project Context

This is a bilingual (Korean/English) platform focusing on:
- Korean brand expansion to Southeast Asian markets
- Influencer marketing automation and matching
- Group buying campaign management
- Multi-platform social media integration (Instagram, TikTok, YouTube Shorts)
- E-commerce integration (Shopify, Amazon, Q10, Payoneer)

## Important Development Notes

### Testing Framework
- No test framework is currently configured
- To add testing, consider Jest with Testing Library for unit/integration tests
- Use `npm install --save-dev jest @testing-library/react @testing-library/jest-dom`

### Development Considerations
- ESLint errors don't fail builds (configured in next.config.ts)
- PWA is disabled in development mode for easier debugging
- Service worker registration only occurs in production builds
- TypeScript strict mode is enabled with path aliases (`@/*` → `./src/*`)