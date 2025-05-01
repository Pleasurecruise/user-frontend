"use client";

import { cn } from "@/lib/utils/css";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Plan } from "@/app/requests/plan";

type PropsType = {
  plan: Plan;
  C2URate: number;
};

export default function PlanCard({ plan, C2URate }: PropsType) {
  const t = useTranslations("GetStart");
  const router = useRouter();

  const jumpToOrder = () => {
    router.push(`/pay?plan=${plan.plan_id}`);
  };

  const planName = t.has(`planTitle.${plan.title}`)
    ? t(`planTitle.${plan.title}`)
    : plan.title;

  const priceFixed: number = Number(t("priceFixed"));
  const price: number = parseFloat((Number(plan.price) * C2URate).toFixed(priceFixed));
  const originalPrice: string | null = plan.original_price > plan.price
    ? (Number(plan.original_price) * C2URate).toFixed(priceFixed)
    : null;
  return (
    <div
      key={plan.plan_id}
      className={cn(
        plan.popular ? "ring-2 ring-indigo-600" : "ring-1 ring-gray-200",
        "rounded-3xl p-8 bg-white dark:bg-white/5 shadow-sm flex flex-col"
      )}
    >
      <h3
        id={plan.plan_id}
        className={cn(
          plan.popular
            ? "text-indigo-600"
            : "text-gray-900 dark:text-white",
          "text-lg/8 font-semibold"
        )}
      >
        {planName}
      </h3>
      {originalPrice ? (
        <p className="mt-6 flex items-baseline gap-x-1 basis-full text-nowrap">
          <span className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {`
              ${t("priceSymbol")}
              ${price}
            `}
          </span>
          <span className="text-sm/6 line-through text-gray-500 dark:text-gray-400">
            {`
              ${t("priceSymbol")}
              ${originalPrice}
            `}
          </span>
        </p>
      ) : (
        <p className="mt-6 flex items-baseline gap-x-1 basis-full text-nowrap">
          <span className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {`
              ${t("priceSymbol")}
              ${price}
            `}
          </span>
        </p>
      )}
      {/* {plan.discount && (
        <div className="mt-1 text-sm/6 text-gray-900 dark:text-white">
          {t('LimitTimeOffer')}
          <Countdown toTime={plan.discount.endAt} />
        </div>
      )} */}
      <a
        href={`/pay?plan=${plan.plan_id}`}
        target="_blank"
        aria-describedby={plan.plan_id}
        onClick={jumpToOrder}
        className={cn(
          plan.popular
            ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
            : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 dark:text-white",
          "mt-6 block rounded-md px-3 py-2 text-center text-sm/6 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        )}
      >
        {t("buyAtAfdian")}
      </a>
      {/* <ul role="list" className="mt-8 space-y-3 text-sm/6 text-gray-600">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-x-3">
            <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-indigo-600" />
            {feature}
          </li>
        ))}
      </ul> */}
    </div>
  );
}
