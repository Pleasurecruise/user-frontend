"use client";

import { useFormatter, useTranslations } from "next-intl";
import { ChangeEvent, useCallback, useState } from "react";
import { Button, Input } from "@heroui/react";
import { debounce } from "lodash";
import moment from "moment";

import { useRouter } from "@/i18n/routing";
import { CLIENT_BACKEND } from "@/app/requests/misc";
import HomeButton from "@/components/HomeButton";

export default function Transmission() {
  const format = useFormatter();
  const t = useTranslations("Transmission");
  const router = useRouter();

  const [fromOrderId, setFromOrderId] = useState("");
  const [fromOrderDescription, setFromOrderDescription] = useState("");
  const [fromOrderIdValid, setFromOrderIdValid] = useState(false);
  const [toOrderId, setToOrderId] = useState("");
  const [toOrderDescription, setToOrderDescription] = useState("");
  const [toOrderIdValid, setToOrderIdValid] = useState(false);
  const [transfering, setTransfering] = useState(false);

  async function handleReward(orderId: string) {
    const response = await fetch(`${CLIENT_BACKEND}/api/billing/reward?reward_key=${orderId}`);
    const { ec, msg, data } = await response.json();
    if (ec === 200) {
      if (data.remaining <= 0) {
        setFromOrderDescription(t("rewardUsedUp"));
        return;
      }
      const startAt = moment(data.start_at);
      const expiredAt = moment(data.expired_at);
      if (startAt.isAfter(moment())) {
        setFromOrderDescription(t("rewardNotStarted"));
        return;
      }
      if (expiredAt.isBefore(moment())) {
        setFromOrderDescription(t("rewardExpired"));
        return;
      }
      const valid_days = data.valid_days;
      setFromOrderDescription(t("rewardValidDays", { valid_days }));
      setFromOrderIdValid(true);
    }
  }

  function IsReward(orderId: string) {
    return !Number(orderId) && !orderId.startsWith("YMF");
  }

  async function requestFromOrderId(orderId: string) {
    if (IsReward(orderId)) {
      await handleReward(orderId);
      return;
    }

    const response = await fetch(`${CLIENT_BACKEND}/api/billing/order/query?order_id=${orderId}`);
    const { ec, msg, data } = await response.json();
    if (ec === 200) {
      const expiredAt = moment(data.expired_at);
      const createdAt = moment(data.created_at);
      if (expiredAt.isBefore(moment())) {
        setFromOrderDescription(t("orderExpired"));
        return;
      }
      if (createdAt.isBefore(moment().subtract(3, "day"))) {
        setFromOrderDescription(t("orderTooOld"));
        return;
      }
      const relativeTime = format.relativeTime(expiredAt.toDate(), { unit: "day" });
      setFromOrderDescription(`${relativeTime} (${timeFormat(expiredAt.toDate())})`);
      setFromOrderIdValid(true);
    }
    else {
      setFromOrderDescription(msg);
      setFromOrderIdValid(false);
    }
  }

  async function requestToOrderId(orderId: string) {
    if (IsReward(orderId)) {
      setToOrderDescription(t("rewardFillInLeft"));
      setToOrderIdValid(false);
      return;
    }

    const response = await fetch(`${CLIENT_BACKEND}/api/billing/order/query?order_id=${orderId}`);
    const { ec, msg, data } = await response.json();
    if (ec === 200) {
      const expiredAt = moment(data.expired_at);
      if (expiredAt.isBefore(moment())) {
        setToOrderDescription(t("orderExpired"));
      } else {
        const relativeTime = format.relativeTime(expiredAt.toDate(), { unit: "day" });
        setToOrderDescription(`${relativeTime} (${timeFormat(expiredAt.toDate())})`);
      }
      setToOrderIdValid(true);
    }
    else {
      setToOrderDescription(msg);
      setToOrderIdValid(false);
    }
  }

  const requestFromOrderIdDebounced = useCallback(debounce(requestFromOrderId, 2000), []);
  const requestToOrderIdDebounced = useCallback(debounce(requestToOrderId, 2000), []);

  async function handleFromOrderIdChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setFromOrderId(value);
    setFromOrderDescription("");
    setFromOrderIdValid(false);
    requestFromOrderIdDebounced(value);
  }

  async function handleToOrderIdChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setToOrderId(value);
    setToOrderDescription("");
    setToOrderIdValid(false);
    requestToOrderIdDebounced(value);
  }

  async function handleTransfer() {
    setTransfering(true);
    const response = await fetch(`${CLIENT_BACKEND}/api/billing/order/transfer?from=${fromOrderId}&to=${toOrderId}`);
    const { ec, msg } = await response.json();
    if (ec === 200) {
      router.replace(`/show-key?order_id=${toOrderId}`);
    } else {
      alert(msg);
    }
    setTransfering(false);
  }

  function timeFormat(time: Date) {
    return format.dateTime(time, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="text-center w-full max-w-md md:min-w-[48rem] px-4 relative">
        <HomeButton className="absolute left-3" />
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">{t("title")}</h2>
        <div className="mt-4 md:mt-6 text-pretty text-base/7 md:text-lg/8 text-gray-600">{t("description")}</div>
        <div className="flex flex-col md:flex-row justify-center items-center mt-6 space-y-4 md:space-y-0 md:space-x-6">
          <Input
            className="w-full md:min-w-[10rem]"
            label={t("fromOrderId")}
            value={fromOrderId}
            onChange={handleFromOrderIdChange}
            description={fromOrderDescription}
          />
          <div className="hidden md:block px-2 py-1 md:py-0 flex-1 text-nowrap">{t("transferTo")}</div>
          <div className="rotate-90 md:rotate-0 px-2 py-1 md:py-0">→</div>
          <Input
            className="w-full md:min-w-[10rem]"
            label={t("toOrderId")}
            value={toOrderId}
            onChange={handleToOrderIdChange}
            description={toOrderDescription}
          />
        </div>
        <div className="mt-4">

        </div>
        <Button
          className="mt-6"
          onClick={handleTransfer}
          color="primary"
          isLoading={transfering}
          isDisabled={!fromOrderIdValid || !toOrderIdValid}
        >
          {t("transfer")}
        </Button>
      </div>
    </div >
  );
}
