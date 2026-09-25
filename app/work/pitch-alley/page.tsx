"use client";

import React from "react";
import CreativeVideoUploader from "../../components/workPage/CreativeVideoUploader";

export default function PitchAlleyUploadPage() {
  return (
    <CreativeVideoUploader
      section="pitch_alley"
      heading="Pitch Alley"
      description="Upload a short video pitching your book to readers and publishers browsing Pitch Alley. Max 100 MB, up to 1 minute — automatically compressed to 25 MB."
      titlePlaceholder="Pitch title — what are you pitching?"
    />
  );
}
