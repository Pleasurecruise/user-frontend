import { BackgroundBeamsWithCollision } from "@/components/BackgroundBeamsWithCollision"
import { FlipWords } from "@/components/FlipWord"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import PlanCard from "./plan-card"
// import { CheckIcon } from '@heroicons/react/20/solid'

type Plan = {
  name: string
  price: string
  planId: string
  skuId: string
  mostPopular: boolean
}

export default function GetStart() {
  const t = useTranslations('GetStart')

  const plans: Plan[] = [
    // {
    //   name: 'Mirror酱日卡',
    //   price: '￥3.9',
    //   planId: '83f9d3b8cac611ef8fc352540025c377',
    //   mostPopular: false,
    // },
    {
      name: 'Mirror酱月卡',
      price: '￥6.9',
      planId: '3134f94ac9aa11ef9d725254001e7c00',
      skuId: '08116372d33811efb26052540025c377',
      mostPopular: false,
    },
    {
      name: 'Mirror酱季卡',
      price: '￥12.9',
      planId: '9e6c7b28c9aa11efb47452540025c377',
      skuId: '9e76e3f6c9aa11efa91452540025c377',
      mostPopular: false,
    },
    {
      name: 'Mirror酱年卡',
      price: '￥29.9',
      planId: '69c45576c9aa11ef9ace52540025c377',
      skuId: '603d0bfad33811efb36452540025c377',
      mostPopular: true,
    },
  ]

  const customOrderId = Date.now() + Math.random().toString(36).slice(2)

  return (
    <BackgroundBeamsWithCollision className="min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="px-6 py-12 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl text-gray-900 dark:text-white">
              {t('title')}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg/8 text-gray-600">
            {t.rich('description', {
                br: () => <br />
              })}
            </p>
          </div>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-3 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:max-w-6xl self-center">
          {plans.map((plan) => (
            <PlanCard key={plan.planId} plan={plan} customOrderId={customOrderId} />
          ))}
        </div>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/get-key"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t('getKey')}
          </Link>
          <Link
            href="/transfer"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {t('transfer')}
            </Link>
          <a href="https://github.com/MirrorChyan/docs" target="_blank" className="text-sm/6 font-semibold">
            {t('apiDoc')}<span aria-hidden="true">&nbsp;→</span>
          </a>
          <a href="https://github.com/MirrorChyan/user-frontend" target="_blank" className="text-sm/6 font-semibold">
            {t('openSource')}<span aria-hidden="true">&nbsp;</span>
          </a>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  )
}
