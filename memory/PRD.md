# WanderOn Safe Travel Landing Page - Product Requirements Document

## Project Overview
A conversion-optimized landing page for WanderOn, focusing on safe travel experiences across India with comprehensive safety features, destination showcases, and user testimonials.

## Original Problem Statement
Build a landing page similar to wanderon.in that emphasizes safe travel with WanderOn, featuring destination packages, safety protocols, and booking capabilities.

## User Personas
1. **Solo Travelers**: Safety-conscious individuals seeking verified travel experiences
2. **Group Travelers**: Friends/families looking for organized, safe group adventures
3. **Adventure Seekers**: People wanting exciting experiences without compromising safety

## Core Requirements (Static)

### Design Requirements
- Modern, trust-building design with emerald green color scheme
- Responsive layout for all device sizes
- Smooth animations and micro-interactions
- High-quality destination imagery
- Professional typography and spacing

### Functional Requirements
- Hero section with destination search
- Safety features showcase (6 key features)
- Destination cards with pricing and ratings
- Step-by-step "How It Works" timeline
- Customer testimonials with ratings
- Contact/inquiry form
- Comprehensive footer with navigation

### Technical Requirements
- React frontend with Shadcn UI components
- Tailwind CSS for styling
- Lucide React for icons
- Sonner for toast notifications
- Mock data architecture for easy backend integration

## What's Been Implemented (December 11, 2024)

### ✅ Frontend Components (Mock Data)

**Latest Update: Geopolitical Safety Features**
- Removed COVID-19 protocols (outdated)
- Added Real-Time Safety Monitoring feature
- Added Geopolitical Risk Assessment feature
- Created Safety Alert banner addressing Middle East tensions
- Updated messaging to emphasize global conflict monitoring

1. **Safety Alert Banner** (`/app/frontend/src/components/SafetyAlert.jsx`)
   - Dismissible alert about global travel safety
   - Mentions Middle East tensions monitoring
   - Reassures domestic India tours are unaffected
   - Real-time advisory information

2. **Navbar** (`/app/frontend/src/components/Navbar.jsx`)
   - Fixed navigation with scroll effects
   - Mobile responsive menu
   - Smooth scroll to sections

3. **Hero Section** (`/app/frontend/src/components/Hero.jsx`)
   - Updated badge: "Real-Time Global Safety Monitoring"
   - Updated subheading emphasizing "uncertain times"
   - Search form (destination, date, travelers)
   - Trust indicators (50K+ travelers, 4.8 rating, 100% safety)
   - Scroll indicator animation

4. **Safety Features** (`/app/frontend/src/components/SafetyFeatures.jsx`)
   - **NEW**: Real-Time Safety Monitoring - Live tracking of global events and conflict zones
   - **NEW**: Geopolitical Risk Assessment - Expert analysis ensuring safe routes
   - **REMOVED**: COVID-Safe Protocols (outdated)
   - **REMOVED**: Small Group Sizes (replaced)
   - Verified Travel Guides
   - 24/7 Emergency Support
   - Complete Travel Insurance
   - Quality Accommodations
   - Updated CTA about geopolitical tensions

4. **Destinations** (`/app/frontend/src/components/Destinations.jsx`)
   - 6 destination cards (Manali, Ladakh, Goa, Kashmir, Andaman, Meghalaya)
   - Star ratings and review counts
   - Pricing and booking CTAs
   - Image hover effects

5. **How It Works** (`/app/frontend/src/components/HowItWorks.jsx`)
   - 4-step timeline with visual connectors
   - Numbered steps with descriptions
   - Bottom CTA section

6. **Testimonials** (`/app/frontend/src/components/Testimonials.jsx`)
   - 4 customer testimonials with photos
   - 5-star ratings display
   - Stats section (satisfaction rate, trips completed)

7. **Contact CTA** (`/app/frontend/src/components/ContactCTA.jsx`)
   - Full contact information (phone, email, address)
   - Inquiry form with validation
   - Form fields: name, email, phone, destination, message

8. **Footer** (`/app/frontend/src/components/Footer.jsx`)
   - Company info and social links
   - Quick links navigation
   - Popular destinations
   - Contact details

9. **Mock Data** (`/app/frontend/src/data/mock.js`)
   - Destinations with pricing, ratings, images
   - Safety features data
   - Testimonials with user info
   - How it works steps
   - Stats and trust indicators

### Design Implementation
- ✅ Emerald green (#10b981) as primary brand color
- ✅ Professional spacing and typography
- ✅ Smooth animations (fadeInUp, hover effects)
- ✅ Trust-building color psychology
- ✅ No dark gradients (following guidelines)
- ✅ Lucide React icons (no emoji characters)
- ✅ Shadcn UI components
- ✅ Custom scrollbar styling
- ✅ Focus states for accessibility

## API Contracts (For Future Backend Implementation)

### Destinations API
```
GET /api/destinations
Response: Array of destination objects with id, name, location, duration, price, image, rating, reviews, badge

POST /api/destinations/:id/book
Request: { userId, travelers, date, preferences }
Response: { bookingId, status, confirmation }
```

### Inquiries API
```
POST /api/inquiries
Request: { name, email, phone, destination, message }
Response: { inquiryId, status, message }
```

### Search API
```
POST /api/search
Request: { destination, date, travelers }
Response: Array of matching trips/packages
```

### Testimonials API
```
GET /api/testimonials
Response: Array of testimonial objects with ratings and user info
```

## Mocked Data in mock.js
- ✅ 6 Destinations with complete details
- ✅ 6 Safety features
- ✅ 4 Testimonials with images
- ✅ 4 How It Works steps
- ✅ Stats (50K+ travelers, 200+ destinations, 4.8 rating, 100% safety)

## Prioritized Backlog

### P0 Features (Critical - Backend Integration)
- [ ] Backend API for contact form submission
- [ ] Database schema for inquiries
- [ ] Email notifications for new inquiries
- [ ] Backend API for destination search
- [ ] Admin panel for managing destinations

### P1 Features (High Priority)
- [ ] User authentication and profiles
- [ ] Real booking system with payment integration
- [ ] Trip details pages for each destination
- [ ] User dashboard for managing bookings
- [ ] Review and rating system

### P2 Features (Nice to Have)
- [ ] Blog section for travel tips
- [ ] Live chat support
- [ ] Newsletter subscription
- [ ] Social sharing capabilities
- [ ] Interactive map for destinations
- [ ] Photo gallery from past trips
- [ ] Travel insurance integration
- [ ] Multi-language support

## Next Action Items
1. **Immediate**: User can review the frontend landing page
2. **Phase 2**: Backend development
   - Set up FastAPI endpoints
   - Create MongoDB schemas for destinations, inquiries, bookings
   - Integrate contact form with database
   - Remove mock.js and connect to real APIs
3. **Phase 3**: Advanced features (booking, payments, user accounts)

## Technical Stack
- **Frontend**: React 19, Tailwind CSS, Shadcn UI
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Backend** (Future): FastAPI, MongoDB
- **Deployment**: Emergent Platform

## Performance Considerations
- Image optimization for destination photos
- Lazy loading for below-fold content
- Smooth scroll behavior
- Fast page load times with code splitting

## Conversion Optimization
- Clear CTAs throughout the page
- Trust indicators prominently displayed
- Social proof via testimonials
- Easy-to-use search and inquiry forms
- Mobile-first responsive design
