"use client";

import { useTranslations } from "next-intl";

export default function ProgressLabel() {
  const t = useTranslations("Order");

  return (
    <span className="text-pretty text-lg">
      {t("ProcessingOrder")}
    </span>
  );
}
