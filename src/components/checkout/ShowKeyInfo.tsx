import {useLocale, useTranslations} from "next-intl";
import { CheckCircle, MessageCircle, Layers } from "lucide-react";
import moment from "moment/moment";
import { OrderInfoType } from "@/components/checkout/YmPaymentModal";
import {addToast} from "@heroui/toast";
import { useRouter } from "@/i18n/routing";


export default function ShowKeyInfo(props: {
  info?: OrderInfoType
}) {
  const t = useTranslations("ShowKey");
  const router = useRouter();
  const info = props.info;
  if (!info) {
    return <></>;
  }
  const copyToClipboard = () => {
    if (info.cdk) {
      navigator.clipboard.writeText(info.cdk)
        .then(() => {
          addToast({
            color:"success",
            description: t("copySuccess"),
          })
        }).catch(err => {
          console.error(err);
        });
    }
  };

  const time = moment(info.expired_at).format("YYYY-MM-DD HH:mm:ss");

  const relativeTime = moment.duration(moment(info.expired_at).diff(moment())).humanize();

  const handleJoinQQGroup = () => {
    const group = "https://qm.qq.com/cgi-bin/qm/qr?k=tEmwz6tg9LJnHswOAGNcrBAESCIa1ju3&jump_from=webapi&authKey=8sOfUTnv02S1Cdm/KtdBz6GnPdpx4qXnLspeH48IIvFGChSte4V8C7NNkZ8i4/ra"
    window.open(group, "_blank");
  };

  const handleViewProjects = () => {
    router.push(`/projects`)
  };

  return <>
    <div className="text-center mb-6">
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>
      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t("thanksForBuying")}
      </h4>
      <p className="text-base text-gray-600 dark:text-gray-300 mb-2">
        {t("yourKey")}
      </p>
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4 flex items-center justify-between"
        onClick={copyToClipboard}
      >
        <span className="text-indigo-600 dark:text-indigo-400 font-mono select-all cursor-pointer">
          {info.cdk}
        </span>
        <button
          className="ml-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
        >
          {t("copy")}
        </button>
      </div>
      {info.expired_at && (
        <>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t.rich("expireAt", { time })}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t.rich("timeLeft", { relativeTime })}
          </span>
        </>
      )}
      
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
            onClick={handleJoinQQGroup}
            className="flex items-center justify-center py-3 px-6 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 dark:text-indigo-400"
        >
          <MessageCircle className="w-5 h-5 mr-2"/>
          <span>{t("joinQQGroup")}</span>
        </button>

        <button
            onClick={handleViewProjects}
            className="flex items-center justify-center py-3 px-6 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors dark:bg-emerald-900/30 dark:hover:bg-emerald-800/50 dark:text-emerald-400"
        >
          <Layers className="w-5 h-5 mr-2"/>
          <span>{t("viewProjects")}</span>
        </button>
      </div>
    </div>
  </>;
}