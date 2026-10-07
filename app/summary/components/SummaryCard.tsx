"use client";

import {
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useI18n } from "../../i18n/useI18n";

type SummaryCardProps = {
  label: string;
  value: string;
  accent?: boolean;
};

export function SummaryCard({ label, value, accent = false }: SummaryCardProps) {
  const { t } = useI18n();
  const numericValue = Number.parseFloat(value.replace(/[^0-9,.-]/g, "").replace(",", "."));
  const isRefund = !Number.isNaN(numericValue) && numericValue < 0;
  const isBalanced = !Number.isNaN(numericValue) && numericValue === 0;

  return (
    <div
      className={`flex w-full flex-col justify-between gap-5 rounded-2xl border p-5 sm:flex-row sm:items-center sm:p-7 ${accent ? "border-slate-700 bg-[#20394d] text-white" : "border-slate-200 bg-white text-slate-900"}`}
    >
      <div className="flex flex-col items-start gap-3">
        <p className={`text-sm font-medium ${accent ? "text-slate-300" : "text-slate-600"}`}>
          {label}
        </p>
        <div
          className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold ${
            isBalanced
              ? "bg-slate-200 text-slate-700"
              : isRefund
                ? "bg-emerald-100 text-emerald-900"
                : "bg-rose-100 text-rose-900"
          }`}
        >
          {isBalanced ? (
            <FontAwesomeIcon icon={faCircleInfo} />
          ) : isRefund ? (
            <FontAwesomeIcon icon={faCircleCheck} />
          ) : (
            <FontAwesomeIcon icon={faCircleExclamation} />
          )}
          <span>
            {isBalanced
              ? t("summary.balancedResult")
              : isRefund
                ? t("summary.toRefund")
                : t("summary.toSettle")}
          </span>
        </div>
      </div>
      <p className="text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">{value}</p>
    </div>
  );
}
