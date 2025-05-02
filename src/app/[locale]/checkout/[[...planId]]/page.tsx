import Checkout from "@/app/[locale]/checkout/Checkout";

export default async function View(params: {
  params: Promise<{ planId: string[] }>
}) {
  const planId = (await params.params).planId
  return <Checkout planId={planId}/>
}