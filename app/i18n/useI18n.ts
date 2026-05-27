"use client";

import { useMemo } from "react";
import { translations, type Locale } from "./translations";
import { useCalculadoraStore } from "../store/useCalculadoraStore";

type Primitive = string | number;

const LOCALE_TO_BCP47: Record<Locale, string> = {
  es: "es-ES",
  ca: "ca-ES",
  gl: "gl-ES",
  eu: "eu-ES",
  oc: "oc-ES",
};

function formatMessage(template: string, vars?: Record<string, Primitive>) {
  if (!vars) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = vars[key];
    return value === undefined ? `{${key}}` : String(value);
  });
}

function getByPath(source: unknown, path: string): string | undefined {
  if (!path) {
    return undefined;
  }

  const parts = path.split(".");
  let current: unknown = source;

  for (const part of parts) {
    if (typeof current !== "object" || current === null || !(part in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : undefined;
}

export function useI18n() {
  const locale = useCalculadoraStore((state) => state.locale);
  const setLocale = useCalculadoraStore((state) => state.setLocale);

  const dictionary = useMemo(() => translations[locale], [locale]);

  const t = (keyPath: string, vars?: Record<string, Primitive>) => {
    const value = getByPath(dictionary, keyPath) ?? getByPath(translations.es, keyPath) ?? keyPath;
    return formatMessage(value, vars);
  };

  return {
    locale,
    localeTag: LOCALE_TO_BCP47[locale],
    setLocale,
    dictionary,
    t,
  };
}
