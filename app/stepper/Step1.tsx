"use client";

import { AUTONOMOUS_COMMUNITIES, CIVIL_STATUS_OPTIONS } from "./step1.data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faChevronDown,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { useCalculadoraStore } from "../store/useCalculadoraStore";
import { useI18n } from "../i18n/useI18n";

type Step1Props = {
  onNext: () => void;
};

export function Step1({ onNext }: Step1Props) {
  const datosPersonales = useCalculadoraStore((state) => state.datosPersonales);
  const updatePersonalInfo = useCalculadoraStore((state) => state.updatePersonalInfo);
  const { t } = useI18n();
  const fieldClass =
    "w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300";
  const retentionOptions = [
    { value: "devolucion-segura", label: t("step1.retentionSafeRefund") },
    { value: "blindado", label: t("step1.retentionShielded") },
    { value: "ajustado", label: t("step1.retentionAdjusted") },
  ] as const;
  const retentionInfoByOption: Record<
    "devolucion-segura" | "blindado" | "ajustado",
    string
  > = {
    "devolucion-segura": t("step1.retentionSafeRefundInfo"),
    blindado: t("step1.retentionShieldedInfo"),
    ajustado: t("step1.retentionAdjustedInfo"),
  };

  const handleDecreaseChildren = () => {
    updatePersonalInfo({ childrenCount: Math.max(0, datosPersonales.childrenCount - 1) });
  };

  const handleIncreaseChildren = () => {
    updatePersonalInfo({ childrenCount: datosPersonales.childrenCount + 1 });
  };

  return (
    <div className="flex flex-col w-full max-w-4xl p-8">
      <h1 className="text-3xl mb-3 text-start text-gray-800 font-bold dark:text-gray-300">
        {" "}
        {t("step1.title")}
      </h1>
      <h2 className="text-sm text-start text-gray-500 dark:text-gray-300 mb-8">
        {t("step1.subtitle")}
      </h2>

      <form className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold"> {t("step1.autonomousCommunity")} </label>
            <div className="relative">
              <select
                className={`${fieldClass} pr-12 appearance-none`}
                value={datosPersonales.region}
                onChange={(event) => updatePersonalInfo({ region: event.target.value })}
              >
                <option value="">{t("step1.selectPlaceholder")}</option>
                {AUTONOMOUS_COMMUNITIES.map((community) => (
                  <option key={community.value} value={community.value}>
                    {t(`catalogs.autonomousCommunities.${community.value}`)}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500 dark:text-gray-400">
                <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold"> {t("step1.civilStatus")} </label>
            <div className="relative">
              <select
                className={`${fieldClass} pr-12 appearance-none`}
                value={datosPersonales.civilStatus}
                onChange={(event) => updatePersonalInfo({ civilStatus: event.target.value })}
              >
                <option value="">{t("step1.selectPlaceholder")}</option>
                {CIVIL_STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {t(`catalogs.civilStatus.${status.value}`)}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500 dark:text-gray-400">
                <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold"> {t("step1.birthYear")} </label>
            <input
              className={fieldClass}
              type="number"
              placeholder="YYYY"
              value={datosPersonales.birthYear}
              onChange={(event) =>
                updatePersonalInfo({
                  birthYear: Number.parseInt(event.target.value, 10) || new Date().getFullYear(),
                })
              }
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold"> {t("step1.childrenOrDependents")} </label>
            <div className="relative">
              <button
                type="button"
                onClick={handleDecreaseChildren}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-lg text-gray-800 dark:text-gray-300"
                aria-label={t("step1.decreaseChildrenAria")}
              >
                -
              </button>
              <input
                className={`${fieldClass} pl-14 pr-14 text-center`}
                type="number"
                min={0}
                value={datosPersonales.childrenCount}
                readOnly
              />
              <button
                type="button"
                onClick={handleIncreaseChildren}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-lg text-gray-800 dark:text-gray-300"
                aria-label={t("step1.increaseChildrenAria")}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/70">
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {t("step1.disabilityTitle")}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("step1.disabilitySubtitle")}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={datosPersonales.discapacidad}
                aria-label={t("step1.disabilitySwitchAria")}
                onClick={() => updatePersonalInfo({ discapacidad: !datosPersonales.discapacidad })}
                className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${
                  datosPersonales.discapacidad ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
                    datosPersonales.discapacidad ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/70">
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {t("step1.ascendantsTitle")}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("step1.ascendantsSubtitle")}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={datosPersonales.ascendientesACargo}
                aria-label={t("step1.ascendantsSwitchAria")}
                onClick={() =>
                  updatePersonalInfo({ ascendientesACargo: !datosPersonales.ascendientesACargo })
                }
                className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${
                  datosPersonales.ascendientesACargo
                    ? "bg-green-500"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
                    datosPersonales.ascendientesACargo ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70">
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {t("step1.retentionModeTitle")}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("step1.retentionModeSubtitle")}
            </p>
          </div>

          <div className="inline-flex w-fit rounded-full border border-gray-300 bg-white p-1 dark:border-gray-600 dark:bg-gray-800">
            {retentionOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updatePersonalInfo({ retentionPreference: option.value })}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  datosPersonales.retentionPreference === option.value
                    ? "bg-gray-800 text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {datosPersonales.retentionPreference && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {retentionInfoByOption[datosPersonales.retentionPreference]}
            </p>
          )}
        </div>
      </form>

      <div className="flex flex-row justify-center items-center bg-gray-100 mt-8 p-4 rounded-lg">
        <FontAwesomeIcon icon={faLock} className="text-gray-500 dark:text-gray-300 mr-6" />
        <h2 className="text-sm text-gray-500 dark:text-gray-300">{t("step1.privacyText")} </h2>
      </div>

      <div className="flex flex-1 items-center justify-between mt-8">
        <button
          type="button"
          className="px-6 py-3 rounded-lg text-gray-800 hover:bg-gray-700 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          {t("step1.back")}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          {t("step1.next")}
          <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
        </button>
      </div>
    </div>
  );
}
