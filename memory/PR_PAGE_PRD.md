# WanderOn Safe Travel PR Page - Product Requirements Document

## Project Overview
PR landing page promoting safe international travel alternatives to Europe/Middle East due to Iran-Israel-US conflict, featuring WanderOn branding and curated trip packages from real API data.

## Original Problem Statement
Build a PR page inspired by travelsafely.in to promote safe international destinations this summer as alternatives to Europe, using WanderOn API data, theme colors, and Roboto font.

## WanderOn Branding
- **Primary Brand Color**: #01AFD1 (Cyan/Turquoise)
- **Primary Color**: #FEE60B (Yellow)
- **Secondary Color**: #015F74 (Dark Teal)
- **Font**: Roboto (300, 400, 500, 700, 900)
- **Tone**: Reassuring + Inspiring

## Implementation (December 11, 2024)

### ✅ Core Components Created

1. **index.css** - Updated with WanderOn theme
   - Roboto font import
   - Custom CSS variables for brand colors
   - Smooth scrolling with offset
   - Custom scrollbar in brand colors
   - Animation keyframes

2. **PRHero.jsx** - Hero section
   - Gradient background (cyan to dark teal)
   - Red pulsing alert badge
   - Strong safety message
   - Trust indicators (50K+ trips, 120+ destinations, 4.8★)
   - Dual CTAs (Explore Destinations, Read Advisory)
   - Scroll indicator

3. **StickyNav.jsx** - Sticky destination navigation
   - Sticks below header on scroll
   - Desktop: Horizontal nav with 8 destinations
   - Mobile: Dropdown selector
   - Active section highlighting
   - WanderOn logo display

4. **AdvisoryBanner.jsx** - Travel advisory section
   - 3 key concerns (Geopolitical, Flight Disruptions, Travel Advisories)
   - WanderOn recommendation box with CTAs
   - Source attribution
   - Gradient styling

5. **DestinationsIntro.jsx** - Benefits section
   - 4 key benefits (40% savings, perfect weather, shorter flights, zero risk)
   - Icon cards with hover effects
   - Divider message

6. **TripCard.jsx** - Individual trip card
   - Trip image with hover overlay
   - Rating badge
   - Duration display
   - Highlights tags
   - Price and Book Now CTA
   - External link to wanderon.in/trips/{slug}

7. **DestinationSection.jsx** - Destination category section
   - Reusable component for each country
   - Gradient badge header
   - Description
   - Responsive grid (1-3 columns based on trip count)
   - Animated cards

8. **FAQSection.jsx** - FAQ accordion
   - 8 comprehensive questions
   - Expandable answers
   - Contact CTA box
   - WanderOn color scheme

9. **PRFooter.jsx** - Footer
   - Company info with WanderOn logo
   - Social media links
   - Quick links
   - Popular destinations
   - Contact information
   - Copyright and policies

### ✅ Data Structure

**safeTravel.js** - Curated API data:
- Bali: 3 trips (Zamna Festival, Day Zero, Nusa Penida)
- Thailand: 1 trip (Songkran Festival)
- Vietnam: 2 trips
- Singapore & Malaysia: 2 trips
- Maldives: 2 trips
- Mauritius: 2 trips
- Turkey: 1 trip
- Egypt: 1 trip
- Advisory content
- FAQ data (8 questions)
- Stats

### ✅ Features Implemented

1. **Sticky Navigation**: Destination anchors stick below header, highlights active section
2. **Real API Data**: Filtered trips with visibility: true from WanderOn API
3. **Individual Trip Links**: Each card links to https://wanderon.in/trips/{slug}
4. **Destination Sections**: 8 separate sections (Bali, Thailand, Vietnam, Singapore, Maldives, Mauritius, Turkey, Egypt)
5. **FAQ Accordion**: 8 questions with expandable answers
6. **WanderOn Theme**: Complete color scheme, Roboto font, brand styling
7. **Responsive Design**: Mobile-friendly navigation and layouts
8. **External Links**: All CTAs link to wanderon.in pages
9. **Smooth Animations**: Fade-in-up effects, hover transforms
10. **Trust Building**: Stats, ratings, reviews, safety messaging

### ✅ Page Structure

```
- Sticky Navigation (destinations menu)
- Hero (advisory + safety message)
- Advisory Banner (3 concerns + recommendation)
- Destinations Intro (4 benefits)
- Bali Section (3 trip cards)
- Thailand Section (1 trip card)
- Vietnam Section (2 trip cards)
- Singapore & Malaysia Section (2 trip cards)
- Maldives Section (2 trip cards)
- Mauritius Section (2 trip cards)
- Turkey Section (1 trip card)
- Egypt Section (1 trip card)
- FAQ Section (8 questions)
- Footer (links, contact, social)
```

## Technical Stack
- **Frontend**: React 19, Tailwind CSS, Shadcn UI
- **Icons**: Lucide React
- **Font**: Roboto (Google Fonts)
- **API**: WanderOn trips-all API
- **Colors**: WanderOn brand palette

## Trip Selection Criteria
- visibility: true (from API)
- International destinations only
- Safe regions (Southeast Asia, Islands, Turkey, Egypt)
- No Europe or Middle East conflict zones
- Diverse price ranges (₹47,999 - ₹1,39,999)

## Next Action Items
- Page is live and fully functional
- All links point to wanderon.in
- Ready for content updates as needed
- Can add more destinations from API if required
