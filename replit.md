# The Integrity Auto and Body - Automotive Business Platform

## Overview

This is a comprehensive automotive business platform built for The Integrity Auto and Body, designed to streamline used car sales, repair services, and customer engagement. The application features a modern full-stack architecture with React frontend and Node.js backend, utilizing PostgreSQL through Supabase for data persistence.

## System Architecture

### Frontend Architecture
- **React.js** with TypeScript for type-safe component development
- **Wouter** for lightweight client-side routing
- **Tailwind CSS** with Shadcn/UI component library for consistent styling
- **TanStack Query** for server state management and caching
- **Framer Motion** for smooth animations and transitions
- **Vite** as the build tool and development server

### Backend Architecture
- **Node.js** with Express.js framework
- **TypeScript** throughout the entire codebase
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** hosted on Supabase for data storage
- **Session-based authentication** for admin functionality

### Data Storage Solutions
- **Supabase PostgreSQL** as the primary database
- **Drizzle ORM** schema definitions shared between client and server
- **Connection pooling** through Supabase's pgBouncer
- **Image storage** through Supabase Storage (configured but not fully implemented)

## Key Components

### Database Schema
The application uses a comprehensive schema with the following main entities:
- **Cars**: Complete vehicle inventory with detailed specifications
- **Services**: Auto repair and maintenance service offerings
- **Testimonials**: Customer reviews and ratings
- **Service Bookings**: Appointment scheduling system
- **Contact Messages**: Customer inquiries and communications
- **Admin Credentials**: Secure admin authentication
- **Sessions**: Admin session management

### Core Features
1. **Car Inventory Management**: Browse, search, filter, and compare vehicles
2. **Service Booking System**: Schedule automotive services with calendar integration
3. **Customer Testimonials**: Display and manage customer reviews
4. **Payment Calculator**: EMI and financing calculations
5. **VIN Decoder Integration**: Automatic vehicle information extraction
6. **Price History Tracking**: Monitor vehicle pricing trends
7. **Social Media Sharing**: One-click sharing to Facebook, Twitter, LinkedIn, WhatsApp
8. **Car History Reports**: Integration with vehicle history services for accident and maintenance records
9. **Social Proof Badges**: Real-time engagement indicators (views, interest level, popularity)
10. **Admin Panel**: Comprehensive content management system
11. **Mobile-Responsive Design**: Optimized for all device sizes

### UI Components
- Custom car cards with image carousels and social sharing
- Advanced filtering system with multiple criteria
- Testimonial carousel with auto-advance
- Payment calculator with loan estimation
- VIN decoder for vehicle information lookup
- Social sharing component with platform-specific formatting
- Floating share button with scroll activation
- Dynamic meta tags for optimal social media previews
- Car history report with accident records and service timeline
- Social proof badges with engagement metrics
- Image upload component (Supabase integration ready)

## Data Flow

1. **Client Requests**: React components use TanStack Query for data fetching
2. **API Layer**: Express.js routes handle HTTP requests and validation
3. **Database Operations**: Drizzle ORM performs type-safe database queries
4. **Response Handling**: Structured JSON responses with error handling
5. **State Management**: TanStack Query manages caching and synchronization

### API Endpoints
- `/api/cars` - Vehicle inventory management
- `/api/services` - Service offerings
- `/api/testimonials` - Customer reviews
- `/api/service-bookings` - Appointment scheduling
- `/api/contact-messages` - Customer inquiries
- `/api/admin/*` - Administrative functions

## External Dependencies

### Database & Storage
- **Supabase**: PostgreSQL hosting and management
- **Drizzle Kit**: Database migrations and schema management

### Authentication
- **Session-based auth**: Express sessions with PostgreSQL storage
- **Admin panel**: Secure credential-based access

### UI & Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Shadcn/UI**: Pre-built component library

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **Vite**: Fast development and build tooling
- **ESBuild**: Production bundle optimization

## Deployment Strategy

### Development Environment
- **Replit**: Cloud-based development environment
- **Hot reload**: Vite dev server with HMR
- **Database**: Direct Supabase connection

