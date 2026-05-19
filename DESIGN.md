# Design System & UI Documentation: SIT Club Hub

This document outlines the visual design, layout structure, and component architecture for the **SIT Club Hub** web application based on the current user interface implementation.

---

## 1. Color Palette

The platform uses a natural, academic-leaning color palette consisting of deep greens, warm cream tones, and dark charcoal text for high contrast and readability.

| Category | Color Purpose | Hex Code (Estimated) | Preview |
| --- | --- | --- | --- |
| **Primary** | Header, Navigation, Primary Buttons | `#0C4A34` | Deep Forest Green |
| **Secondary/Accent** | Accent badges, hover borders | `#D2B48C` / `#E6D7C3` | Muted Gold / Warm Tan |
| **Background (Main)** | Page Canvas | `#F4F1EA` | Off-White / Cream |
| **Background (Cards)** | Individual component backgrounds | `#FFFFFF` | Pure White |
| **Text (Primary)** | Headings, core body text | `#111111` | Dark Charcoal |
| **Text (Secondary)** | Subtitles, footer links | `#4A4A4A` | Medium Gray |

---

## 2. Typography

* **Font Family:** Clean, modern Sans-serif (e.g., Inter, Roboto, or system UI fonts).
* **Scale Hierarchy:**
* `H1` (Logo/Brand Name): Bold, Uppercase, ~24px
* `H2` (Section Headers like "EXPLORE SPORTS CLUBS"): Extra Bold, Uppercase, ~22px
* `H3` (Card Titles): Bold, Uppercase, ~16px
* `Body Text`: Regular, ~14px
* `Badges/Labels`: Semi-bold, ~12px



---

## 3. Layout Architecture

The application uses a standard web dashboard layout with a fixed-width sidebar grid system.

```
+-----------------------------------------------------------------------------------------+
|                                       NAVBAR                                            |
+--------------------------+--------------------------------------------------------------+
|                          |  SEARCH & BANNER                                             |
|                          +--------------------------------------------------------------+
|  SIDEBAR FILTERS         |  MAIN CONTENT GRID                                           |
|                          |  [ Card ]   [ Card ]   [ Card ]   [ Card ]   [ Card ]        |
|  - Sport Type (Chx)      |                                                              |
|  - Activity Level (Chx)  |  [ Card ]   [ Card ]   [ Card ]   [ Card ]   [ Card ]        |
|  - Status (Chx)          |                                                              |
+--------------------------+--------------------------------------------------------------+
|                                       FOOTER                                            |
+-----------------------------------------------------------------------------------------+

```

### Navigation Bar

* **Left:** SIT Branding Logo + "SIT CLUB HUB" text.
* **Center:** Rounded Search Bar with an inline magnifying glass icon (`Search clubs by name or sport...`).
* **Right:** Navigation Links ("Explore Clubs", "Events", "Leader Login" with user icon, "Support").

### Sidebar Filter Panel

* Occupies roughly 15-20% of the viewport width on desktop.
* **Filter Groups:**
* `Sport Type`: Teams, Martial Arts, Individual (Checkbox inputs).
* `Activity Level`: Competitive, Recreational (Checkbox inputs).
* `Status`: Active, Recruiting (Checkbox inputs).



### Main Content Area

* Displays a dynamic slogan header: `DISCOVER YOUR COMMUNITY | Explore Student Clubs at SIT`.
* Uses a multi-column responsive grid layout (6 columns visible on extra-wide screens).

---

## 4. Component Specifications

### Club Card Component

Every sports club is encapsulated within a standard card component:

* **Container:** White background, subtle rounded corners (`border-radius: 8px`), light box-shadow.
* **Image:** Fixed-height aspect ratio bounding box showing the sport action shot.
* **Header:** `H3` title, uppercase, bold (e.g., `SIT BASEBALL`).
* **Tag Cloud:** Horizontal flex-row containing pill badges. Colors rotate between beige/tan backgrounds with dark text depending on properties (e.g., `Recruiting`, `Competitive`, `Active`).
* **Description:** Short excerpt truncated with an ellipsis (`text-overflow: ellipsis`) at 2 lines.
* **CTA Button:** Full-width deep green button containing the text `VIEW CLUB DETAILS` in white uppercase text.

---

## 5. UI Quirks & Known Fixes needed (Typos Identified)

During frontend data population, some placeholder texts and labels have minor spelling errors that should be updated in your source code/JSON files:

* **SIT Esports Card:** Currently reads `SIT ESORTS`. Update title to `SIT ESPORTS`.
* **SIT Tennis Card:** Description contains `ou1ornniso and such a ontie events`. Replace with standard English copy.
* **SIT Volleyball Card:** Description contains `Badmionn is anrie and...`. Fix spelling or remove badminton reference from the volleyball card.
* **SIT Basketball Card:** Description contains `comoninasnem...`. Replace with clean copy.

---

## 6. Responsiveness Strategy (Mobile/Tablet)

* **Breakpoint - Mobile (< 768px):** * The Sidebar Filter should collapse into a top-level drawer or a toggleable modal overlay.
* The Grid layout should scale down to 1 or 2 columns maximum.
* The Search Bar inside the Navbar should collapse into a single toggleable icon to save horizontal estate.


* **Breakpoint - Tablet (768px - 1024px):**
* Grid shifts to 3 columns.
* Sidebar remains pinned but narrows in width.
