"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import LoadingState from "@/components/LoadingState";
import { CLIENT_BACKEND } from "@/app/requests/misc";
import { addToast } from "@heroui/toast";
import HomeButton from "@/components/HomeButton";

export default function GetKey() {
  const t = useTranslations("GetKey");
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!orderId.trim()) return;

    setIsLoading(true);

    try {
      // Optional: validate order ID before redirecting
      const response = await fetch(`${CLIENT_BACKEND}/api/billing/order/afdian?order_id=${orderId}`);
      const data = await response.json();

      router.push(`/show-key?order_id=${orderId}`);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState
      title={t("thanksForBuying")}
      description={t("loading")}
    />;
  }

  return (
    <>
      <div className="px-3 flex min-h-screen flex-1 flex-col justify-center relative transition-colors duration-300 bg-white dark:bg-transparent">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm relative">
          <HomeButton className="absolute bottom-0" />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {t("title")}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="key" className="block text-sm/6 font-medium text-gray-700 dark:text-gray-200">
                {t("orderId")}
                <span style={{ float: "right" }}>
                  <Link
                    href="https://afdian.com/dashboard/order"
                    target="_blank"
                    className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                  >
                    <u><em>{t("queryOrderId")}</em></u>
                  </Link>
                </span>
              </label>
              <div className="mt-4">
                <input
                  id="key"
                  name="key"
                  value={orderId}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setOrderId(value);
                    } else {
                      addToast({
                        color: "warning",
                        description: t("errorOrderFormat"),
                      })
                    }
                  }}
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base dark:text-white outline outline-1 -outline-offset-1 dark:outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {t("getKey")}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
