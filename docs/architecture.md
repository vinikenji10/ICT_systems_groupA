# SIT Club Hub System Architecture

This document describes the architectural design, system construction, use cases, and database structure of the **SIT Club Hub** platform—a bilingual club, event, and facility directory system tailored for the Shibaura Institute of Technology (SIT) campus community.

---

## 1. Project File Structure

Below is an overview of the directory structure of the project repository. It is structured as a monorepo containing a Next.js frontend, a Python-based Firebase Functions backend, and Firebase configuration files at the root level.

```text
ICT_systems_groupA/
├── firebase.json                # Main Firebase configuration (Hosting, Functions, Firestore)
├── firestore.rules              # Firebase Security Rules for database authorization
├── firestore.indexes.json       # Index configurations for complex Firestore queries
├── .firebaserc                  # Target Firebase project identifier (ict-systems-project-a)
│
├── sit-club-hub/                # Frontend Application (Next.js 16)
│   ├── app/                     # Next.js App Router folders
│   │   ├── layout.tsx           # Global layout structure
│   │   ├── page.tsx             # Homepage: Club Discovery & Search
│   │   ├── admin/               # Admin Portal (Role assignment, category management)
│   │   ├── clubs/               # Public Club directory
│   │   │   └── [id]/            # Individual Club profile details & join applications
│   │   ├── dashboard/           # Club Leader Portal
│   │   │   ├── page.tsx         # Dashboard index (lists managed clubs)
│   │   │   ├── edit/[id]/       # Modify club metadata & upload logo
│   │   │   ├── events/[id]/     # Manage club-specific events
│   │   │   └── applications/[id]/ # Review and approve membership requests
│   │   ├── events/              # Campus Events calendar page
│   │   ├── facilities/          # Campus Facilities directory page
│   │   ├── login/               # Sign-in page with Google Authentication
│   │   ├── firebase/            # Firebase Client SDK initializer (config.ts)
│   │   ├── hooks/               # Custom React hooks (useAuth.ts)
│   │   ├── contexts/            # Language & Translation providers
│   │   └── types/               # TypeScript interface definitions (index.ts)
│   ├── public/                  # Static assets and images
│   ├── package.json             # Frontend package definitions and dependencies
│   └── tsconfig.json            # TypeScript settings
│
├── functions/                   # Backend Cloud Functions (Python 3.13)
│   ├── main.py                  # API endpoints and background triggers
│   └── requirements.txt         # Python package dependencies
│
└── docs/                        # Project Documentation
    ├── architecture.md          # This architecture document
    ├── diagrams/                # D2 source code for system diagrams
    └── images/                  # Compiled SVGs for system diagrams
```

---

## 2. Project Construction & Data Flow

The project is built on a serverless, cloud-first paradigm leveraging **Google Cloud / Firebase**. The architecture decouples the user-facing web frontend from backend databases and servers.

### Frontend Application
- **Location:** Inside `sit-club-hub/`.
- **Framework:** **Next.js 16** (App Router) combined with **React 19**, written in **TypeScript** and styled with **Tailwind CSS**.
- **Execution:** Next.js is configured inside `firebase.json` for dynamic deployment. Under the hood, Firebase Hosting automatically optimizes and runs the Next.js SSR server on Cloud Functions.

### Database & Storage
- **Location:** Configured in `firebase.json` and client sdk `sit-club-hub/app/firebase/config.ts`.
- **Cloud Firestore (NoSQL Database):** The application queries Firestore directly from the client code. All page data (clubs, categories, events, facilities, users, and applications) is stored in collections within Firestore in the `asia-northeast1` region.
- **Cloud Storage:** Image files, specifically club logos and banners, are uploaded to a Firebase Cloud Storage bucket (`ict-systems-project-a.firebasestorage.app`) directly from the leader dashboard.

### Authentication & Authorization
- **Location:** Custom hook `sit-club-hub/app/hooks/useAuth.ts`.
- **Identity Provider:** **Firebase Authentication** configured with Google Sign-in.
- **Domain Constraint:** Sign-in is restricted exclusively to SIT institutional email accounts (`@shibaura-it.ac.jp`). Specific bypass emails are hardcoded in the authentication hook for developers/evaluators.
- **Authorization Model:** When a user logs in for the first time, a user document is created in the `users` collection with a default role of `student`. Club Leaders and Administrators are granted higher permissions by changing the role field inside their Firestore user record.

### Extensible Backend Logic
- **Location:** Inside `functions/`.
- **Language:** **Python 3.13** runtime with the `firebase_functions` and `firebase_admin` packages.
- **Functionality:** Provides serverless endpoints and event triggers to run operations that cannot be safely executed on the client side (e.g., scheduled cleanup, elevated administrative tasks, integration with external calendars).

---

## 3. System Architecture Diagram

The system architecture diagram below describes how the client browser accesses the system, and how the frontend components integrate with the Firebase serverless ecosystem.

![System Architecture Diagram](./images/system_architecture.svg)

