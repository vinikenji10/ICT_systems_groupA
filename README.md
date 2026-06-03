# SIT Club Hub (ICT Systems Group A)

Welcome to the **SIT Club Hub** repository! This platform is designed to connect Shibaura Institute of Technology (SIT) students with clubs, campus-wide events, and campus facilities. It supports a bilingual interface (English and Japanese) and authenticates users via their institutional Google accounts.

---

## 📖 Project Documentation

For a detailed breakdown of the system architecture, file structure, data models, and use cases, please refer to the main architecture document:

* 📂 **[System Architecture & Design Document (docs/architecture.md)](./docs/architecture.md)**

---

## 🛠️ Repository Structure

* 📂 **[`sit-club-hub/`](./sit-club-hub/)**: Frontend Next.js 16 (App Router) web application utilizing React 19, TypeScript, and Tailwind CSS.
* 📂 **[`functions/`](./functions/)**: Python 3.13 serverless Cloud Functions for Firebase.
* 📂 **[`docs/`](./docs/)**: Technical architecture document, diagrams source files (`.d2`), and compiled SVG files.
* 📄 **[`firebase.json`](./firebase.json)**: Global configuration for Firebase deployment targets.
* 📄 **[`firestore.rules`](./firestore.rules)**: Database authorization and security rules.

---

## 🚀 Getting Started

### Prerequisites
1. **Node.js** (v18+ recommended)
2. **Python** (v3.13, needed for Cloud Functions)
3. **Firebase CLI** installed globally (`npm install -g firebase-tools`)
4. **D2** (optional, for diagram generation)

### Running the Frontend locally
1. Navigate to the frontend directory:
   ```bash
   cd sit-club-hub
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the configuration template and fill in your Firebase project API keys (if needed, otherwise the default config is provided in `app/firebase/config.ts`):
   ```bash
   cp app/firebase/config_template.ts app/firebase/config.ts
   ```
4. Start the local Next.js development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

### Deploying to Firebase
To deploy the entire stack (Hosting, Cloud Functions, and Firestore rules) to your Firebase project:
```bash
# Log in to your Firebase account
firebase login

# Deploy all services
firebase deploy
```
