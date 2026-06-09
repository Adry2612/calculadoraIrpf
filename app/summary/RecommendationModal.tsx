"use client";

import { useI18n } from "../i18n/useI18n";

type RecommendationModalProps = {
  isOpen: boolean;
  recommendedPercentage: number;
  projectedPendingAfterRecommendation: string;
  monthlyNetSelected: string;
  annualNetSelected: string;
  onClose: () => void;
};

export function RecommendationModal({
  isOpen,
  recommendedPercentage,
  projectedPendingAfterRecommendation,
  monthlyNetSelected,
  annualNetSelected,
  onClose,
}: RecommendationModalProps) {
  const { t } = useI18n();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 sm:px-6 sm:py-10">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col items-center justify-center overflow-y-auto rounded-4xl border border-gray-200 bg-neutral-200 p-5 shadow-2xl shadow-gray-900/20 backdrop-blur sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-100"
        >
          {t("summary.modalClose")}
        </button>

        <div className="mt-8 flex flex-col items-center gap-3 sm:mt-0">
          <h1 className="text-center text-3xl font-bold tracking-tight sm:text-5xl">
            {t("summary.modalTitle")}
          </h1>
          <p className="max-w-2xl text-center text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
            {t("summary.modalSubtitle")}
          </p>
        </div>
        <div className="mt-6 flex w-full items-center justify-center rounded-lg bg-white p-4 sm:mt-8 sm:w-3/4">
          <div className="flex flex-col items-center justify-center">
            <p className="mb-2 text-sm uppercase text-gray-500">
              {t("summary.modalRecommendedPercentage")}
            </p>
            <p className="text-5xl font-bold sm:text-7xl"> {recommendedPercentage}% </p>
          </div>
        </div>
        <div className="mt-6 grid w-full gap-3 sm:mt-8 sm:w-3/4 sm:grid-cols-3 sm:gap-6">
          <div className="flex flex-col items-start justify-start rounded-lg bg-neutral-100 p-4 sm:p-5">
            <p className="mb-2 text-sm uppercase text-gray-500">
              {t("summary.modalEstimatedRefund")}
            </p>
            <span className="font-semibold">{projectedPendingAfterRecommendation}</span>
          </div>
          <div className="flex flex-col items-start justify-start rounded-lg bg-neutral-100 p-4 sm:p-5">
            <p className="mb-2 text-sm uppercase text-gray-500">{t("summary.modalMonthlyNet")}</p>
            <span className="font-semibold">{monthlyNetSelected}</span>
          </div>
          <div className="flex flex-col items-start justify-start rounded-lg bg-neutral-100 p-4 sm:p-5">
            <p className="mb-2 text-sm uppercase text-gray-500">{t("summary.modalAnnualNet")}</p>
            <span className="font-semibold">{annualNetSelected}</span>
          </div>
        </div>
        <span className="mt-6 text-center text-xs text-gray-600 sm:text-sm">
          {t("summary.modalDisclaimer")}
        </span>
      </div>
    </div>
  );
}
