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
    <div className="fixed right-4 top-4 z-50 rounded-full border border-gray-300 bg-white/95 p-1 shadow-md backdrop-blur">
      <div className="inline-flex items-center gap-1">
        {LOCALES.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => {
              setLocale(item.value);
              window.localStorage.setItem("locale", item.value);
            }}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              locale === item.value
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
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