### Interaction Sequence
1. **Accessing the Website:** The user requests pages through their browser. **Firebase Hosting** serves the Next.js single-page application and executes server-side rendering where applicable.
2. **User Authentication:** When a user logs in, the Next.js app communicates with **Firebase Authentication** via the Google OAuth 2.0 popup.
3. **Database Transactions:** The client application uses the Firebase Client SDK to query **Cloud Firestore** collections directly (e.g., retrieving lists of clubs or updating event schedules).
4. **Media Storage:** When a Club Leader updates their club profile logo, the app uploads the binary file directly to **Cloud Storage** and updates the image URL references inside the respective Firestore document.
5. **Serverless Actions (Optional):** Web requests demanding elevated backend validation route through HTTP/callable triggers in **Cloud Functions**.

---

## 4. Use Case Diagram & System Roles

The system recognizes three user roles: **Student (General User)**, **Club Leader**, and **Administrator**. Permissions inherit downward, meaning an administrator has all club leader and student rights.

![Use Case Diagram](./images/use_case.svg)

### System Roles Detail
1. **Student / General User (Authenticated)**
   - **Login:** Can sign in using their `@shibaura-it.ac.jp` email.
   - **Browse & Search:** Search clubs by keyword, category, or custom tags.
   - **Club Profiles:** View detailed profiles containing schedules, locations, membership fees, and bilingual descriptions.
   - **Campus Events:** View a chronological calendar of public club-hosted events.
   - **Facilities Directory:** View building/room directory information and operating hours for school facilities.
   - **Join Clubs:** Submit membership applications directly from a club’s profile page.

2. **Club Leader**
   - **Edit Club Profile:** Update description details (English and Japanese), upload logo/banner images, and modify membership settings.
   - **Manage Club Events:** Create new events, update details (times, locations, target audiences), and set visibility (public vs. private/internal).
   - **Manage Member Applications:** View pending applications from students, with options to approve or reject them.

3. **Administrator**
   - **Create Draft Clubs:** Create blank club documents in Firestore, which are then customized by the assigned leaders.
   - **Promote Users:** Promote a standard student to a club leader role by adding their user UID to the club's `leaderIds` array and updating their Firestore role to `leader`.
   - **Manage Categories:** Add, edit, or delete categories (such as *Engineering*, *Sports*, or *General*) that clubs use for classification.

---

## 5. Data Models (Firestore Schema)

Firestore is structured as a NoSQL database composed of document collections. The major documents map to the TypeScript definitions in `sit-club-hub/app/types/index.ts`:

### `users` Collection
Stores user records created during the first Google authentication handshake.
```typescript
interface User {
  uid: string;          // Firestore Document ID (matches Firebase Auth UID)
  email: string;        // Google Account Email (@shibaura-it.ac.jp)
  displayName: string;  // Student name
  role: 'student' | 'leader' | 'admin';
  createdAt: Timestamp;
}
```

### `clubs` Collection
Bilingual profile documents for each active school club.
```typescript
interface Club {
  id: string;                 // Firestore Document ID
  name_en: string;            // Club name (English)
  name_ja: string;            // Club name (Japanese)
  category: string;           // Category Document ID reference (e.g., 'sports')
  description_en: string;
  description_ja: string;
  tags: string[];             // Keyword tags for search indexing
  logoUrl?: string;           // URL linking to Firebase Storage asset
  status?: 'active' | 'inactive';
  leaderIds?: string[];       // Firebase Auth UIDs allowed to edit this club
  instagramUrl?: string;
  
  // Bilingual detailed parameters
  activity_en?: string;       activity_ja?: string;
  level_en?: string;          level_ja?: string;
  schedule_en?: string;       schedule_ja?: string;
  scheduleInfo_en?: string;   scheduleInfo_ja?: string;
  location_en?: string;       location_ja?: string;
  mainPlaces_en?: string;     mainPlaces_ja?: string;
  equipment_en?: string;      equipment_ja?: string;
  membershipFee_en?: string;  membershipFee_ja?: string;
  payment_en?: string;        payment_ja?: string;
}
```

### `events` Collection
Individual events scheduled and owned by clubs.
```typescript
interface Event {
  id: string;           // Firestore Document ID
  clubId: string;       // Owner Club Document ID reference
  title_en: string;
  title_ja: string;
  description_en?: string;
  description_ja?: string;
  startTime: Timestamp;
  endTime: Timestamp;
  location_en: string;
  location_ja: string;
  isPublic: boolean;    // True if visible on the main campus calendar page
}
```

### `facilities` Collection
Directory of physical campus buildings, rooms, and facilities.
```typescript
interface Facility {
  id: string;           // Firestore Document ID
  name_en: string;
  name_ja: string;
  description_en: string;
  description_ja: string;
  building: string;     // Campus building name/number
  floor: string;
  roomNumber: string;
  imageUrl?: string;
  facilities: string[]; // List of available equipment (e.g., ["Wi-Fi", "Projector"])
  hours_en: string;     // Operating hours
  hours_ja: string;
  tags: string[];
}
```

### `applications` Collection
Stores applications submitted by students to join particular clubs.
```typescript
interface Application {
  id: string;           // Firestore Document ID
  clubId: string;       // Target Club Document ID reference
  studentId: string;    // Applicant User UID reference
  studentName: string;
  studentEmail: string;
  message: string;      // Optional introduction message from applicant
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: Timestamp;
}
```

### `categories` Collection
Pre-defined classifications for organizing clubs.
```typescript
interface Category {
  id: string;           // Firestore Document ID (e.g., 'sports', 'engineering')
  name_en: string;      // "Sports"
  name_ja: string;      // "スポーツ"
}
```
