"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "../i18n/useI18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function AppHeader() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label={t("navigation.home")}>
          <span className="text-sm font-semibold tracking-tight text-slate-900">
            {t("navigation.brand")}
          </span>
        </Link>

        <nav aria-label={t("navigation.label")} className="hidden items-center gap-6 sm:flex">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={`text-sm transition-colors hover:text-[#315a78] ${
              pathname === "/" ? "font-semibold text-slate-900" : "text-slate-600"
            }`}
          >
            {t("navigation.home")}
          </Link>
          <Link
            href="/howWeWork"
            aria-current={pathname === "/howWeWork" ? "page" : undefined}
            className={`text-sm transition-colors hover:text-[#315a78] ${
              pathname === "/howWeWork" ? "font-semibold text-slate-900" : "text-slate-600"
            }`}
          >
            {t("navigation.howItWorks")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
