import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

export default async function Home() {
  const locale = await getLocale();
  redirect({ href: "/get-start", locale });
}
