"use client";

import React from "react";
import CreativeVideoUploader from "../../components/workPage/CreativeVideoUploader";

export default function PitchAlleyUploadPage() {
  return (
    <CreativeVideoUploader
      section="pitch_alley"
      heading="Pitch Alley"
      description="Pitch your book in a short video. Readers and publishers browsing Pitch Alley see it first."
      titlePlaceholder="Pitch title — what are you pitching?"
    />
  );
}
