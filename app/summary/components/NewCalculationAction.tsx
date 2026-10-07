"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "../../i18n/useI18n";
import { useCalculadoraStore } from "../../store/useCalculadoraStore";

export function NewCalculationAction() {
  const [confirming, setConfirming] = useState(false);
  const resetCalculation = useCalculadoraStore((state) => state.resetCalculation);
  const router = useRouter();
  const { t } = useI18n();

  const startNewCalculation = () => {
    resetCalculation();
    router.push("/stepper");
  };

  if (confirming) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-700">{t("summary.confirmNewCalculation")}</p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315a78]"
          >
            {t("summary.cancelNewCalculation")}
          </button>
          <button
            type="button"
            onClick={startNewCalculation}
            className="rounded-md bg-[#20394d] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#315a78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315a78]"
          >
            {t("summary.newCalculation")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="rounded-md bg-[#20394d] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#315a78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315a78]"
    >
      {t("summary.newCalculation")}
    </button>
  );
}
