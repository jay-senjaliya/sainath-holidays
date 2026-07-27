# 🌍 TravelERP — Complete Development Roadmap
### Sainath Holidays → Full Travel Business Operating System

> **Vision:** Transform a travel website with an admin panel into a **Complete Travel Agency ERP** that replaces Excel, WhatsApp notebooks, and paper diaries for every Indian travel agency.
>
> **Target Buyer:** Small to mid-size travel agencies in India (₹50,000 – ₹5,00,000+ license value)

---

## 📍 Current State (v1.0 — Already Built)

| Module | Status |
|---|---|
| Public website (packages, hotels, vehicles, tickets) | ✅ Done |
| Email / Phone OTP / Google OAuth login | ✅ Done |
| Admin CMS (packages CRUD with images + itinerary) | ✅ Done |
| Admin Hotels / Vehicles / Tickets CRUD | ✅ Done |
| Basic Enquiry submission + status workflow | ✅ Done |
| Basic Booking management (admin manual entry) | ✅ Done |
| Interactive Leaflet map on homepage | ✅ Done |
| Dark/light mode, responsive design | ✅ Done |
| Docker + Nginx deployment | ✅ Done |

---

## 🗺️ Transformation Vision

```
Current                          Future
─────────────────────────────────────────────────────
Travel Website                   Travel Business ERP
  + Admin Panel        →         (CRM + Sales + Ops +
                                  Accounting + AI)
─────────────────────────────────────────────────────
Manages: Content                 Manages: Everything
Users: 1 Admin                   Users: Owner, Manager,
                                         Sales, Ops,
                                         Accountant, Driver
Value: ₹0 (open source)         Value: ₹50k–₹5L/yr
```

---

## 🏗️ Phase Overview

| Phase | Name | Focus | Timeline Estimate |
|---|---|---|---|
| **Phase 1** | Core Business Engine | CRM, Leads, Quotes, Payments, Vendors | 3–4 months |
| **Phase 2** | Business Automation | PDF, Customer Portal, Workflows, Finance | 3–4 months |
| **Phase 3** | Enterprise & AI | AI Features, Multi-branch, RBAC, Analytics | 4–6 months |
| **Phase 4** | Ecosystem | Mobile Apps, Integrations, Marketing | Ongoing |

---

---

# 🔴 PHASE 1 — Core Business Engine
### *"Replace Excel, WhatsApp, and the notebook"*

> **Goal:** Any travel agent who uses these features daily will immediately feel they cannot run their business without this software.

---

## Module 1.1 — Complete CRM (Customer Profiles)

### What's Wrong Now
The current system has no persistent customer record. Every enquiry is orphaned. There is no customer history. When the same customer calls again, the agent starts from zero.

### What to Build

**Customer Profile Entity — New Fields:**
```
Current User Entity:
  name, email, phone, role

New Customer Entity (extends beyond auth):
  ─── Personal ───────────────────────────────
  dateOfBirth
  anniversary
  profilePhoto
  gender
  city / state / country

  ─── Travel Identity ─────────────────────────
  passportNumber
  passportExpiry
  visaHistory (JSON array)
  preferredDestinations (tags)
  budgetRange (min, max)
  travelStyle (LUXURY / BUDGET / ADVENTURE / FAMILY)

  ─── Family Members ──────────────────────────
  FamilyMember[] {
    name, relation, DOB, passportNumber
  }

  ─── Business ────────────────────────────────
  totalBookings
  totalRevenue
  lifetimeValue
  customerSince
  isRepeatCustomer
  referredBy (Customer FK)
  tags (VIP, Corporate, etc.)
  internalNotes (private to staff)

  ─── Contact Preferences ─────────────────────
  whatsappNumber
  preferredLanguage
  doNotDisturb (boolean)
```

**Customer Timeline (Most Valuable Feature):**
Every interaction recorded in sequence:
```
[Feb 2024] Lead Created (Website)
[Feb 2024] Called — interested in Goa
[Mar 2024] Quotation Sent ₹45,000
[Mar 2024] Negotiated to ₹42,000
[Apr 2024] Booking Confirmed
[Apr 2024] Advance ₹15,000 received
[Apr 2024] Hotel booked — Taj Goa
[Apr 2024] Vehicle assigned — Swift Dzire MH-01-AB-1234
[May 2024] Final payment ₹27,000 received
[May 2024] Trip Started
[May 2024] Trip Completed
[Jun 2024] Review received — 5★
[Jun 2024] Birthday wish sent
[Dec 2024] Anniversary wish sent → New Lead
```

**Frontend Pages:**
- `/admin/customers` — Customer list with search, filter (city, travel style, budget range)
- `/admin/customers/:id` — Full customer profile with timeline, family members, documents, all bookings

**Backend Changes:**
- New `Customer` entity (or extend `User`)
- New `CustomerInteraction` entity (type, notes, createdBy, timestamp)
- `GET /api/v1/admin/customers` — list with filters + pagination
- `GET /api/v1/admin/customers/:id` — full profile
- `POST /api/v1/admin/customers` — create customer manually
- `PUT /api/v1/admin/customers/:id` — update profile
- `POST /api/v1/admin/customers/:id/interactions` — log interaction
- `GET /api/v1/admin/customers/:id/timeline` — full timeline

---

## Module 1.2 — Lead Management Pipeline

### What's Wrong Now
Enquiries are just a list. There is no concept of a lead pipeline. Leads sit in PENDING forever. There is no conversion tracking, no funnel visibility.

### What to Build

