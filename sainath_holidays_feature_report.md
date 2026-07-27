# 🌴 Sainath Holidays — Comprehensive Feature Report

> **Project:** Tour & Travel Agency Management System  
> **Report Date:** July 25, 2026  
> **Architecture:** Full-Stack (React + Spring Boot)

---

## 📐 Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI Framework |
| TypeScript | 5.2 | Type Safety |
| Vite | 5.2 | Build Tool |
| TailwindCSS | 3.4 | Styling |
| Framer Motion | 11.0 | Animations |
| TanStack Query | 5.28 | Data Fetching & Caching |
| Zustand | 4.5 | Global State Management |
| React Router DOM | 6.22 | Client-Side Routing |
| Axios | 1.6 | HTTP Client |
| React Leaflet | 4.2 | Interactive Maps |
| React Hook Form | 7.72 | Form Management |
| Radix UI | — | Accessible UI Primitives |
| Lucide React | 0.364 | Icon Library |
| date-fns | 4.1 | Date Formatting |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Spring Boot | 3.2.4 | Application Framework |
| Java | 17 | Runtime |
| Spring Security | — | Auth & Authorization |
| Spring Data JPA | — | ORM / Database Layer |
| PostgreSQL | — | Primary Database |
| Redis | — | OTP Storage & Caching |
| jjwt | 0.12.5 | JWT Token Management |
| Spring OAuth2 Client | — | Google SSO |
| Spring Mail | — | OTP Email Delivery |
| MapStruct | 1.5.5 | DTO Mapping |
| Lombok | 1.18 | Boilerplate Reduction |
| SpringDoc / Swagger | 2.3 | API Documentation |
| Spring Actuator | — | Health & Metrics |
| Docker | — | Containerization |

---

## 🖥️ FRONTEND FEATURES

### 1. 🔐 Authentication System

**Files:** [Login.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/features/auth/Login.tsx) · [OAuth2Callback.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/features/auth/OAuth2Callback.tsx) · [useAuthStore.ts](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/store/useAuthStore.ts)

| Feature | Details |
|---|---|
| **Email/Password Login** | Standard email & password login form with validation |
| **Phone + OTP Login** | Two-step phone number entry → 6-digit OTP verification |
| **Google OAuth2 SSO** | One-click "Sign in with Google" using OAuth2 redirect flow |
| **Token Management** | JWT Access Token + Refresh Token stored via Zustand |
| **Protected Routes** | `ProtectedRoute` component guards authenticated & admin-only pages |
| **Role-Based Access** | Admins see a "Dashboard" link in the navbar; regular users do not |
| **Persistent Auth State** | Zustand state with hydration keeps users logged in across sessions |
| **Redirect on Login** | After login, user is redirected back to the page they originally requested |

---

### 2. 🏠 Home Page

**File:** [Home.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/features/home/Home.tsx)

| Feature | Details |
|---|---|
| **Hero Section** | Split-layout hero with animated text, travel imagery grid, and floating trust badge (10k+ travelers) |
| **Featured Packages Grid** | Fetches the 6 newest packages via TanStack Query; rendered as `PackageCard` components |
| **Interactive Leaflet Map** | Full-width map with clickable markers for all active packages, linked to package detail |
| **CTA Section** | Glassmorphism fullscreen overlay CTA with "Get a Free Quote" and "Speak to an Expert" buttons |
| **Trust Badges** | "Verified", "Secure Pay", "24/7 Support" badge strip |
| **Framer Motion Animations** | Entrance animations on hero text, image grid, and CTA section (whileInView) |
| **Dark Mode Support** | Full light/dark theme compatibility throughout |

---

### 3. 📦 Tour Packages

**Files:** [PackageList.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/features/packages/PackageList.tsx) · [PackageDetail.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/features/packages/PackageDetail.tsx) · [PackageCard.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/features/packages/PackageCard.tsx)

| Feature | Details |
|---|---|
| **Package Listing** | Paginated grid of all active tour packages with category filtering |
| **Category Filter** | Filter by: DOMESTIC, INTERNATIONAL, ADVENTURE, HONEYMOON, PILGRIMAGE, WILDLIFE, BEACH, CULTURAL |
| **Sort & Pagination** | Sort by `createdAt`, `price` etc. with configurable page size |
| **Package Card** | Card with primary image, category badge, location, duration, price, and "View Details" button |
| **Package Detail Page** | Full-screen image banner with gradient overlay, thumbnails gallery, tabbed day-wise itinerary |
| **Image Gallery** | Horizontal scrollable thumbnail strip; clicking changes the main hero image |
| **Day-wise Itinerary** | Accordion-style expandable day entries with animated open/close (Framer Motion) |
| **Sticky Booking Sidebar** | Sticky right panel showing price, "Send Enquiry" button, and trust checkmarks |
| **Enquiry CTA** | Navigates to enquiry form pre-filled with the package ID |
| **Skeleton Loading** | Animated pulse skeleton shown while data is fetching |

