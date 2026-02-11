// ─────────────────────────────────────────────
// app/upload/page.js
//
// This is the Next.js App Router page file.
// Place this at: src/app/upload/page.js
// ─────────────────────────────────────────────

import { UploadPage } from "@/components/upload";

export const metadata = {
  title: "Upload Your Work — mebookmeta",
  description:
    "Upload and publish your book on mebookmeta, the platform for authors, writers, and publishers.",
};

export default function UploadRoute() {
  return <UploadPage />;
}