**Lead Stages (Sales Pipeline):**
```
NEW LEAD → CONTACTED → INTERESTED → QUOTATION SENT
    → NEGOTIATING → WON → LOST → FUTURE FOLLOWUP
```

**Lead Entity — New Fields:**
```
Lead {
  customer (FK)
  source (WHATSAPP / WEBSITE / FACEBOOK / INSTAGRAM /
          GOOGLE / WALK_IN / REFERENCE / REPEAT)
  stage (enum above)
  assignedTo (Staff FK)
  destination
  tentativeTravelDate
  numberOfPax
  budgetEstimate
  notes
  lostReason (if LOST)
  nextFollowupDate
  priority (HIGH / MEDIUM / LOW)
  createdAt
  wonAt
  quotationSentAt
}
```

**Kanban Board View:**
Visual drag-and-drop board (like Trello) where each column is a pipeline stage. Cards show customer name, destination, budget, and next followup date. Dragging a card changes its stage.

**List View:**
Table with filters: assignee, source, stage, date range, destination.

**Lead Source Analytics:**
Pie chart: which source brings the most leads? Which source converts best? Which source brings most revenue?

**Frontend Pages:**
- `/admin/leads` — Kanban board (default) + list view toggle
- `/admin/leads/:id` — Lead detail with timeline, notes, linked quotations

**Backend:**
- New `Lead` entity
- `GET /api/v1/admin/leads` — with stage, source, assignee filters
- `PUT /api/v1/admin/leads/:id/stage` — move stage
- `GET /api/v1/admin/leads/analytics` — conversion rates, source breakdown

---

## Module 1.3 — Lead Source Tracking

**What to Build:**

Every lead must record where it came from:
```
WHATSAPP
WEBSITE_FORM
FACEBOOK
INSTAGRAM
GOOGLE_ADS
WALK_IN
PHONE_CALL
REFERENCE (who referred)
EXISTING_CUSTOMER
TRAVEL_FAIR
NEWSPAPER_AD
```

**Analytics Output:**
- Which source generates most leads?
- Which source has best conversion rate?
- Which source generates maximum revenue?
- Cost per lead per source (if ad spend entered)

This helps the owner decide where to spend marketing money.

**Implementation:** Add `source` field to `Lead` entity + aggregate queries for analytics.

---

## Module 1.4 — Followup & Reminder System

### What's Wrong Now
There is no reminder system. If an agent forgets to follow up, the lead dies. Most travel agencies lose 30–40% of leads simply because no one remembered to call.

### What to Build

**Reminder Entity:**
```
Reminder {
  type (CALL / WHATSAPP / EMAIL / MEETING / BIRTHDAY_WISH /
        ANNIVERSARY_WISH / PASSPORT_EXPIRY / VISA_EXPIRY /
        PAYMENT_DUE / TRIP_REMINDER / FOLLOWUP / CUSTOM)
  relatedTo (Lead FK or Customer FK or Booking FK)
  dueDate
  dueTime
  title
  notes
  assignedTo (Staff FK)
  status (PENDING / DONE / SNOOZED)
  snoozedUntil
  createdBy
}
```