---

### 4. 🏨 Hotels (Public)

**File:** [PublicHotels.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/features/hotels/PublicHotels.tsx)

| Feature | Details |
|---|---|
| **Hotel Listing** | Public page listing all active hotels fetched from the backend |
| **Hotel Cards** | Display hotel name, location, star rating, price per night, and amenities |
| **Enquiry Integration** | Users can inquire about a hotel via the enquiry system |

---

### 5. 🚗 Vehicles (Public)

**File:** [PublicVehicles.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/features/vehicles/PublicVehicles.tsx)

| Feature | Details |
|---|---|
| **Vehicle Listing** | Public catalog of available vehicles with availability filtering |
| **Vehicle Cards** | Shows vehicle name, type, capacity, price per day, and availability status |

---

### 6. 🎫 Tickets (Public)

**File:** [PublicTickets.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/features/tickets/PublicTickets.tsx)

| Feature | Details |
|---|---|
| **Ticket Listing** | Public view of travel ticket routes with origin, destination, and pricing |

---

### 7. 📝 Enquiry Submission

**File:** [EnquirySubmit.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/features/enquiries/EnquirySubmit.tsx)

| Feature | Details |
|---|---|
| **Protected Form** | Only accessible to authenticated users (via `ProtectedRoute`) |
| **Service Type Selection** | Can submit enquiries for: PACKAGE, HOTEL, VEHICLE, TICKET |
| **Pre-filled Package ID** | When navigated from a package detail, the package is pre-selected |
| **Message Field** | Free-text message for custom requests |
| **Confirmation Feedback** | Success/error state shown after form submission |

---

### 8. 🗺️ Interactive Map

**File:** [PackageMap.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/components/shared/PackageMap.tsx)

| Feature | Details |
|---|---|
| **React Leaflet Integration** | OpenStreetMap tiles via Carto Voyager style |
| **Package Markers** | GPS-positioned markers for every active package |
| **Rich Popups** | Clicking a marker shows: package image, title, location, price, and "View" link |
| **India Default Center** | Map defaults to center of India (lat: 20.59, lng: 78.96), zoom 4 |

---

### 9. 🛡️ Admin Panel

All admin routes are protected by `ProtectedRoute` with `requireAdmin={true}`.

#### 9a. Admin Dashboard
**File:** [AdminDashboard.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/features/admin/AdminDashboard.tsx)

| Feature | Details |
|---|---|
| **KPI Stats Cards** | Cards for: Total Revenue, Active Packages, User Enquiries, Fleet Size, Hotel Partners |
| **Animated Bar Chart** | Revenue analytics chart (Jan–Dec) with hover tooltips, animated bar growth |
| **Recent Activity Feed** | Live list of the latest user enquiries with user avatar, name, service type, and status badge |
| **Upcoming Trips Widget** | Bookings starting in the next 14 days fetched live |
| **Payment Alerts Widget** | Bookings with pending payment balances highlighted in red |
| **Staggered Animations** | Each stat card animates in with a staggered delay using Framer Motion |

#### 9b. Admin Packages (CMS)
**File:** [AdminPackages.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/features/admin/AdminPackages.tsx)

| Feature | Details |
|---|---|
| **Package Table/List** | View all packages with status, category, price, duration |
| **Create Package** | Form with: title, description, price, duration, location, GPS coordinates, category, images, itinerary |
| **Edit Package** | Pre-populated update form |
| **Deactivate Package** | Soft-delete (sets `isActive = false`) |
| **Image Management** | Multiple image URLs per package with primary image flag |
| **Day-wise Itinerary Editor** | Add/edit day number, day title, and description |

#### 9c. Admin Vehicles
**File:** [AdminVehicles.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/features/admin/AdminVehicles.tsx)

| Feature | Details |
|---|---|
| **Vehicle List** | All vehicles with type, capacity, availability |
| **CRUD Operations** | Add, edit, delete vehicles |

