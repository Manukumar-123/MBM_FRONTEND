"use client";

import React from "react";
import CreativeVideoUploader from "../../components/workPage/CreativeVideoUploader";

export default function AskUniverseUploadPage() {
  return (
    <CreativeVideoUploader
      section="ask_universe"
      heading="Ask the Universe"
      description="Post a video asking the community a question about your work, your genre, or your next project. Max 100 MB, up to 1 minute — automatically compressed to 25 MB."
      titlePlaceholder="What are you asking the universe?"
    />
  );
}
