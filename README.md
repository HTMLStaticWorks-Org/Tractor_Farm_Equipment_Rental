# IRONFIELD Agri Rentals — Tractor & Farm Equipment Rental Website Template

A rugged, commercial-grade, responsive **Tractor & Farm Equipment Rental Website Template** built with **Bootstrap 5.3, HTML5, CSS3, Vanilla JavaScript, and GSAP**.

## Pages Included (9 Core Pages)

1. **`index.html` (Home 1 — Field Power Showcase)**: Cinematic hero with live yard telemetry, quick machinery finder, popular equipment divisions, featured machinery grid, 50-point inspection standards, 4-step rental workflow, seasonal Kharif/Rabi packages, verified farmer testimonials, and conversion CTA.
2. **`home-2.html` (Home 2 — Editorial & Fleet Matrix)**: Architectural split hero, horsepower-to-acreage index, interactive Daily/Weekly/Monthly INR tariff preview switcher, crop-stage tabbed machinery matrix, operational downtime storytelling, and technical FAQ accordion.
3. **`equipment.html` (Equipment Catalogue)**: Features 17 agricultural machines across all 4 core categories and 15 sub-types (*Heavy-Duty Tractors, Utility Tractors, Compact Tractors, Rotavators, Cultivators, Disc Harrows, Ploughs, Seed Drills, Planters, Harvesters, Threshers, Trailers, Sprayers, Water Pumps, Agricultural Implements*), editorial flagship spotlight cards, live search/category/sub-type/availability filters, Grid/List view switcher, and interactive technical specification modals.
4. **`rates.html` (Rental Pricing & Terms)**: Structured INR (`₹`) pricing tables across all equipment divisions, duration comparison cards, an interactive Rental Cost Estimator widget, and explicit policy disclosures for dry-rate fuel, optional certified operators, delivery charges, and refundable security deposits.
5. **`about.html` (Company & Maintenance Standards)**: Company story, 65+ unit owned fleet overview, 50-point 4-stage mechanical bay checklist, and 4-hour mobile service van SLA.
6. **`contact.html` (Contact & Rental Enquiry)**: Direct phone, email, and WhatsApp dispatch links, interactive OpenStreetMap yard location & Google Maps directions, and a validated Rental Enquiry Form with automatic URL parameter pre-selection (`?equipment=...`).
7. **`dashboard.html` (Farmer Dashboard)**: Full-height left sidebar portal with Logout button (`login.html`), KPI cards, Date-Based Equipment Booking scheduler with live INR preview (`localStorage` persisted), filterable Rental Tracking table, and itemized Bills & Invoices modal viewer.
8. **`login.html` (Farmer / Client Login)**: Standalone centered-card authentication UI with top-center brand logo, password visibility toggle, inline Remember Me & Forgot Password row, Google & Apple quick-continue buttons, and forgot-password modal.
9. **`signup.html` (Farmer / Client Registration)**: Standalone centered-card registration UI with separate-line inputs, password visibility toggles, password confirmation match check, rental terms modal, and Google & Apple quick-continue buttons.

## Key Features & Customization

- **Light/Dark Theme & RTL Support**: Both `[data-theme="light"|"dark"]` and `[dir="ltr"|"rtl"]` toggles persist across pages via `localStorage` (`ironfield_theme_preference` and `ironfield_dir_preference`).
- **Centralized Data & Assets**: All equipment availability, specifications, INR (`₹`) pricing, and business contact details are defined in [`assets/js/data.js`](assets/js/data.js), backed by local machinery imagery in `assets/images/`.
  - Edit `window.IRONFIELD_CONFIG` to update phone numbers, WhatsApp number, email, yard address, and operator/delivery surcharges.
  - Edit `window.EQUIPMENT_DATA` to add, remove, or modify tractors, harvesters, implements, daily/weekly/monthly INR rates, and availability status badges.

