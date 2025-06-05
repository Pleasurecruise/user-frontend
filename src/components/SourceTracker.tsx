'use client';


import { useEffect } from "react";

interface SourceTrackerProps {
  source?: string;
}

export default function SourceTracker({ source }: SourceTrackerProps) {
  useEffect(() => {
    if (source) {
      window.localStorage.setItem("source", source);
    }
  })
  return null
}
export function getSource() {
  return localStorage.getItem("source") ?? "";
}