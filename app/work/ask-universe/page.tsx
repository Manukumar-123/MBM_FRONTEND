"use client";

import React from "react";
import CreativeVideoUploader from "../../components/workPage/CreativeVideoUploader";

export default function AskUniverseUploadPage() {
  return (
    <CreativeVideoUploader
      section="ask_universe"
      heading="Ask the Universe"
      description="Post a short video question about your work, your genre, or your next project. Other creatives answer from the community."
      titlePlaceholder="What are you asking the universe?"
    />
  );
}
