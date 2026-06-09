"use client";

import { faCircleCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
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

  return (
    <div
      className={`flex flex-col items-end rounded-3xl border p-5 shadow-sm sm:p-6 ${accent ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white"}`}
    >
      <p className={`text-sm font-medium ${accent ? "text-gray-300" : "text-gray-500"}`}>{label}</p>
      <p className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{value}</p>
      <div
        className={`mt-4 inline-flex items-center gap-2 rounded-lg p-2 px-3 text-xs font-bold uppercase ${isRefund ? "bg-green-100 text-green-800" : "bg-red-200 text-red-800"}`}
      >
        {isRefund ? (
          <FontAwesomeIcon icon={faCircleCheck} />
        ) : (
          <FontAwesomeIcon icon={faCircleExclamation} />
        )}

        <span>{isRefund ? t("summary.toRefund") : t("summary.toSettle")}</span>
      </div>
    </div>
  );
}
