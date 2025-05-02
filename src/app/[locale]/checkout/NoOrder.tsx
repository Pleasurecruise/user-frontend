import {Button} from "@heroui/react";
import {ArrowLeft} from "lucide-react";
import {useTranslations} from "next-intl";
import {useRouter} from "@/i18n/routing";

export default function NoOrder() {
  const t = useTranslations("Checkout");
  const router = useRouter();
  return <div className="flex h-screen justify-center items-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md">
      <div className="text-red-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24"
             stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-4">{t("invalidOrder") || "无效订单"}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {t("incompleteOrder")}
      </p>
      <Button
          onPress={() => router.push("/get-start")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-full font-medium flex items-center justify-center mx-auto"
      >
        <ArrowLeft className="w-4 h-4 mr-2"/>
        {t("backToPlans")}
      </Button>
    </div>
  </div>
}