"use client";

import React from "react";
import CreativeVideoUploader from "../../components/workPage/CreativeVideoUploader";

export default function AskUniverseUploadPage() {
  return (
    <CreativeVideoUploader
      section="ask_universe"
      heading="Ask the Universe"
      description="Post a video asking the community a question about your work, your genre, or your next project. Max 500 MB per video."
      titlePlaceholder="What are you asking the universe?"
    />
  );
}
