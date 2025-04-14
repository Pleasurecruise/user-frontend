"use client";

import { Button, Input } from "@heroui/react";
import { useTranslations } from "next-intl";
import YearMonthPicker from "@/components/YearMonthPicker";
import React, { useState } from "react";
import { CLIENT_BACKEND } from "@/app/requests/misc";
import { closeAll, addToast } from "@heroui/toast";
import Revenue from "@/app/[locale]/dashboard/revenue";
import { ComputerDesktopIcon } from "@heroicons/react/16/solid";

export type RevenueType = {
  activated_at: Date
  amount: string
  application: string
  buy_count: number
  plan: string
  user_agent: string
}

export type RevenueResponse = {
  data: RevenueType[]
  ec: number
}

export default function Dashboard() {
  const t = useTranslations("Dashboard");

  const [month, setMonth] = useState<string>("");
  const [rid, setRid] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isUa, setIsUa] = useState<boolean>(false);

  const [revenueData, setRevenueData] = useState<RevenueType[]>([]);


  const handleMonthChange = (value: string) => setMonth(value);

  const handleRidChange = (e: React.ChangeEvent<HTMLInputElement>) => setRid(e.target.value);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!rid || !token) return;

    try {
      setIsLoading(true);
      const response: RevenueResponse = await fetch(`${CLIENT_BACKEND}/api/billing/revenue?rid=${rid}&date=${month}&is_ua=${+isUa}`, {
        headers: { Authorization: token },
      }).then(res => res.json());

      if (response.ec !== 200) {
        closeAll();
        addToast({
          description: t("error"),
          color: "warning",
        });
        return;
      }

      setRevenueData(response.data);
      setIsLogin(true);
    } catch (error) {
      console.error("Error:", error);
      closeAll();
      addToast({
        description: t("error"),
        color: "warning",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogOut = () => {
    setIsLogin(false);
    setRevenueData([]);
  };

  if (isLogin) {
    return <Revenue revenueData={revenueData} onLogOut={handleLogOut} rid={rid} date={month} />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="text-center min-w-[40vw]">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl text-gray-900 dark:text-white">
            {t("title")}
          </h2>
          <form
            className="flex gap-5 flex-col mt-12 text-balance text-lg leading-8 text-gray-600 dark:text-gray-400"
            onSubmit={onSubmit}
          >
            <YearMonthPicker onChange={handleMonthChange} />

            <div className="flex items-center gap-2 h-14">
              <div className="flex-grow">
                <Input
                  label={t("rid")} name="rid"
                  type="text" onChange={handleRidChange}
                />
              </div>
              <div className="flex items-center h-full justify-center">
                <button
                  onClick={() => setIsUa(!isUa)}
                  className={`flex items-center justify-center h-full w-14 rounded-md mr-1 transition-colors ${isUa ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-gray-100 dark:bg-gray-800'}`}
                  type="button"
                >
                  <ComputerDesktopIcon className={`h-1/2 w-1/2 ${isUa ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-500 dark:text-gray-400"
                    }`} />

                </button>
              </div>
            </div>
            <Input
              label={t("token")} name="token"
              type="password"
              onChange={handleTokenChange}
            />
            <Button
              type="submit" isLoading={isLoading}
              className="mt-6 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {t("confirm")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
