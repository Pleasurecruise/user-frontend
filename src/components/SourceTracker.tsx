'use client';


import { useEffect } from "react";

interface SourceTrackerProps {
  source?: string;
}

export default function SourceTracker({ source }: SourceTrackerProps) {
  useEffect(() => {
    source && window.sessionStorage.setItem("source", source);
  })
  return null
}
export function getSource() {
  return sessionStorage.getItem("source") ?? "";
}