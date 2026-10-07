"use client";

import { useEffect } from "react";
import { useI18n } from "../i18n/useI18n";
import type { Locale } from "../i18n/translations";

const LOCALES: Array<{ value: Locale; label: string }> = [
  { value: "es", label: "ES" },
  { value: "ca", label: "CA" },
  { value: "gl", label: "GL" },
  { value: "eu", label: "EU" },
  { value: "oc", label: "OC" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  useEffect(() => {
    const saved = window.localStorage.getItem("locale") as Locale | null;
    if (saved && LOCALES.some((item) => item.value === saved) && saved !== locale) {
      setLocale(saved);
    }
  }, [locale, setLocale]);

  return (
    <div className="rounded-md border border-slate-200 bg-white p-0.5">
      <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto">
        {LOCALES.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => {
              setLocale(item.value);
              window.localStorage.setItem("locale", item.value);
            }}
            className={`shrink-0 rounded px-1.5 py-1 text-[10px] font-semibold transition-colors sm:px-2 sm:text-xs ${
              locale === item.value
                ? "bg-[#20394d] text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            aria-label={`Cambiar idioma a ${item.label}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