#### 9d. Admin Hotels
**File:** [AdminHotels.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/features/admin/AdminHotels.tsx)

| Feature | Details |
|---|---|
| **Hotel List** | All hotels with location, star rating, amenities |
| **CRUD Operations** | Add, edit, deactivate hotels |

#### 9e. Admin Enquiries (CRM)
**File:** [AdminEnquiries.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/features/admin/AdminEnquiries.tsx)

| Feature | Details |
|---|---|
| **Enquiry Table** | Paginated list of all user enquiries with date, customer, service, message, status |
| **Status Workflow** | PENDING → IN_PROGRESS (Acknowledge) → RESOLVED (Close Ticket) |
| **Status Badges** | Color-coded: amber (PENDING), blue (IN_PROGRESS), emerald (RESOLVED) |
| **Responsive View** | Desktop table + mobile card list both supported |
| **Incoming Leads Counter** | Live count of total enquiries in the header badge |

#### 9f. Admin Bookings
**File:** [AdminBookings.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/features/admin/AdminBookings.tsx)

| Feature | Details |
|---|---|
| **Bookings Table** | Customer name, phone, package/hotel/vehicle, start-end dates, payment status, booking status |
| **Quick Stats** | Total Bookings, Pending Payments, Upcoming Trips count cards |
| **Manual Booking Entry** | Admin can create bookings directly (for walk-in / phone customers) |
| **Edit Booking** | Update booking details via form modal |
| **Delete Booking** | Remove booking records with confirmation dialog |
| **Calendar View** | Visual calendar modal (`AdminCalendar`) for date-based overview |
| **Search** | Search by customer name, phone, or package |
| **Payment Status Tracking** | FULL (green), PARTIAL (amber), PENDING (red) |
| **Booking Status Tracking** | CONFIRMED (emerald), CANCELLED (rose), COMPLETED (blue) |
| **Responsive Layout** | Desktop table + mobile card list |

---

### 10. 🌓 UI / UX Global Features

**Files:** [MainLayout.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/layouts/MainLayout.tsx) · [AdminLayout.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/layouts/AdminLayout.tsx) · [ThemeProvider.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/components/shared/ThemeProvider.tsx)

| Feature | Details |
|---|---|
| **Dark / Light Mode Toggle** | Persistent theme stored in localStorage; Moon/Sun toggle in navbar |
| **Sticky Navbar** | Semi-transparent, blur backdrop navbar with active route underline animation |
| **Animated Mobile Menu** | Slide-in mobile hamburger menu with `AnimatePresence` (Framer Motion) |
| **Footer** | 4-column footer: brand info, quick links, contact info, newsletter signup |
| **Social Links** | Facebook, Instagram, Twitter links in footer |
| **Newsletter Signup** | Email input + "Sign Up Now" button in footer |
| **Admin Sidebar Layout** | Collapsible sidebar with icons and labels for all admin sections |
| **Breadcrumbs / Navigation** | Route-aware active link highlighting in both navbars |
| **Fully Responsive** | Mobile-first responsive design across all pages |

---

### 11. ℹ️ Static Pages

