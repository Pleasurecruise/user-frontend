import React from "react";
import { CheckCircle, ThumbsUp } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PaymentOption({ checked, name, onClick, children, recommended = false }: {
  checked: boolean,
  children?: React.ReactNode,
  onClick: () => void,
  name: string,
  recommended?: boolean
}) {
  const t = useTranslations('Checkout');
  return (<label
    className={`relative flex items-center p-4 rounded-xl cursor-pointer transition-colors border ${checked ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
    onClick={onClick}
  >
    {recommended && (
      <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-sm">
        <ThumbsUp className="w-3 h-3 mr-1" />
        <span>{t('recommended')}</span>
      </div>
    )}

    <input
      type="radio"
      name="payment"
      value="afdian"
      checked={checked}
      onChange={onClick}
      className="sr-only"
    />

    <div className="flex items-center flex-1">
      {children}
      <span className="font-medium text-gray-900 dark:text-white">{name}</span>
    </div>
    <div
      className={`w-5 h-5 ml-6 rounded-full border-2 flex items-center justify-center mr-3 ${checked ? "border-indigo-600" : "border-gray-300 dark:border-gray-600"}`}>
      {checked && (
        <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
      )}
    </div>
  </label>);
}