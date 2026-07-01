"use client";

import { useState } from "react";

type CopyMarkdownButtonProps = {
  content: string;
};

export function CopyMarkdownButton({ content }: CopyMarkdownButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink"
    >
      {status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : "Copy as Markdown"}
    </button>
  );
}
