"use client";

import { useState } from "react";
import { Button, CircularProgress } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";

import ProcessLabel from "./progress-label";
import { CLIENT_BACKEND } from "@/app/requests/misc";

export default function App() {
  const t = useTranslations("Order");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [timeoutValue, setTimeoutValue] = useState(false);
  const [error, setError] = useState(false);

  const customId = searchParams.get("customId");
  if (!customId) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Button onPress={() => router.push("/get-key")}>
          {t("InputOrderId")}
        </Button>
      </div>
    );
  }

  const fetcher = async () => {
    const response = await fetch(`${CLIENT_BACKEND}/api/billing/order/afdian?custom_order_id=${customId}`);
    if (response.ok) {
      const data = await response.json();
      if (data.ec === 200) {
        clearInterval(fetchIntervalTimer);
        clearTimeout(timeoutTimer);
        const { order_id } = data.data;
        router.push(`/show-key?order_id=${order_id}`);
      }
    }
  };

  const timeoutTimer = setTimeout(() => {
    setTimeoutValue(true);
  }, 20 * 1000);

  const stopFetchTimer = setTimeout(() => {
    setError(error);
  }, 10 * 60 * 1000);

  const fetchIntervalTimer = setInterval(() => {
    if (error) {
      clearInterval(fetchIntervalTimer);
      return;
    }
    fetcher();
  }, 3000);

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold m-8">{t("ThanksForSponsoring")}</h1>
        <div className="relative">
          <CircularProgress
            isIndeterminate
            size="lg"
            label={<ProcessLabel />}
            className="max-w-md"
          />
          {(error || timeoutValue) && (
            <div className="fixed right-4 bottom-4">
              <Button onPress={() => router.push("/get-key")}>
                {t("InputOrderId")}
              </Button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