### Production Configuration
- **Node.js**: Runtime environment
- **Express server**: Serves both API and static files
- **Build process**: Vite builds client, ESBuild bundles server
- **Environment variables**: Database URLs, session secrets
- **Port configuration**: Configurable port (default 5000)

### Build Commands
- `npm run dev`: Development server with hot reload
- `npm run build`: Production build (client + server)
- `npm run start`: Production server
- `npm run db:push`: Database schema deployment

## Changelog
- June 13, 2025: Initial setup
- June 13, 2025: Resolved Supabase contact form integration issue - created proper table recreation scripts with camelCase column mapping
- June 14, 2025: Implemented comprehensive social media sharing feature with one-click sharing to Facebook, Twitter, LinkedIn, and WhatsApp, including dynamic meta tags and floating share buttons
- June 14, 2025: Added Car History Reports with simulated vehicle data and Social Proof Badges showing engagement metrics
- June 14, 2025: Completed real analytics tracking system with Supabase database integration - replaced simulated social proof data with actual user engagement tracking including page views, contact clicks, phone clicks, share counts, and time spent on listings
- June 14, 2025: Added Vercel deployment configuration with comprehensive deployment guide for production hosting
- June 19, 2025: Enhanced filtering system with scroll-to-top functionality, round ball sliders, multiple make selection, dynamic make/model lists that auto-update when new cars are added, and apply button controls for better user experience
- June 19, 2025: Fixed UI issues including extra dollar sign in price display, removed car history report feature, cleaned up image carousel spacing, and resolved TypeScript errors in form components
- June 19, 2025: Completed dynamic filtering system implementation - both simple and advanced filters now pull makes, fuel types, and other options directly from the Supabase database instead of hardcoded values, ensuring filters automatically update when new cars are added
- June 19, 2025: Fixed Supabase admin login issues by correcting schema column naming mismatches (passwordHash vs password_hash, isActive fields) and resolved contact messages API errors by aligning database table structure with schema definitions
- June 19, 2025: Implemented real price history tracking system - replaced simulated price data with actual database-driven price tracking that automatically records changes when car prices are updated in the admin panel, displaying authentic price history with reasons and timestamps
- June 20, 2025: Fixed admin authentication system - resolved password hashing issue and confirmed admin login credentials (admin/integrity2024), cleaned up price history to show only real data with natural language descriptions like "Price increased" and "Price decreased" instead of technical terms
- June 22, 2025: Implemented professional color palette redesign - replaced yellow/purple theme with clean blue and gray automotive colors, enhanced visual consistency across all components, improved button animations and form styling, updated status badges and admin panel theming for a more trustworthy dealership appearance
- June 22, 2025: Enhanced mobile layout visibility - improved contact button styling with larger text and better contrast, enhanced status badge visibility with borders and bold typography, added mobile-optimized CSS classes for better touch interactions, ensured "Call About This Car" and "Email us" buttons are highly visible on mobile devices
- June 22, 2025: Redesigned mobile navigation with professional side panel - implemented clean white background layout with organized sections including black header with logo, dedicated contact section, and admin functions at bottom, improved user experience with smooth transitions and proper visual hierarchy
- June 22, 2025: Completely redesigned "Book Your Services Today" section - implemented modern professional layout with gradient service cards, enhanced visual design with hover animations, clear pricing displays, service features lists, and improved call-to-action sections for better user engagement and conversion
- June 22, 2025: Simplified services section to informational showcase - removed individual pricing and booking buttons, focused on displaying available services with professional benefits and single contact call-to-action for better user experience and service inquiry flow
- June 22, 2025: Implemented professional admin access via footer discretion - removed all visible admin links from navigation and moved to discrete "Staff Login" in footer copyright line, following industry standard dealership practices for clean public interface
- June 22, 2025: Enhanced car sorting functionality - expanded from 5 to 12 comprehensive sorting options including newest/oldest, price high/low, year newest/oldest, mileage high/low, most popular, recently viewed, alphabetical, and best value calculations with proper backend database implementation
- June 22, 2025: Added Privacy Policy and Terms of Service pages - implemented "Coming soon" placeholder pages with business contact information and proper routing, made footer links functional with professional styling
- June 22, 2025: Enhanced scroll-to-top functionality - implemented comprehensive smooth scrolling behavior for all navigation links across desktop and mobile, created ScrollLink component for consistent page-top navigation, updated navbar and footer links to automatically scroll to top when clicked
- June 22, 2025: Fixed price history component - removed "Market insights" section with redundant new listing text, implemented proper price trend graph that displays when cars have actual price changes, fixed TypeScript null safety issues for cleaner component behavior
- June 23, 2025: Implemented centralized color system - created unified CSS variable system for entire website styling, removed all purple colors and inconsistent styling, added comprehensive color documentation and easy theme switching capability, standardized all components to use centralized variables for maintainable global styling changes
- June 23, 2025: Updated to professional clean theme - replaced bright blue with sophisticated slate gray primary color, implemented refined neutral palette with clean whites and modern grays, enhanced typography with improved letter spacing and font weights, added elegant shadow system and refined visual hierarchy for premium automotive dealership appearance
- June 23, 2025: Standardized homepage section backgrounds - removed all hardcoded purple, yellow, and gray backgrounds from hero, about, featured cars, services, testimonials, and CTA sections, updated all text colors and button styling to use centralized CSS variables, ensured complete visual consistency across all homepage sections using the professional clean color palette
- June 23, 2025: Enhanced button visibility and styling - improved "View All Cars" homepage button, removed unwanted icon shadows from car sales/repairs/limo service icons, fixed services page background text blocking issue, enhanced car card button styling with better contrast and professional appearance, improved navbar call-to-action buttons with enhanced visibility and shadow effects
- June 23, 2025: Fixed service card text overlap issue - removed decorative gradient element that was cutting off service benefit text in the top right corner of service cards, ensuring all text is fully readable
- June 23, 2025: Updated to professional navy blue color palette - changed from slate gray to sophisticated navy blue theme (hsl(218, 81%, 25%)) for enhanced trustworthiness and premium automotive dealership appearance, updated all complementary colors including secondary, accent, and border elements to maintain visual cohesion
- June 23, 2025: Implemented modern typography system - introduced Inter and Space Grotesk fonts with comprehensive typography hierarchy, added special typography classes (hero-title, section-title, card-title, price-text), enhanced text readability with optimized letter spacing and line heights, applied modern font styling throughout homepage and car cards for cool, clean, and professional appearance
- June 23, 2025: Fixed homepage text visibility issues - resolved invisible hero title by removing gradient text effect and adding white color with text shadows, enhanced ROYAL PRIESTHOOD section visibility with proper contrast, fixed non-clickable staff login link by simplifying nested link structure
- June 23, 2025: Enhanced admin panel mobile layout - improved navigation tab spacing by replacing cramped 5-column grid with responsive flexbox layout, added proper mobile optimization with flexible sizing and readable text, fixed TypeScript errors by correcting contact message field references to match database schema
- June 23, 2025: Fixed mobile text visibility issues - enhanced footer text contrast with white headings and light gray content for better readability, improved payment calculator visibility with white backgrounds and proper borders, fixed dropdown animations with smooth slide effects and enhanced hover states for better user experience on mobile devices
- June 23, 2025: Implemented complete Apple-inspired design system - changed primary color to clean system blue (hsl(211, 100%, 50%)), refined entire color palette with minimal neutral grays, enhanced typography with Apple-style font weights and letter spacing, upgraded shadow system with subtle refined shadows, improved component styling with larger border radius (1rem) and enhanced animations for modern, clean aesthetic similar to Apple's design language
- June 23, 2025: Reorganized CSS into modular architecture - split index.css into organized files (variables.css, typography.css, animations.css, shadows.css, components.css) for better maintainability, enhanced contact page with Apple-inspired styling including hero section, contact cards, form styling, and FAQ section, ensured text visibility with high-contrast classes and proper color management throughout website
- June 23, 2025: Added comprehensive careers page - created dedicated careers section with 6 default job postings (Sales Consultant, Automotive Technician, Service Advisor, Finance Manager, Parts Specialist, Detailing Specialist), included detailed job descriptions with requirements, responsibilities, benefits, and salary ranges, implemented application process with direct email integration, added careers navigation to navbar and footer for easy access

## User Preferences

Preferred communication style: Simple, everyday language.