**Notification Dashboard (Today's View):**
```
📅 TODAY — July 25, 2026

🔴 OVERDUE (3)
  → Call Rajesh Sharma about Goa package (was due yesterday)
  → Send quote to Priya Patel
  → Collect balance ₹15,000 from Mehta Family

🟡 TODAY (5)
  → 🎂 Birthday: Amit Shah — send wish
  → 💍 Anniversary: Kumar Family — send wish
  → 📞 Call new lead from Instagram
  → 📄 Send revised quote to Desai Family
  → ✈️ DEPARTURE: Joshi Family — Manali tour starts

🟢 UPCOMING (12)
  → Tomorrow: 4 followups
  → Day after: 3 payment dues
```

**Features:**
- Reminder bell icon in admin navbar with unread count badge
- Popup notification when reminder is due (browser notification + in-app)
- Snooze for 1 hour / 1 day / 1 week
- Auto-create reminders: birthday reminders auto-created from customer DOB, anniversary from anniversary date, passport expiry from passportExpiry - 90 days

**Backend:**
- New `Reminder` entity
- Daily cron job to check due reminders and push to notification system
- `GET /api/v1/admin/reminders/today` — today's reminders
- `PATCH /api/v1/admin/reminders/:id/done`
- `PATCH /api/v1/admin/reminders/:id/snooze`

---

## Module 1.5 — WhatsApp Integration (Click-to-Chat)

### Phase 1A — Click to WhatsApp (No API needed)
Simple but high-value. Every customer record shows a WhatsApp button. Clicking it opens `https://wa.me/<phone>?text=<template>`.

**Templates (pre-filled, editable before sending):**
```
WELCOME:
"Hello [Name]! 👋 Welcome to Sainath Holidays.
We're excited to help you plan your dream trip to [Destination]."

QUOTATION:
"Dear [Name], Please find your personalized travel quotation below.
Package: [Package Name] | Duration: [N] Days
Price: ₹[Amount] | Validity: 7 days
We'd love to customize it further for you! 😊"

PAYMENT_REMINDER:
"Dear [Name], Friendly reminder that your payment of
₹[Amount] for [Tour Name] is due on [Date].
Please confirm once paid. Thank you!"

TRIP_REMINDER:
"🌟 Your trip to [Destination] starts in [N] days!
Please carry: [Documents list]
Your driver [Name] will pick you up at [Time]."

FEEDBACK:
"Hope you had a wonderful trip to [Destination]! 🌴
We'd love to hear your feedback.
Do drop us a Google review: [link]"

BIRTHDAY:
"🎂 Happy Birthday [Name]!
Wishing you a wonderful year ahead.
As a birthday gift, enjoy 5% off your next booking! 🎉"
```

### Phase 1B — WhatsApp Business API (Phase 2+)
Official API integration for sending automated messages (requires WhatsApp Business Account approval). Enables:
- Bulk messages
- Delivery receipts
- Template message automation
- Two-way conversation in the CRM

**Frontend:** WhatsApp button on every customer card and booking row. Template selector modal.

---

## Module 1.6 — Professional Quotation Builder

### What's Wrong Now
Agencies create quotations in Word/PDF manually. It takes 30–60 minutes. A quote builder reduces this to 5 minutes and produces a professional, branded output.

### What to Build

**Quotation Entity:**
```
Quotation {
  lead (FK)
  customer (FK)
  createdBy (Staff FK)
  destination
  travelDateFrom / To
  numberOfAdults / Children / Infants
  status (DRAFT / SENT / ACCEPTED / REJECTED / EXPIRED)
  validUntil

  lineItems[] {
    type (HOTEL / FLIGHT / VEHICLE / ACTIVITY / VISA /
          INSURANCE / GUIDE / MISC)
    description
    quantity
    unitPrice
    total
    isIncluded (boolean — for "complimentary" items)
  }

  subtotal
  discountAmount
  discountReason
  gstRate (5% or 12%)
  gstAmount
  grandTotal
  advanceRequired
  balanceDue

  inclusionsList (what's included — rich text)
  exclusionsList (what's not included)
  termsAndConditions
  notes
  internalNotes (not shown to customer)

  pdfUrl (generated PDF stored in cloud)
  sentAt
  acceptedAt
}
```

**Quotation Builder UI:**
- Drag-and-drop line items (hotels, vehicles, activities, flights)
- Auto-calculate subtotal, GST, discount, total
- Rich text editor for inclusions/exclusions
- Preview panel showing how the PDF will look
- Company logo and branding settings applied automatically

**PDF Generation:**
- Server-side PDF generation (using iText or JasperReports in Java, or a Node.js PDF service)
- Professional multi-page PDF with: cover page, itinerary, pricing table, inclusions/exclusions, terms, company contact
- Unique quotation number (QT-2026-001 format)

**Sharing:**
- "Send via Email" — attaches PDF, sends to customer email
- "Copy WhatsApp link" — generates share link to WhatsApp
- "Download PDF" — admin downloads
- "Share link" — unique URL customer can open in browser

**Frontend Pages:**
- `/admin/quotations` — list of all quotations with status filters
- `/admin/quotations/new` — builder interface
- `/admin/quotations/:id` — view / edit / send

**Backend:**
- New `Quotation` and `QuotationLineItem` entities
- `POST /api/v1/admin/quotations/generate-pdf` — returns PDF blob or URL
- Full CRUD for quotations

---

## Module 1.7 — Booking Workflow (End-to-End)

### What's Wrong Now
Booking is a single form. There is no workflow. In reality a booking involves: hotel reservation, vehicle assignment, ticket booking, visa, advance payment, balance, departure, completion. Each step needs to be tracked.

### What to Build

**Booking Workflow Stages:**
```
LEAD
  ↓
QUOTATION SENT
  ↓
CUSTOMER APPROVED
  ↓
ADVANCE RECEIVED
  ↓
HOTEL RESERVED (checkbox)
  ↓
VEHICLE ASSIGNED (checkbox)
  ↓
TICKETS BOOKED (checkbox)
  ↓
VISA APPLIED (if international)
  ↓
VISA RECEIVED (if international)
  ↓
FINAL PAYMENT RECEIVED
  ↓
DOCUMENTS SHARED WITH CUSTOMER
  ↓
TRIP STARTED
  ↓
TRIP COMPLETED
  ↓
FEEDBACK COLLECTED
```

**Operations Checklist per Booking:**
Each booking has a dynamic checklist (admin can add custom tasks). Each task has assignee, due date, status (PENDING/DONE).

**Booking Detail Page Redesign:**
```
┌────────────────────────────────────────────────────────┐
│ BOOKING #2026-047                          [CONFIRMED] │
│ Customer: Rajesh Sharma | Goa | May 1–5, 2026          │
├──────────────────┬─────────────────────────────────────┤
│ WORKFLOW         │ OPERATIONS CHECKLIST                │
│ ● Lead           │ ☑ Hotel Booked — Taj Goa            │
│ ● Quote Sent     │ ☑ Vehicle Assigned — Swift Dzire    │
│ ● Advance Paid   │ ☐ Tickets Booked (due Apr 20)       │
│ ● Hotel Reserved │ ☐ Documents sent to customer        │
│ ☐ Final Payment  │ ☐ Driver briefed                    │
├──────────────────┼─────────────────────────────────────┤
│ PAYMENTS         │ FINANCIALS                          │
│ ₹15,000 (Adv)   │ Revenue: ₹45,000                    │
│ ₹30,000 (due)   │ Hotel Cost: ₹20,000                 │
│                  │ Vehicle: ₹5,000                     │
│                  │ Net Profit: ₹20,000 (44%)           │
└──────────────────┴─────────────────────────────────────┘
```

---

## Module 1.8 — Payment Tracker with Installments

### What's Wrong Now
Payment is just PENDING / PARTIAL / FULL. There is no installment tracking, no receipt generation, no payment history.

### What to Build

**Payment Entity:**
```
Payment {
  booking (FK)
  amount
  paymentDate
  mode (CASH / UPI / BANK_TRANSFER / CHEQUE / CARD / ONLINE)
  reference (UPI ID / cheque number / transaction ID)
  notes
  receivedBy (Staff FK)
  receiptNumber (auto-generated: RCP-2026-001)
  receiptPdfUrl
}
```

**Installment Tracker UI:**
```
Total: ₹50,000
─────────────────────────────────────
✅ ₹15,000 — Apr 5  — UPI  — TXN12345
✅ ₹10,000 — Apr 15 — Cash
✅ ₹15,000 — Apr 25 — Bank Transfer
─────────────────────────────────────
Paid: ₹40,000
Due:  ₹10,000  [SEND REMINDER] [RECORD PAYMENT]
─────────────────────────────────────
[+ Add Payment]
```

**Receipt Generation:**
- Auto-generated branded receipt PDF per payment
- Receipt number in format RCP-YYYY-NNNN
- Download / WhatsApp / Email the receipt

**Auto Payment Reminders:**
When balance due date approaches, automatically create a reminder.

**Backend:**
- New `Payment` entity (linked to `Booking`)
- `POST /api/v1/admin/bookings/:id/payments` — record payment
- `GET /api/v1/admin/bookings/:id/payments` — payment history
- `GET /api/v1/admin/payments/pending` — all pending amounts across all bookings
- `POST /api/v1/admin/payments/:id/receipt` — generate receipt PDF

---

## Module 1.9 — Expense Management & Profit Calculator

### What's Wrong Now
There is no expense tracking. Agencies have no idea what their actual profit is per trip until after it ends, and even then it's manual calculation.

### What to Build

**Expense Entity:**
```
Expense {
  booking (FK)
  category (HOTEL / DRIVER / FUEL / GUIDE / FLIGHT /
            COMMISSION / VISA / FOOD / TAXI / MISC)
  vendor (FK — optional)
  description
  amount
  paidDate
  paidBy (CASH / UPI / BANK)
  paidTo (vendor name or description)
  receipt (document upload)
  notes
}
```

**Profit Calculator (Per Booking):**
```
BOOKING PROFITABILITY REPORT — Booking #2026-047
─────────────────────────────────────────────────
REVENUE
  Package Price:        ₹45,000
  Add-ons:             ₹5,000
  ─────────────────────────────
  Total Revenue:       ₹50,000

EXPENSES
  Hotel (Taj Goa):     ₹18,000
  Driver + Fuel:        ₹4,500
  Guide:               ₹2,000
  Activities:          ₹3,000
  Commission:          ₹2,000
  Misc:                ₹500
  ─────────────────────────────
  Total Expenses:      ₹30,000

─────────────────────────────
  Net Profit:          ₹20,000 (40% margin)
  GST Liability:       ₹2,250 (5% of revenue)
  Net Profit after GST: ₹17,750
─────────────────────────────
```

**Aggregate Dashboard:**
- Monthly P&L
- Package-wise profitability ranking
- Destination-wise profit margin
- Which packages have the highest margin

---

## Module 1.10 — Vendor Management

### What's Wrong Now
Hotels, drivers, and guides are not in the system as proper vendors. There is no commission tracking, no payment due tracking, no rating system.

### What to Build

**Vendor Entity:**
```
Vendor {
  type (HOTEL / DRIVER / TAXI_OWNER / GUIDE / LOCAL_AGENT /
        FLIGHT_AGENT / VISA_AGENT / INSURANCE / MISC)
  name
  contactPerson
  phone / whatsapp
  email
  city / state

  ─── Business ────────────────────────────────
  gstNumber
  panNumber
  bankName / accountNumber / IFSC

  ─── Contract ────────────────────────────────
  commissionRate (%)
  paymentTerms (days)
  contractValidUntil

  ─── Ratings ──────────────────────────────────
  internalRating (1–5 stars)
  notes
  isPreferred (boolean)
  isBlacklisted (boolean)

  ─── History ──────────────────────────────────
  totalBookingsUsed
  totalAmountPaid
  totalAmountPending
}
```

**Vendor Ledger:**
For each vendor, show all bookings they were used in, amount payable, amount paid, balance due.

**Vendor Payment Tracking:**
```
VENDOR: Hotel Sunshine, Manali
─────────────────────────────────────────────────
Booking #047 — Sharma Family    ₹12,000  ✅ Paid
Booking #051 — Patel Family     ₹8,000   ✅ Paid
Booking #058 — Mehta Family     ₹15,000  🔴 Pending
─────────────────────────────────────────────────
Total Paid:    ₹20,000
Total Pending: ₹15,000
```

---

## Module 1.11 — Driver / Fleet Module

**Driver Entity:**
```
Driver {
  name, phone, whatsapp
  licenseNumber, licenseExpiry
  aadhaarNumber
  address
  vehicleAssigned (Vehicle FK)
  isAvailable (boolean)
  documents[] (license, RC, insurance photos)
  emergencyContact
  notes

  ─── Trip History ─────────────────────────
  totalTrips
  totalKilometers
  rating (from customer feedback)

  ─── Payments ─────────────────────────────
  pendingAmount
  paymentHistory[]
}
```

**Driver Availability Calendar:**
Visual calendar showing which driver is assigned to which booking on which dates. Prevents double-booking. Color-coded: green = available, red = booked, orange = partial day.

---

## Module 1.12 — Hotel Contract Management

**Hotel Contract Entity:**
```
HotelContract {
  hotel (FK)
  season (PEAK / OFF_SEASON / WEEKEND / FESTIVE)
  validFrom / validTo
  roomType
  mealPlan (EP / CP / MAP / AP)
  agencyRate
  marketRate
  commission (%)
  cancellationPolicy (text)
  advanceRequired
  childPolicy
  notes
}
```

When building a quotation, the system looks up active hotel contracts and auto-fills the price based on travel dates and season.

---

---

# 🟠 PHASE 2 — Business Automation
### *"The system works for you, not you for the system"*

---

## Module 2.1 — Document Generation (PDF Engine)

**Documents to Auto-Generate:**

| Document | Description |
|---|---|
| **Quotation PDF** | Multi-page: cover, itinerary, pricing, inclusions, terms, company letterhead |
| **Booking Confirmation** | Official booking confirmation with all details |
| **Invoice** | GST-compliant invoice with HSN codes |
| **Receipt** | Payment receipt with receipt number |
| **Payment Voucher** | For recording expense payments to vendors |
| **Travel Itinerary** | Customer-facing day-wise itinerary with hotels, driver contact, emergency contacts |
| **Vendor Payment Voucher** | Voucher when paying a hotel or driver |

**Technology Options:**
- **Java (Backend):** iText 7 or Apache PDFBox for server-side generation
- **Or:** Dedicated Node.js PDF microservice using Puppeteer (render HTML to PDF)
- Store generated PDFs in cloud storage (S3 / Cloudinary / local)
- PDFs are linked on the entity and downloadable by admin + shareable

---

## Module 2.2 — Digital Travel Itinerary (Customer-Facing)

A public shareable URL (no login needed) that shows the customer their trip details in a beautiful mobile-friendly format.

**Contents:**
```
DAY 1 — ARRIVAL IN GOA
  Hotel: Taj Holiday Village
  Pickup: 10:00 AM, Mumbai Airport
  Driver: Ramesh — 9876543210
  Note: Check-in after 2 PM

  🗺️ [Map link to hotel]

DAY 2 — NORTH GOA BEACHES
  [Activity details]

─────────────────────────────
EMERGENCY CONTACTS
  Your agent: Jay — 9876543210
  Hotel: +91 832 664 5858
  Driver: Ramesh — 9876543210

─────────────────────────────
📄 YOUR DOCUMENTS
  [Hotel Voucher] [Flight Ticket]
  [Insurance] [Itinerary PDF]
```

**Features:**
- Unique shareable URL per booking (e.g., `/trip/TRP-2026-047`)
- No login required for customer to view
- Mobile-optimized beautiful design
- Shows real-time current day highlighted
- Weather widget for destination
- Packing checklist section
- Document download links

---

## Module 2.3 — Customer Portal

Customers can log in and see their own data.

**Customer Portal Pages:**
- `/my/dashboard` — active bookings, upcoming trips, pending payments
- `/my/bookings` — all bookings with status
- `/my/bookings/:id` — booking detail with payment history, documents, itinerary link
- `/my/quotes` — received quotations with accept/reject option
- `/my/documents` — all uploaded documents (passport, tickets, hotel vouchers)
- `/my/invoices` — all invoices with download
- `/my/profile` — update personal info, family members

**Quote Acceptance Flow:**
- Customer receives quotation via email with link
- Opens portal, reviews quotation PDF
- Clicks "Accept" or "Request Changes"
- If accepted, triggers booking workflow stage update in admin panel

---

## Module 2.4 — E-Sign (Digital Quote Acceptance)

- Customer opens quotation URL
- Reads the quotation
- Types their name + clicks "I Accept" checkbox
- System records: name, IP address, timestamp, user agent
- Generates a signed confirmation PDF
- Triggers advance payment request

---

## Module 2.5 — Cancellation Management

**Cancellation Policy Engine:**
```
Cancellation Policy Example:
  > 30 days before: 10% cancellation charge
  15-30 days before: 25% charge
  7-15 days before: 50% charge
  < 7 days before: 100% (no refund)
```

Per-booking or per-package cancellation policy. When cancellation is initiated:
- System calculates cancellation charge automatically
- Refund amount calculated
- Refund tracking (initiated / processed / completed)
- Cancellation voucher generated

---

## Module 2.6 — Loyalty & Referral System

**Loyalty Points:**
- ₹1,000 spent = 10 points
- 100 points = ₹500 discount on next booking
- Tier: SILVER (1–5 trips), GOLD (6–15 trips), PLATINUM (16+ trips)
- Tier benefits: extra discount, priority service, free upgrades

**Referral System:**
- Each customer gets unique referral code
- Referred customer books → referrer gets ₹500 credit or 50 points
- Automated: when new booking has referral code, credit is applied

---

## Module 2.7 — Review & Feedback System

**Post-Trip Automation:**
- Trip completes → 24 hours later → auto-trigger feedback request
- WhatsApp: "Hope you had a wonderful trip! [Feedback link]"
- Email: Same message with link

**Feedback Form:**
- Overall rating (1–5 stars)
- Hotel rating / Driver rating / Package rating
- NPS score (0–10): "How likely to recommend Sainath Holidays?"
- Open text feedback
- Would you book again? (Yes/No)
- Google Review redirect button

**Admin View:**
- All reviews in one place
- Ratings per driver, hotel, package
- Low-rated trips flagged for review

---

## Module 2.8 — Finance Module

**Cash Book:**
- Record daily cash in / cash out
- Opening balance + closing balance per day

**Bank Book:**
- Per-bank-account ledger
- Reconcile payments

**Customer Ledger:**
- Per-customer: all amounts due and paid

**Vendor Ledger:**
- Per-vendor: all amounts due and paid

**Monthly P&L Report:**
```
JULY 2026 — PROFIT & LOSS
─────────────────────────────────────
Income
  Package Revenue:    ₹3,45,000
  Hotel Commission:  ₹28,000
  Vehicle Revenue:   ₹42,000
  Other Income:      ₹5,000
  ─────────────────────────────
  Total Income:      ₹4,20,000

Expenses
  Hotel Costs:       ₹1,80,000
  Driver/Vehicle:    ₹35,000
  Staff Salary:      ₹60,000
  Office Rent:       ₹15,000
  Marketing:         ₹12,000
  Misc:              ₹8,000
  ─────────────────────────────
  Total Expenses:    ₹3,10,000

─────────────────────────────
Net Profit:          ₹1,10,000 (26%)
GST Collected:       ₹21,000
TDS Deducted:        ₹5,000
─────────────────────────────
```

**Tally Export:**
Export data as Tally-compatible XML or CSV for accountants.

---

---

# 🟡 PHASE 3 — Enterprise & AI
### *"Intelligence and scale"*

---

## Module 3.1 — AI Quote Generator

**Input (Natural Language):**
```
"Family trip, 2 adults 2 kids, Goa, 5 days, budget 75,000,
 3-star hotel, include activities, AC vehicle"
```

**AI Output:**
- Auto-selected hotels matching budget + star rating
- Vehicle recommendation
- Activity suggestions
- Day-wise itinerary draft
- Estimated pricing per line item
- Pre-filled quotation form ready for agent to review and send

**Technology:**
- OpenAI GPT-4o API or Google Gemini API
- System prompt includes: available packages, hotel contracts, vehicle prices, seasonal pricing
- Agent reviews and adjusts before sending to customer

---

## Module 3.2 — AI Itinerary Generator

**Input:**
- Destination, duration, interests, budget, number of travelers

**Output:**
- Complete day-wise itinerary with activities, timing, meal suggestions, local tips
- Hotel recommendations
- Transport advice
- Must-visit places with descriptions
- Estimated costs per activity

**Use Case:**
Agent uses this to create custom itineraries for destinations they haven't visited personally.

---

## Module 3.3 — AI Lead Scoring

- AI scores each lead 1–100 based on: response time, budget range, destination popularity, lead source, customer history, engagement level
- Leads are sorted by score
- Helps salesperson prioritize which lead to call first
- "Hot Lead" (score 80+), "Warm" (50–79), "Cold" (< 50)

---

## Module 3.4 — AI Package Recommendation

- When agent opens a customer profile, AI suggests which packages to recommend based on: past bookings, stated preferences, budget, travel style, family composition
- "Based on this customer's travel history, they may like: Ladakh Adventure, Maldives Honeymoon, Chardham Yatra"

---

## Module 3.5 — AI Email / WhatsApp Draft Writer

- One-click "Draft Reply" button on any lead/enquiry
- AI reads the customer's message and context, writes a professional response
- Agent reviews, edits, and sends

---

## Module 3.6 — AI Sales Dashboard (Conversational Analytics)

Instead of just charts, the owner can ask questions:

```
Owner: "Why did revenue drop in June?"
AI:    "June revenue was ₹2.8L vs May's ₹4.2L (−33%).
       Main reasons:
       1. 3 large bookings cancelled (total ₹1.1L)
       2. Lead volume from Instagram dropped 40%
       3. Hotel price increases reduced margin on Goa packages
       Recommendation: Focus on Rajasthan packages in July
       as they have 52% margin vs Goa's 38%."
```

---

## Module 3.7 — AI Website Chatbot

- Embedded on public website
- Answers: package queries, pricing, availability, visa info, destination questions
- Collects lead: name, phone, destination of interest
- Auto-creates lead in CRM
- Escalates complex queries to agent (triggers WhatsApp notification)

---

## Module 3.8 — Multi-Branch Support

**Architecture:**
```
Sainath Holidays (Company)
├── Ahmedabad Branch
├── Surat Branch
├── Rajkot Branch
└── Mumbai Branch
```

- Each branch has own staff, leads, bookings, and P&L
- Company-level owner sees consolidated dashboard
- Branch manager sees only their branch
- Shared vendor and hotel contracts across branches (or branch-specific)
- Inter-branch booking transfers

---

## Module 3.9 — Role-Based Access Control (RBAC)

| Role | Access |
|---|---|
| **Owner** | Everything: all branches, all financials, all settings |
| **Manager** | All data in their branch, approve quotations, view financials |
| **Sales Executive** | Leads, quotations, customer profiles (own leads only or all) |
| **Operations** | Bookings, vendor management, driver assignment, checklists |
| **Accountant** | Payments, invoices, expenses, P&L reports, Tally export |
| **Driver** | Own trip assignments, own attendance |
| **Customer** | Own bookings, quotes, invoices, itinerary |

---

## Module 3.10 — Audit Logs

Every data change recorded:
```
[Jul 25 14:32] Jay (Admin) updated Booking #047
  Field: bookingStatus
  Old value: CONFIRMED
  New value: COMPLETED

[Jul 25 09:15] Priya (Sales) moved Lead #023 from
  QUOTATION_SENT → NEGOTIATING
```

Filterable by: user, date range, entity type, action type.

---

## Module 3.11 — Approval Workflows

Configurable approval chains:
```
Quote > ₹1,00,000:
  Sales creates → Manager reviews → Owner approves → Send

Vendor Payment:
  Operations submits → Accountant approves → Owner releases
```

Email + in-app notification at each approval step.

---

## Module 3.12 — Full Notification System

| Channel | Triggers |
|---|---|
| **In-App** | Reminders, approvals, new leads, payments received |
| **Email** | Booking confirmation, invoice, receipt, quote accepted |
| **WhatsApp** | Reminders, trip start notifications, birthday/anniversary |
| **SMS** | OTP, payment confirmation, trip reminders |
| **Browser Push** | Urgent reminders, new lead alerts |

---

## Module 3.13 — Internal Staff Communication

- Simple internal messaging system (like Slack lite)
- Tag leads/bookings in messages
- Task assignment via chat
- Reduces dependence on external WhatsApp groups for work

---

## Module 3.14 — Task & Operations Management

Each booking auto-generates a standard checklist. Staff can also add custom tasks.

```
BOOKING #047 — OPERATION TASKS
─────────────────────────────────────────────
☑  Book hotel rooms              [Priya] Done Apr 2
☑  Assign vehicle                [Ravi]  Done Apr 3
☐  Book train tickets            [Ravi]  Due  Apr 10 🔴
☐  Apply for visa                [Jay]   Due  Apr 15
☐  Send documents to customer   [Priya] Due  Apr 25
☐  Driver briefing              [Ravi]  Due  Apr 28
```

Task management dashboard: see all pending tasks across all bookings, filter by assignee, due date, priority.

---

## Module 3.15 — Analytics & Business Intelligence

**Owner Dashboard KPIs:**
```
TODAY
  New Leads: 8       Pending Followups: 12
  Departures: 2      Arrivals: 3
  Payments Due: ₹85,000

THIS MONTH
  Revenue: ₹4,20,000    Target: ₹5,00,000  (84%)
  Profit: ₹1,10,000     Margin: 26%
  Bookings: 23          Leads: 87
  Conversion: 26.4%

TOP PERFORMING
  Package: Goa Beach (12 bookings, ₹45k avg)
  Staff: Priya (8 bookings won)
  Source: WhatsApp (42% of leads)
  Hotel: Taj Goa (used 15 times)

ALERTS
  🔴 Conversion dropped 8% vs last month
  🟡 3 vendors have overdue payments
  🟢 Revenue on track for quarterly target
```

**Reports Available:**
- Monthly / quarterly / yearly revenue and P&L
- Package performance report
- Staff performance report (leads, conversions, revenue)
- Lead source ROI report
- Customer lifetime value report
- Destination popularity report
- Vendor performance report
- Outstanding payments report (customer + vendor)

---

---

# 🟢 PHASE 4 — Ecosystem
### *"Platform"*

---

## Module 4.1 — Online Payment Integration (Razorpay)

- Razorpay payment link generated per booking
- Customer receives payment link via WhatsApp / Email
- Pays online
- Payment auto-recorded in booking's payment tracker
- Receipt auto-generated
- Admin notified

---

## Module 4.2 — Document Management & Digital File Cabinet

Each customer and booking has a file cabinet:
```
Customer: Rajesh Sharma
├── Personal Documents
│   ├── Passport (photo)
│   ├── Aadhaar Card
│   └── PAN Card
├── Booking #047 — Goa 2024
│   ├── Quotation PDF
│   ├── Invoice PDF
│   ├── Hotel Voucher
│   ├── Flight Tickets
│   └── Travel Insurance
└── Booking #051 — Manali 2025
    └── ...
```

File upload: drag & drop. Storage: AWS S3 or Cloudinary. Preview in-browser. Share via link.

---

## Module 4.3 — Website Enhancements (Public Site)

| Feature | Priority |
|---|---|
| Live package availability calendar | High |
| Package comparison tool (side-by-side) | High |
| Wishlist / saved packages | Medium |
| Travel blog with SEO content | High |
| Destination guides (static + dynamic) | High |
| Customer reviews & testimonials | High |
| Video gallery | Medium |
| Travel calculator (estimate cost) | Medium |
| EMI calculator | Low |
| Visa information pages | Medium |
| Currency converter widget | Low |
| Weather widget | Low |
| Download brochure (PDF) | Medium |
| Instant callback form | High |
| Live chat widget (AI chatbot) | High |
| Recently viewed packages | Low |
| Web push notification subscription | Medium |
| Newsletter automation | Medium |
| Dynamic pricing (peak/off season) | Medium |

---

## Module 4.4 — Mobile Apps

**Owner/Manager App:**
- Real-time dashboard: today's revenue, new leads, departures
- Approve quotations and bookings on mobile
- Receive payment notifications
- View team performance
- Push notifications for reminders and alerts

**Customer App:**
- My bookings and payment status
- View travel itinerary
- Download documents
- Contact support / agent
- Loyalty points and offers
- Push notification for trip reminders

**Driver App:**
- Today's trip assignments
- Customer contact details
- Navigation links (Google Maps deep link)
- Attendance mark-in / mark-out
- Expense submission (photo of fuel receipt etc.)

**Technology:** React Native (shared codebase for iOS + Android)

---

## Module 4.5 — Marketing Automation

- **Bulk Email Campaigns:** Festival wishes, new package launches, exclusive offers
- **Bulk WhatsApp:** Via WhatsApp Business API (with approved templates)
- **Bulk SMS:** Via SMS gateway (MSG91, Exotel etc.)
- **Birthday / Anniversary Automation:** Auto-send wishes + coupon on special days
- **Segmented Campaigns:** Send offers only to customers who booked beach packages, or customers with budget > ₹1L

---

## Module 4.6 — Third-Party Integrations

| Integration | Purpose |
|---|---|
| **Razorpay / PayU** | Online payment collection |
| **WhatsApp Business API** | Automated messaging, bulk messages |
| **MSG91 / Exotel** | SMS OTP + bulk SMS |
| **Google Maps + Places API** | Hotel / destination autocomplete, map embed |
| **Google Calendar Sync** | Sync tours, reminders to Google Calendar |
| **Google Drive** | Document backup |
| **AWS S3 / Cloudinary** | Document and image storage |
| **Tally** | Export accounting data |
| **OpenAI / Gemini** | AI features |
| **Flight APIs** (Amadeus etc.) | Live flight pricing (future) |
| **Hotel APIs** (EAN, Hotelbeds) | Live hotel inventory (future) |

---

---

# 🗃️ Database Evolution Plan

## New Entities to Add (Phase by Phase)

### Phase 1 Entities
```
Customer          (full profile with preferences)
CustomerFamily    (family members)
Lead              (pipeline with source + stage)
LeadInteraction   (call logs, notes, emails)
Reminder          (followup + birthday + custom)
Quotation         (full pricing with line items)
QuotationLineItem (per-item: hotel, vehicle, misc)
Vendor            (hotels, drivers, guides)
HotelContract     (seasonal pricing)
Driver            (license, vehicle, trips)
Payment           (per booking, installments)
Expense           (per booking, per category)
```

### Phase 2 Entities
```
Invoice           (GST invoice)
Receipt           (payment receipt)
CustomerPortalSession
Cancellation      (with policy + refund)
LoyaltyAccount    (points, tier)
LoyaltyTransaction
Referral          (referral tracking)
Feedback          (post-trip review)
```

### Phase 3 Entities
```
Branch            (multi-branch)
StaffRole         (RBAC roles)
Permission        (fine-grained permissions)
AuditLog          (every change)
ApprovalRequest   (workflow approvals)
Notification      (all channels)
Task              (per booking / lead)
Message           (internal chat)
```

---

---

# 📊 Implementation Priority Matrix

If building for maximum sales impact to Indian travel agencies:

| Priority | Module | Reason |
|---|---|---|
| 🔴 P1 | CRM + Customer Profile | Agents hate losing customer history |
| 🔴 P1 | Lead Pipeline (Kanban) | Feels like Salesforce — impresses every buyer |
| 🔴 P1 | Quotation Builder + PDF | Saves 45 min per quote — immediate ROI |
| 🔴 P1 | Installment Payment Tracker | Daily use — agents check this 10× a day |
| 🔴 P1 | Followup Reminder System | "This feature alone will make us sign up" |
| 🟠 P2 | Profit Calculator per Booking | Business-changing feature |
| 🟠 P2 | Vendor Management + Ledger | Solves vendor payment chaos |
| 🟠 P2 | WhatsApp Click-to-Chat | Saves 5 steps per customer interaction |
| 🟠 P2 | Receipt Generation | Every agency needs this |
| 🟠 P2 | Driver Module | Agencies with 5+ vehicles need this |
| 🟡 P3 | Hotel Contracts DB | Medium agencies need this |
| 🟡 P3 | Customer Portal | Premium selling point |
| 🟡 P3 | AI Quote Generator | Demo showstopper |
| 🟡 P3 | Multi-branch RBAC | Required for enterprise sales |
| 🟡 P3 | Analytics Dashboard | Every owner wants this |
| 🟢 P4 | Online Payments (Razorpay) | High demand but requires business setup |
| 🟢 P4 | AI Chatbot | Great for demos |
| 🟢 P4 | Mobile App | Phase 4 — after web is solid |
| 🟢 P4 | Tally Export | Accountants love it |

---

---

# 🚀 Recommended Build Order

```
Week 1–3:   Customer Profiles + CRM
Week 4–6:   Lead Pipeline + Kanban Board
Week 7–8:   Followup Reminder System
Week 9–11:  Quotation Builder (no PDF yet)
Week 12:    WhatsApp Click-to-Chat Templates
Week 13–14: Installment Payment Tracker
Week 15–16: Receipt Generation (PDF)
Week 17–18: Expense Tracker + Profit Calculator
Week 19–20: Vendor Management + Ledger
Week 21–22: Driver Module
Week 23–24: Hotel Contracts
─────────────────────────── v2.0 Release ─────────────
Week 25–28: Customer Portal
Week 29–30: Cancellation Management
Week 31–32: Feedback + Review System
Week 33–36: Finance Module (P&L, Cash Book)
─────────────────────────── v3.0 Release ─────────────
Week 37–40: Multi-branch + RBAC
Week 41–44: Audit Logs + Approval Workflows
Week 45–48: AI Quote + Itinerary Generator
Week 49–52: Analytics & BI Dashboard
─────────────────────────── v4.0 Release ─────────────
Ongoing:    Mobile Apps, Integrations, Marketing
```

---

# 💰 Monetization Model Suggestion

| Plan | Target | Price/year | Key Features |
|---|---|---|---|
| **Starter** | Solo agent / 1-person agency | ₹12,000/yr | CRM, leads, quotes, payments, 1 user |
| **Growth** | Small agency 2–5 staff | ₹36,000/yr | All Phase 1 + Customer Portal + 5 users |
| **Professional** | Mid agency 6–20 staff | ₹1,20,000/yr | All Phase 1+2 + Multi-branch + RBAC + AI |
| **Enterprise** | Large agency 20+ staff | ₹5,00,000+/yr | Everything + Custom integrations + SLA |

---

> **This document should be updated as features are built. Completed features get moved to the "Current State" section at the top.**
>
> _Last updated: July 25, 2026_
