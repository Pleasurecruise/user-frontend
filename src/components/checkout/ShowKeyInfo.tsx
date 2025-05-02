import {useTranslations} from "next-intl";
import {CheckCircle} from "lucide-react";
import moment from "moment/moment";
import {OrderInfoType} from "@/components/checkout/YmPaymentModal";


export default function ShowKeyInfo(props: {
  info?: OrderInfoType
}) {
  const info = props.info;
  if (!info) {
    return <></>;
  }
  const copyToClipboard = () => {
    if (info.cdk) {
      navigator.clipboard.writeText(info.cdk)
          .then(() => {
            // 可以在这里添加复制成功的提示
          }).catch(err => {
        console.error('复制失败:', err);
      });
    }
  };

  const time = moment(info.expired_at).format("YYYY-MM-DD HH:mm:ss")

  const relativeTime = moment.duration(moment(info.expired_at).diff(moment())).humanize()

  const t = useTranslations("ShowKey");
  return <>
    <div className="text-center mb-6">
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
          <CheckCircle className="h-12 w-12 text-green-600"/>
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
            onClick={copyToClipboard}
        >
          {t("copy")}
        </button>
      </div>
      {info.expired_at && (
          <>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t.rich("expireAt", {time})}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t.rich("timeLeft", {relativeTime})}
            </span>
          </>
      )}
    </div>
  </>;
}