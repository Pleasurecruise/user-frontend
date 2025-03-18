"use client";

import moment from "moment";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

export default function Countdown({ toTime }: { toTime: number }) {
  const tc = useTranslations("Common");
  const [counter, setCounter] = useState(toTime - moment().unix());

  useMemo(() => {
    const interval = setInterval(() => {
      setCounter(toTime - moment().unix());
    }, 1000);
    return () => clearInterval(interval);
  }, [toTime]);

  const days = useMemo(() => Math.floor(counter / 86400).toString().padStart(2, "0"), [counter]);
  const hours = useMemo(() => Math.floor((counter % 86400) / 3600).toString().padStart(2, "0"), [counter]);
  const minutes = useMemo(() => Math.floor((counter % 3600) / 60).toString().padStart(2, "0"), [counter]);
  const seconds = useMemo(() => (counter % 60).toString().padStart(2, "0"), [counter]);

  return (
    <div className="flex items-start justify-center w-full gap-4">
      <div className="timer">
        <div
          className="">
          <h3 className="days font-manrope font-semibold text-2xl text-indigo-400 text-center">
            {days}
          </h3>
        </div>
        <p className="text-sm font-normal mt-1 text-center w-full">{tc("durationDays")}</p>
      </div>
      <h3 className="font-manrope font-semibold text-2xl text-indigo-400">:</h3>
      <div className="timer">
        <div className="">
          <h3 className="hours font-manrope font-semibold text-2xl text-indigo-400 text-center">
            {hours}
          </h3>
        </div>
        <p className="text-sm font-normal mt-1 text-center w-full">{tc("durationHours")}</p>
      </div>
      <h3 className="font-manrope font-semibold text-2xl text-indigo-400">:</h3>
      <div className="timer">
        <div className="">
          <h3 className="minutes font-manrope font-semibold text-2xl text-indigo-400 text-center">
            {minutes}
          </h3>
        </div>
        <p className="text-sm font-normal mt-1 text-center w-full">{tc("durationMinutes")}</p>
      </div>
      <h3 className="font-manrope font-semibold text-2xl text-indigo-400">:</h3>
      <div className="timer">
        <div className="">
          <h3 className="seconds font-manrope font-semibold text-2xl text-indigo-400 text-center">
            {seconds}
          </h3>
        </div>
        <p className="text-sm font-normal mt-1 text-center w-full">{tc("durationSeconds")}</p>
      </div>
    </div>
  );
}
