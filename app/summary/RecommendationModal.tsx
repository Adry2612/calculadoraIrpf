"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 sm:px-6 sm:py-10">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col items-center justify-center overflow-y-auto rounded-2xl border border-[#dbe2e8] bg-[#f3f5f7] p-5 shadow-xl shadow-slate-900/15 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md border border-[#d1dbe3] bg-white px-3 py-2 text-sm font-semibold text-[#304d65] transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315a78]"
        >
          {t("summary.modalClose")}
        </button>

        <div className="mt-8 flex flex-col items-center gap-3 sm:mt-0">
          <h1 className="text-center text-3xl font-semibold tracking-tight text-[#1d3447] sm:text-4xl">
            {t("summary.modalTitle")}
          </h1>
          <p className="max-w-2xl text-center text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            {t("summary.modalSubtitle")}
          </p>
        </div>
        <div className="mt-6 flex w-full items-center justify-center rounded-xl border border-[#d4dee6] bg-white p-4 sm:mt-8 sm:w-3/4">
          <div className="flex flex-col items-center justify-center">
            <p className="mb-2 text-sm font-medium text-slate-600">
              {t("summary.modalRecommendedPercentage")}
            </p>
            <p className="text-4xl font-semibold tabular-nums text-[#1d3447] sm:text-5xl">
              {recommendedPercentage}%
            </p>
          </div>
        </div>
        <div className="mt-6 grid w-full gap-3 sm:mt-8 sm:w-3/4 sm:grid-cols-3 sm:gap-6">
          <div className="flex flex-col items-start justify-start rounded-xl border border-[#dbe2e8] bg-white p-4 sm:p-5">
            <p className="mb-2 text-sm font-medium text-slate-600">
              {t("summary.modalEstimatedRefund")}
            </p>
            <span className="font-semibold">{projectedPendingAfterRecommendation}</span>
          </div>
          <div className="flex flex-col items-start justify-start rounded-xl border border-[#dbe2e8] bg-white p-4 sm:p-5">
            <p className="mb-2 text-sm font-medium text-slate-600">
              {t("summary.modalMonthlyNet")}
            </p>
            <span className="font-semibold">{monthlyNetSelected}</span>
          </div>
          <div className="flex flex-col items-start justify-start rounded-xl border border-[#dbe2e8] bg-white p-4 sm:p-5">
            <p className="mb-2 text-sm font-medium text-slate-600">{t("summary.modalAnnualNet")}</p>
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
