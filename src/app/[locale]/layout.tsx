import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import _ from 'lodash';

import { routing } from '@/i18n/routing';
import { getAnnouncement } from '@/app/requests/announcement';
import { AnimatedTooltip } from '@/components/AnimatedTooltip';

import { Providers } from './provider';

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "MirrorChyan",
  description: "Next generation of CDN for developers",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'zh' | 'en')) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const announcement = await getAnnouncement(locale as 'zh' | 'en');

  console.log(announcement);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        {announcement.ec === 0 && (
          <div className="announcement sticky top-0 w-screen font-bold underline text-center p-2 text-black dark:bg-gray-800 dark:text-white">
            {announcement.data.summary}
          </div>
        )}
        <Providers>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
