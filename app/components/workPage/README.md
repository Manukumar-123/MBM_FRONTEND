# mebookmeta — Work Upload Page Components

All Next.js frontend components for the book upload page, organized in a single `components/upload/` folder.

## 📁 File Structure

```
components/upload/
│
├── index.js                  ← Barrel exports (import { UploadPage } from "@/components/upload")
│
├── UploadPage.jsx            ← 🏠 Main orchestrator — state, form logic, layout
├── Navbar.jsx                ← Top navigation bar
├── HeroSection.jsx           ← Hero title + subtitle + divider
├── Stepper.jsx               ← 4-step progress indicator
├── ErrorList.jsx             ← Validation error display
├── FormActions.jsx           ← Bottom action bar (Back, Save Draft, Submit)
├── ProgressOverlay.jsx       ← Upload progress modal
├── SuccessModal.jsx          ← Post-submission success dialog
│
├── SectionWrapper.jsx        ← 🔧 Reusable card wrapper for each section
├── FileUploadZone.jsx        ← 🔧 Reusable drag-and-drop upload area
├── FileStatus.jsx            ← 🔧 Uploaded file info display (name, size, remove)
├── ToggleSwitch.jsx          ← 🔧 Reusable toggle switch
│
├── BookDetailsSection.jsx    ← Section 01 — Title, author, language, ISBN, etc.
├── CategorySection.jsx       ← Section 02 — Category, genre tags, audience
├── CoverMediaSection.jsx     ← Section 03 — Front/back cover, QR code upload
├── ManuscriptSection.jsx     ← Section 04 — Book PDF + sample PDF upload
├── CopyrightSection.jsx      ← Section 05 — License type, copyright year/holder
├── PricingSection.jsx        ← Section 06 — Price, download/preview toggles
├── AgreementsSection.jsx     ← Section 07 — Rights, terms, email opt-in
│
├── constants.js              ← All dropdown options, genres, categories, initial state
├── api.js                    ← Axios API client (submitBook, saveDraft, etc.)
└── upload.module.css         ← Complete CSS module (dark luxury theme)

globals.css                   ← Global styles (import in layout.js)
page.js                       ← Example Next.js route file (src/app/upload/page.js)
```

## 🚀 Setup

### 1. Copy files into your Next.js project

```
your-nextjs-project/
├── src/
│   ├── app/
│   │   ├── layout.js          ← import globals.css here
│   │   └── upload/
│   │       └── page.js        ← use the provided page.js
│   ├── components/
│   │   └── upload/            ← copy the entire upload/ folder here
│   └── styles/
│       └── globals.css        ← use the provided globals.css
```

### 2. Install dependencies

```bash
npm install axios
```

### 3. Set environment variable

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Import in your page

```jsx
// src/app/upload/page.js
import { UploadPage } from "@/components/upload";

export default function UploadRoute() {
  return <UploadPage />;
}
```

### 5. Import globals in layout

```jsx
// src/app/layout.js
import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 6. Run

```bash
npm run dev
# → http://localhost:3000/upload
```

## 🧩 Component Props Reference

| Component | Props |
|---|---|
| `UploadPage` | None — self-contained with all state |
| `Stepper` | `activeStep: number` |
| `SectionWrapper` | `number, icon, iconColor, title, description, delay, children` |
| `FileUploadZone` | `id, icon, title, subtitle, specs[], accept, preview, small, badge, onChange, style` |
| `FileStatus` | `file: File, onRemove: fn` |
| `ToggleSwitch` | `label, description, value: bool, onChange: fn` |
| `ErrorList` | `errors: string[]` |
| `ProgressOverlay` | `progress: number (0-100)` |
| `SuccessModal` | `onClose: fn` |
| Section components | `form: object, updateField: fn` + section-specific props |

## 🎨 Theme

Dark luxury editorial theme with:
- **Fonts**: Cormorant Garamond (headings), Outfit (body), IBM Plex Mono (code/specs)
- **Colors**: Deep noir background + warm gold accents
- **Effects**: Ambient glow orbs, film grain, gold focus rings, spring-physics animations
