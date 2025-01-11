import { BackgroundLines } from "@/components/BackgroundLines"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export default function GetStart() {
  const t = useTranslations('GetStart')
  return (
    <BackgroundLines>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              {t('title')}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg/8 text-gray-600">
              {t('description')}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/get-key"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {t('getStart')}
              </Link>
              {/* <a href="#" className="text-sm/6 font-semibold">
                {t('readDoc')}<span aria-hidden="true">&nbsp;→</span>
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </BackgroundLines>
  )
}