| Page | File | Content |
|---|---|---|
| **About Us** | [AboutUs.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/pages/AboutUs.tsx) | Company story, team, values |
| **Contact** | [Contact.tsx](file:///c:/PP/sainath-holidays/tourtravel-frontend/src/pages/Contact.tsx) | Contact form, address, phone, email, map |

---

## ⚙️ BACKEND FEATURES

### 1. 🔐 Authentication & Security

**Files:** [AuthController.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/controller/AuthController.java) · [AuthService.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/service/AuthService.java) · [SecurityConfig.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/config/SecurityConfig.java)

| Feature | API Endpoint | Details |
|---|---|---|
| **Registration** | `POST /api/v1/auth/register` | Email + password, BCrypt(12) hashed, returns JWT pair |
| **Email Login** | `POST /api/v1/auth/login` | Email/password, returns access + refresh token |
| **OTP Send** | `POST /api/v1/auth/otp/send` | Sends 6-digit OTP to phone (Redis TTL 5 min); logs to console in dev |
| **OTP Verify & Login** | `POST /api/v1/auth/otp/verify` | Verifies OTP, auto-creates account if first login, returns JWT pair |
| **Token Refresh** | `POST /api/v1/auth/refresh` | Validates refresh token, rotates both access + refresh tokens |
| **Logout** | `POST /api/v1/auth/logout` | Revokes the refresh token for the current user |
| **Current User Profile** | `GET /api/v1/auth/me` | Returns authenticated user's profile |
| **Google OAuth2** | `GET /api/v1/auth/oauth2/authorize/google` | Spring-managed redirect to Google's consent screen |
| **OAuth2 Callback** | `GET /api/v1/auth/oauth2/callback/google` | `OAuth2SuccessHandler` extracts email, finds/creates user, returns JWT |

**Security Architecture:**
- **Stateless JWT**: No HTTP sessions; all state in tokens
- **JWT Filter**: `JwtAuthenticationFilter` intercepts every request before Spring's auth filter
- **Role-Based Access**: `@PreAuthorize("hasRole('ADMIN')")` + URL-level rules in `SecurityConfig`
- **BCrypt(12)**: Strong password hashing
- **Refresh Token Rotation**: Old refresh token invalidated on each use
- **Custom 401 Handler**: `JwtAuthEntryPoint` returns structured JSON on auth errors

---

### 2. 📦 Tour Packages

**Files:** [PackageController.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/controller/PackageController.java) · [PackageService.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/service/PackageService.java)

| Feature | API Endpoint | Details |
|---|---|---|
| **List Packages** | `GET /api/v1/packages` | Paginated, filterable by category, sortable (price/date), public access |
| **Package Detail** | `GET /api/v1/packages/{id}` | Full detail including itineraries + images, public access |
| **Map Data** | `GET /api/v1/packages/map` | Lightweight list (lat/lng + price) for Leaflet map markers |
| **Create Package** | `POST /api/v1/admin/packages` | Admin only; supports images and itineraries as nested lists |
| **Update Package** | `PUT /api/v1/admin/packages/{id}` | Admin only; replaces all fields including images and itineraries |
| **Deactivate Package** | `DELETE /api/v1/admin/packages/{id}` | Soft-delete: sets `isActive = false` |

**Package Categories:** `DOMESTIC`, `INTERNATIONAL`, `ADVENTURE`, `HONEYMOON`, `PILGRIMAGE`, `WILDLIFE`, `BEACH`, `CULTURAL`

**Entity Relationships:**
- `TourPackage` → `PackageItinerary` (1:N, cascade ALL)
- `TourPackage` → `PackageImage` (1:N, cascade ALL)
- `TourPackage` → `User` (createdBy, ManyToOne)

**DB Indexes:** `category`, `price`, `duration_days` for query performance

---

### 3. 🏨 Hotels

**Files:** [HotelController.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/controller/HotelController.java) · [HotelService.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/service/HotelService.java)

| Feature | API Endpoint | Details |
|---|---|---|
| **List Hotels** | `GET /api/v1/hotels` | All active hotels, public access |
| **Create Hotel** | `POST /api/v1/admin/hotels` | Admin only; supports amenities list |
| **Update Hotel** | `PUT /api/v1/admin/hotels/{id}` | Admin only |
| **Deactivate Hotel** | `DELETE /api/v1/admin/hotels/{id}` | Soft-delete |

**Hotel Entity Fields:** name, location, starRating, pricePerNight, description, imageUrl, contactPhone, amenities (1:N), isActive

---

### 4. 🚗 Vehicles

**Files:** [VehicleController.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/controller/VehicleController.java) · [VehicleService.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/service/VehicleService.java)

| Feature | API Endpoint | Details |
|---|---|---|
| **List Vehicles** | `GET /api/v1/vehicles` | Supports `availableOnly` query param, public access |
| **Create Vehicle** | `POST /api/v1/admin/vehicles` | Admin only |
| **Update Vehicle** | `PUT /api/v1/admin/vehicles/{id}` | Admin only |
| **Delete Vehicle** | `DELETE /api/v1/admin/vehicles/{id}` | Hard delete |

**Vehicle Entity Fields:** name, type, capacity, pricePerDay, isAvailable, imageUrl, description

---

### 5. 🎫 Tickets

**Files:** [TicketController.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/controller/TicketController.java) · [TicketService.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/service/TicketService.java)

| Feature | API Endpoint | Details |
|---|---|---|
| **List Tickets** | `GET /api/v1/tickets` | Public access |
| **Create Ticket** | `POST /api/v1/admin/tickets` | Admin only |
| **Update Ticket** | `PUT /api/v1/admin/tickets/{id}` | Admin only |
| **Delete Ticket** | `DELETE /api/v1/admin/tickets/{id}` | Hard delete |

**Ticket Entity Fields:** origin, destination, mode (TRAIN/BUS/FLIGHT), price, isActive

---

### 6. 📝 Enquiries (CRM)

**Files:** [EnquiryController.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/controller/EnquiryController.java) · [AdminController.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/controller/AdminController.java) · [EnquiryService.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/service/EnquiryService.java)

| Feature | API Endpoint | Details |
|---|---|---|
| **Submit Enquiry** | `POST /api/v1/enquiries` | Authenticated users; for PACKAGE, HOTEL, VEHICLE, or TICKET |
| **My Enquiries** | `GET /api/v1/enquiries/my` | Paginated list of the logged-in user's enquiries |
| **All Enquiries (Admin)** | `GET /api/v1/admin/enquiries` | Paginated, optional status filter (PENDING/IN_PROGRESS/RESOLVED) |
| **Update Enquiry Status** | `PATCH /api/v1/admin/enquiries/{id}/status` | Admin updates status and adds admin notes |

**Enquiry Status Lifecycle:** `PENDING` → `IN_PROGRESS` → `RESOLVED`

**Enquiry Entity Fields:** user (FK), serviceType, packageId (optional), message, status, adminNotes, createdAt

---

### 7. 📅 Bookings (CRM)

**Files:** [BookingController.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/controller/BookingController.java) · [BookingService.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/service/BookingService.java)

| Feature | API Endpoint | Details |
|---|---|---|
| **Create Booking** | `POST /api/v1/admin/bookings` | Admin creates manual bookings |
| **All Bookings** | `GET /api/v1/admin/bookings` | Full booking list for admin |
| **Upcoming Bookings** | `GET /api/v1/admin/bookings/upcoming?days=14` | Bookings starting in next N days |
| **Pending Payments** | `GET /api/v1/admin/bookings/pending-payments` | Bookings where payment is not FULL |
| **Update Booking** | `PUT /api/v1/admin/bookings/{id}` | Edit booking details |
| **Delete Booking** | `DELETE /api/v1/admin/bookings/{id}` | Remove a booking record |

**Booking Entity Fields:**
- Customer: `customerName`, `customerEmail`, `customerPhone`
- Linked Services: `tourPackage` (FK), `vehicle` (FK), `hotel` (FK)
- Dates: `startDate`, `endDate`
- Financials: `totalAmount`, `advancePaid`
- Status: `bookingStatus` (CONFIRMED/CANCELLED/COMPLETED), `paymentStatus` (PENDING/PARTIAL/FULL)
- `notes` (free text)

---

### 8. 📧 OTP & Email Service

**Files:** [OtpService.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/service/OtpService.java) · [MailService.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/service/MailService.java)

| Feature | Details |
|---|---|
| **Secure OTP Generation** | `SecureRandom` generates cryptographically safe 6-digit OTPs |
| **Redis Storage (Prod)** | OTP stored with 5-minute TTL key `otp:<phone>` |
| **In-Memory Fallback (Dev)** | `ConcurrentHashMap` with manual expiry if Redis is unavailable |
| **Email OTP Delivery** | Gmail SMTP via Spring Mail for email-based OTP |
| **OTP Verification** | Validates OTP, throws `BadRequestException` if expired or wrong |
| **One-Time Use** | OTP deleted from store after successful verification |
| **SMS Gateway Hook** | Code-comment placeholder for SMS providers in production |

---

### 9. 🔒 Data Layer & Architecture

**Files:** All entities in [entity/](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/entity) · [repository/](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/repository)

| Feature | Details |
|---|---|
| **13 JPA Entities** | User, TourPackage, PackageItinerary, PackageImage, Hotel, HotelAmenity, Vehicle, Ticket, Booking, Enquiry, RefreshToken, BookingStatus (enum), PaymentStatus (enum) |
| **Cascade All** | Child entities (images, itineraries, amenities) auto-managed via cascade |
| **Soft Deletes** | Packages and hotels use `isActive` flag for non-destructive deactivation |
| **DB Indexing** | Indexes on email, phone, package category, price, duration for performance |
| **HikariCP Pool** | Connection pool: max 10 / min idle 2 |
| **N+1 Prevention** | `default_batch_fetch_size: 20` in Hibernate properties |
| **Auditing** | `@CreationTimestamp` and `@UpdateTimestamp` on all entities |
| **DTOs via MapStruct** | Request/Response DTOs separate from entities; 12 request DTOs + 10 response DTOs |

---

### 10. 🌐 CORS & API Configuration

**File:** [CorsConfig.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/config/CorsConfig.java)

| Feature | Details |
|---|---|
| **Configurable CORS Origins** | `CORS_ORIGINS` env var; defaults to `http://localhost:5173` |
| **Methods Allowed** | GET, POST, PUT, DELETE, PATCH, OPTIONS |
| **Credentials** | Allowed for JWT cookie-less flow |

---

### 11. 📖 API Documentation

**File:** [OpenApiConfig.java](file:///c:/PP/sainath-holidays/tourtravel-backend/src/main/java/com/tourtravel/config/OpenApiConfig.java)

| Feature | Details |
|---|---|
| **Swagger UI** | Available at `/swagger-ui.html` |
| **OpenAPI 3.0** | Full spec at `/v3/api-docs` |
| **JWT Bearer Auth** | Swagger UI has "Authorize" button for testing protected endpoints |
| **Tagged Endpoints** | Groups: Authentication, Public Packages, Admin CMS, User Enquiries |

---

### 12. 🔭 Health & Monitoring

| Feature | Details |
|---|---|
| **Spring Actuator** | Endpoints: `/actuator/health`, `/actuator/info`, `/actuator/metrics` |
| **Health Details** | Shown only to authorized users |
| **Structured Error Responses** | `ApiResponse<T>` wrapper with `success`, `message`, `data` fields on all endpoints |
| **Custom Exceptions** | `BadRequestException`, `ResourceNotFoundException` with proper HTTP status codes |

---

## 🚀 Deployment & Infrastructure

| Feature | Details |
|---|---|
| **Docker** | Both frontend and backend have `Dockerfile`; orchestrated via `docker-compose.yml` |
| **Nginx** | Frontend served via Nginx in production (`nginx.conf`); SPA fallback configured |
| **Vercel** | Frontend also deployable to Vercel (`vercel.json` present) |
| **Environment Variables** | `.env.example` provided for both frontend and backend |
| **Multi-profile Config** | `application.yml` (dev) + `application-prod.yml` (production) |
| **Port** | Backend: `8085` (configurable); Frontend dev: `5173` |

---

## 📊 API Endpoint Summary

| Controller | Endpoints | Access |
|---|---|---|
| `AuthController` | 7 endpoints (register, login, OTP send/verify, refresh, logout, /me) | Public / Authenticated |
| `PackageController` | 3 endpoints (list, detail, map) | Public |
| `EnquiryController` | 2 endpoints (submit, my-list) | Authenticated |
| `AdminController` | 12 endpoints (CRUD for packages, vehicles, hotels, tickets, enquiry management) | Admin Only |
| `BookingController` | 6 endpoints (CRUD + upcoming + pending-payments) | Admin Only |
| `HotelController` | 1 endpoint (public listing) | Public |
| `VehicleController` | 1 endpoint (public listing) | Public |
| `TicketController` | 1 endpoint (public listing) | Public |
| **Total** | **~33 REST endpoints** | — |

---

## 📁 Project Structure Summary

```
sainath-holidays/
├── tourtravel-frontend/          React + TypeScript + Vite
│   └── src/
│       ├── features/             Feature-based modules
│       │   ├── admin/            Admin dashboard + CMS pages
│       │   ├── auth/             Login + OAuth callback
│       │   ├── packages/         Package list, detail, card
│       │   ├── hotels/           Public hotel listing
│       │   ├── vehicles/         Public vehicle listing
│       │   ├── tickets/          Public ticket listing
│       │   ├── enquiries/        Enquiry submission
│       │   └── home/             Landing page
│       ├── layouts/              MainLayout, AdminLayout, AuthLayout
│       ├── components/shared/    PackageMap, ThemeProvider
│       ├── pages/                About, Contact
│       ├── store/                Zustand auth store
│       ├── services/             Axios API client
│       ├── routes/               ProtectedRoute
│       └── types/                TypeScript types
│
└── tourtravel-backend/           Spring Boot 3.2 + Java 17
    └── src/main/java/com/tourtravel/
        ├── controller/           8 REST controllers
        ├── service/              10 service classes
        ├── entity/               13 JPA entities
        ├── dto/request/          12 request DTOs
        ├── dto/response/         10 response DTOs
        ├── repository/           Spring Data JPA repos
        ├── security/             JWT filter, OAuth2 handler
        ├── config/               Security, CORS, Redis, OpenAPI
        ├── exception/            Custom exception classes
        ├── mapper/               MapStruct mappers
        └── util/                 Constants and helpers
```
