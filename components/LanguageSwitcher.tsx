"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { cx } from '@/lib/cn';

export const LanguageSwitcher = () => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLanguage = () => {
        const nextLocale = locale === 'tr' ? 'en' : 'tr';
        // Remove the current locale from the start of the pathname
        const newPathname = pathname.replace(`/${locale}`, `/${nextLocale}`);
        router.push(newPathname);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="group relative flex h-8 w-14 items-center rounded-full bg-surface/50 p-1 border border-text/10 transition-colors hover:border-text/20 focus:outline-none"
            aria-label="Toggle language"
        >
            <div
                className={cx(
                    "absolute flex h-6 w-6 items-center justify-center rounded-full bg-text text-[10px] font-bold text-black transition-all duration-300 ease-in-out",
                    locale === 'tr' ? "left-1" : "left-7"
                )}
            >
                {locale.toUpperCase()}
            </div>
            <div className="flex w-full justify-between px-2 text-[8px] font-bold uppercase tracking-tighter text-muted group-hover:text-text/60">
                <span className={cx(locale === 'tr' ? "opacity-0" : "opacity-100")}>TR</span>
                <span className={cx(locale === 'en' ? "opacity-0" : "opacity-100")}>EN</span>
            </div>
        </button>
    );
};
