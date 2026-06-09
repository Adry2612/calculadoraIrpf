"use client";

import Link from "next/link";
import { RecommendationModal } from "./RecommendationModal";
import { SummaryCard } from "./components/SummaryCard";
import { useSummaryInfo } from "./hooks/useSummaryInfo";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-200/80 py-3 text-sm last:border-b-0">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}

export default function SummaryPage() {
  const {
    t,
    formatDate,
    euroFormatter,
    decimalFormatter,
    payerBreakdown,
    summary,
    recommendation,
    recommendationBreakdown,
    selectedFutureIrpf,
    setSelectedFutureIrpfOverride,
    irpfSimulation,
    recommendationModalKey,
    setDismissedRecommendationKey,
    isRecommendationModalOpen,
  } = useSummaryInfo();

  return (
    <div className="min-h-screen bg-white px-4 py-6 text-gray-900 sm:px-6 sm:py-10 lg:px-10">
      <RecommendationModal
        isOpen={isRecommendationModalOpen}
        recommendedPercentage={recommendation?.recommendedPercentage ?? 0}
        projectedPendingAfterRecommendation={euroFormatter.format(
          recommendation?.projectedPendingAfterRecommendation ?? 0
        )}
        monthlyNetSelected={euroFormatter.format(irpfSimulation?.monthlyNetSelected ?? 0)}
        annualNetSelected={euroFormatter.format(irpfSimulation?.annualNetSelected ?? 0)}
        onClose={() => setDismissedRecommendationKey(recommendationModalKey)}
      />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8">
        <section className="flex flex-col justify-between gap-6 overflow-hidden rounded-4xl bg-neutral-200 p-5 shadow-2xl shadow-gray-300/40 backdrop-blur sm:p-8 lg:flex-row">
          <div className="flex flex-col justify-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              {t("summary.heroTitle")}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-gray-600">
              {t("summary.heroSubtitle")}
            </p>
          </div>

          <div className="flex w-full gap-4 lg:mt-0 lg:w-auto">
            <SummaryCard
              label={t("summary.estimatedFinalResult")}
              value={euroFormatter.format(recommendation?.projectedPendingAfterRecommendation ?? 0)}
            />
          </div>
        </section>

        <div className="flex w-full flex-col gap-4 xl:flex-row">
          <section className="flex w-full flex-col overflow-hidden rounded-4xl border border-gray-200 bg-white/85 shadow-2xl shadow-gray-300/40 backdrop-blur">
            <div className="flex w-full items-center gap-3 border-b border-gray-200 bg-neutral-200 p-4 px-5 text-lg font-bold sm:px-8 sm:text-xl">
              <FontAwesomeIcon icon={faChartLine} />
              {t("summary.currentPayers")}
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-6">
                {payerBreakdown.length === 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                    {t("summary.noPayersToShow")}
                  </div>
                )}

                {payerBreakdown.map((payer) => (
                  <div
                    key={payer.key}
                    className="border-b border-gray-200 pb-5 last:border-b-0 last:pb-0"
                  >
                    <p className="text-xl font-semibold text-gray-900">{payer.name}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {t("summary.period")}: {formatDate(payer.startDate)} -{" "}
                      {formatDate(payer.endDate)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("summary.daysWorked")}: {payer.daysWorked}
                    </p>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="font-medium text-gray-700">
                          {t("summary.annualGrossReported")}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {euroFormatter.format(payer.annualGross)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="font-medium text-gray-700">
                          {t("summary.periodGross")}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {euroFormatter.format(payer.brutoPeriodo)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="font-medium text-gray-700">
                          {t("summary.withheldIrpf")}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {euroFormatter.format(payer.retenidoPeriodo)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-100 px-3 py-2">
                      <span className="text-sm font-semibold text-gray-800">
                        {t("summary.netWorkIncome")}
                      </span>
                      <span className="font-mono text-lg font-semibold text-gray-900">
                        {euroFormatter.format(payer.rendimientoNetoPeriodo)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="flex w-full flex-col overflow-hidden rounded-4xl border border-gray-200 bg-white/85 shadow-2xl shadow-gray-300/40 backdrop-blur">
            <div className="flex w-full items-center gap-3 border-b border-gray-200 bg-neutral-200 p-4 px-5 text-lg font-bold sm:px-8 sm:text-xl">
              <FontAwesomeIcon icon={faChartLine} />
              {t("summary.currentTotals")}
            </div>
            <div className="p-5 sm:p-8">
              <div className="flex w-full flex-col gap-4">
                <div className="flex flex-row items-center justify-between border-b-2 pb-2 border-neutral-100 gap-4">
                  <span className="font-medium text-gray-700"> {t("summary.totalGross")} </span>
                  <span className="font-semibold text-gray-900">
                    {euroFormatter.format(summary.totalBruto)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-gray-700"> {t("summary.totalNetIncome")} </span>
                  <span className="font-semibold text-gray-900">
                    {euroFormatter.format(summary.totalRendimientoNeto)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-gray-700">{t("summary.withheldIrpf")}</span>
                  <span className="font-semibold text-gray-900">
                    {euroFormatter.format(summary.irpfRetenido)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-gray-700"> {t("summary.taxBase")} </span>
                  <span className="font-semibold text-gray-900">
                    {euroFormatter.format(summary.baseLiquidable)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-gray-700"> {t("summary.estimatedQuota")} </span>
                  <span className="font-semibold text-gray-900">
                    {euroFormatter.format(summary.cuotaIrpfEstimada)}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex w-full flex-row items-center justify-between rounded-2xl bg-neutral-200 p-4">
                <span className="font-bold text-gray-700"> {t("summary.currentPending")} </span>
                <span className="text-2xl text-gray-900">
                  {euroFormatter.format(summary.irpfPendiente)}
                </span>
              </div>
            </div>
          </section>
        </div>

        <section className="flex flex-col overflow-hidden rounded-4xl border border-gray-200 bg-white/85 shadow-2xl shadow-gray-300/40 backdrop-blur">
          <div className="flex w-full items-center gap-3 border-b border-gray-200 bg-neutral-200 p-4 px-5 text-lg font-bold sm:px-8 sm:text-xl">
            <FontAwesomeIcon icon={faChartLine} />
            {t("summary.futureProjection")}
          </div>

          <div className="p-5 sm:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <div className="flex items-center justify-between gap-4 py-1">
                  <span className="font-medium text-gray-700 max-w-1/2">
                    {t("summary.futurePeriodGross")}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {euroFormatter.format(recommendation?.futureGrossForPeriod ?? 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-1">
                  <span className="font-medium text-gray-700 max-w-2/3">
                    {t("summary.newPayerAnnualGross")}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {euroFormatter.format(recommendationBreakdown?.futureAnnualGross ?? 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-1">
                  <span className="font-medium text-gray-700">
                    {t("summary.newPayerAnnualWithholding")}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {euroFormatter.format(
                      recommendationBreakdown?.annualWithheldWithRecommendation ?? 0
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-1">
                  <span className="font-medium text-gray-700">
                    {t("summary.newPayerMonthlyNet", {
                      payPeriods: recommendationBreakdown?.payPeriods ?? 12,
                    })}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {euroFormatter.format(recommendationBreakdown?.monthlyNetApprox ?? 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-1">
                  <span className="font-medium text-gray-700">
                    {" "}
                    {t("summary.projectedEstimatedQuota")}{" "}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {euroFormatter.format(recommendation?.projectedSummary.cuotaIrpfEstimada ?? 0)}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between gap-4 py-1">
                  <span className="font-medium text-gray-700">
                    {" "}
                    {t("summary.recommendedFutureWithholding")}{" "}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {recommendation ? `${recommendation.recommendedPercentage}%` : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-1">
                  <span className="font-medium text-gray-700">
                    {" "}
                    {t("summary.newPayerAnnualSocialSecurity")}{" "}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {euroFormatter.format(
                      recommendationBreakdown?.annualSocialSecurityEstimated ?? 0
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-1">
                  <span className="font-medium text-gray-700">
                    {t("summary.newPayerAnnualNet")}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {euroFormatter.format(recommendationBreakdown?.annualNetApprox ?? 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-1">
                  <span className="font-medium text-gray-700">
                    {" "}
                    {t("summary.projectedWithheldTotal")}{" "}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {euroFormatter.format(recommendationBreakdown?.totalWithheldProjected ?? 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-1">
                  <span className="font-medium text-gray-700">
                    {t("summary.projectedPendingRecalculated")}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {euroFormatter.format(recommendationBreakdown?.pendingWithRecommendation ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid w-full gap-4 rounded-2xl bg-neutral-200 p-4 lg:grid-cols-3">
              <div className="flex flex-col items-start justify-between">
                <span className="font-medium text-gray-700">
                  {t("summary.selectorFutureWithholding", {
                    percentage: selectedFutureIrpf,
                  })}
                </span>
                <span className="text-2xl text-gray-900">
                  {euroFormatter.format(irpfSimulation?.futureWithheldSelected ?? 0)}
                </span>
              </div>
              <div className="flex flex-col items-start justify-between">
                <span className="font-medium text-gray-700">
                  {" "}
                  {t("summary.selectorWithheldTotal")}{" "}
                </span>
                <span className="text-2xl text-gray-900">
                  {euroFormatter.format(irpfSimulation?.totalWithheldSelected ?? 0)}
                </span>
              </div>
              <div className="flex flex-col items-start justify-between">
                <span className="font-medium text-gray-700">
                  {" "}
                  {t("summary.selectorTreasuryResult")}{" "}
                </span>
                <span className="text-2xl text-gray-900">
                  {irpfSimulation
                    ? irpfSimulation.haciendaResult >= 0
                      ? t("summary.refundOf", {
                          amount: euroFormatter.format(irpfSimulation.haciendaResult),
                        })
                      : t("summary.toPay", {
                          amount: euroFormatter.format(Math.abs(irpfSimulation.haciendaResult)),
                        })
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {recommendation && (
          <section className="grid gap-4 rounded-4xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 shadow-xl shadow-emerald-100 sm:p-8 md:grid-cols-[1.4fr_0.6fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                {t("summary.recommendationTag")}
              </p>
              <h2 className="mt-3 text-2xl font-semibold">{t("summary.recommendationTitle")}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-900/80">
                {t("summary.recommendationText", {
                  percentage: recommendation.recommendedPercentage,
                })}
              </p>
              <p className="mt-3 text-sm text-emerald-900/70">
                {t("summary.projectedPendingAfterRecommendation")}
                <span className="ml-1 font-semibold">
                  {euroFormatter.format(recommendation.projectedPendingAfterRecommendation)}
                </span>
              </p>

              {irpfSimulation && (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-white/70 p-4">
                  <details>
                    <summary className="cursor-pointer text-sm font-semibold text-emerald-900">
                      {t("summary.futureIrpfSimulator")}
                    </summary>
                    <div className="mt-3 flex flex-col gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedFutureIrpfOverride(
                              Math.max(0, Number((selectedFutureIrpf - 1).toFixed(1)))
                            )
                          }
                          className="rounded-lg border border-emerald-200 bg-white px-3 py-1 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
                          aria-label={t("summary.decreaseIrpfAria")}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={0.1}
                          value={selectedFutureIrpf}
                          onChange={(event) => {
                            const value = Number(event.target.value);
                            if (Number.isNaN(value)) {
                              return;
                            }
                            setSelectedFutureIrpfOverride(Math.min(100, Math.max(0, value)));
                          }}
                          className="w-24 rounded-lg border border-emerald-200 bg-white px-2 py-1 text-right text-sm"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedFutureIrpfOverride(
                              Math.min(100, Number((selectedFutureIrpf + 1).toFixed(1)))
                            )
                          }
                          className="rounded-lg border border-emerald-200 bg-white px-3 py-1 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
                          aria-label={t("summary.increaseIrpfAria")}
                        >
                          +
                        </button>
                        <span className="text-sm font-semibold">%</span>
                      </div>

                      <p className="text-sm text-emerald-900/80">
                        {t("summary.treasuryResultWith", { percentage: selectedFutureIrpf })}
                        <span className="ml-1 font-semibold">
                          {irpfSimulation.haciendaResult >= 0
                            ? t("summary.refundOf", {
                                amount: euroFormatter.format(irpfSimulation.haciendaResult),
                              })
                            : t("summary.toPay", {
                                amount: euroFormatter.format(
                                  Math.abs(irpfSimulation.haciendaResult)
                                ),
                              })}
                        </span>
                      </p>
                      <p className="text-sm text-emerald-900/80">
                        {t("summary.annualNetApprox")}{" "}
                        <span className="font-semibold">
                          {euroFormatter.format(irpfSimulation.annualNetSelected)}
                        </span>
                      </p>
                      <p className="text-sm text-emerald-900/80">
                        {t("summary.monthlyNetApprox", { payPeriods: irpfSimulation.payPeriods })}
                        <span className="ml-1 font-semibold">
                          {euroFormatter.format(irpfSimulation.monthlyNetSelected)}
                        </span>
                      </p>
                    </div>
                  </details>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between rounded-3xl bg-white/70 p-6">
              <p className="text-sm text-emerald-900/70">
                {t("summary.recommendedForFutureEmployment")}
              </p>
              <p className="mt-2 text-3xl font-semibold">{recommendation.recommendedPercentage}%</p>
              {recommendationBreakdown && (
                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-sm text-emerald-900/80">
                    {t("summary.annualNetApprox")}{" "}
                    <span className="font-semibold">
                      {euroFormatter.format(recommendationBreakdown.annualNetApprox)}
                    </span>
                  </p>
                  <p className="text-sm text-emerald-900/80">
                    {t("summary.monthlyNetApprox", {
                      payPeriods: recommendationBreakdown.payPeriods,
                    })}{" "}
                    <span className="font-semibold">
                      {euroFormatter.format(recommendationBreakdown.monthlyNetApprox)}
                    </span>
                  </p>
                </div>
              )}
              <p className="mt-6 text-sm text-emerald-900/70">
                {t("summary.recommendationNotice")}
              </p>
            </div>
          </section>
        )}

        <section className="rounded-4xl border border-gray-200 bg-white p-5 shadow-xl shadow-gray-200/60 sm:p-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500">
              {t("summary.breakdownTag")}
            </p>
            <h2 className="text-2xl font-semibold text-gray-900">{t("summary.breakdownTitle")}</h2>
            <p className="text-sm text-gray-600">{t("summary.breakdownSubtitle")}</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm font-semibold text-gray-800">
                {t("summary.currentPayersDetail")}
              </p>
              <div className="mt-2">
                {payerBreakdown.length === 0 && (
                  <DetailRow label={t("summary.noPayers")} value="-" />
                )}
                {payerBreakdown.map((payer) => (
                  <div key={payer.key} className="border-b border-gray-200/80 py-3 last:border-b-0">
                    <p className="text-sm font-semibold text-gray-800">{payer.name}</p>
                    <div className="mt-2 flex flex-col gap-1 text-xs text-gray-700">
                      <span>
                        {t("summary.period")}: {formatDate(payer.startDate)} -{" "}
                        {formatDate(payer.endDate)}
                      </span>
                      <span>
                        {t("summary.daysWorked")}: {payer.daysWorked}
                      </span>
                      <span>
                        {t("summary.annualGrossReported")}:{" "}
                        {euroFormatter.format(payer.annualGross)}
                      </span>
                      <span>
                        {t("summary.dailyGross")}: {euroFormatter.format(payer.grossDaily)}
                      </span>
                      <span>
                        {t("summary.periodGross")}: {euroFormatter.format(payer.brutoPeriodo)}
                        {payer.payPeriods === 14 && !payer.extraPaymentsProrated
                          ? ` (${t("summary.periodGrossFormulaBase", {
                              daily: decimalFormatter.format(payer.grossDaily),
                              days: payer.daysWorked,
                            })}${
                              payer.extraPaymentCount > 0
                                ? ` + ${t("summary.periodGrossFormulaExtra", {
                                    count: payer.extraPaymentCount,
                                    month1: payer.extraPaymentMonths[0],
                                    month2: payer.extraPaymentMonths[1],
                                  })}`
                                : ""
                            })`
                          : ` (${t("summary.periodGrossFormulaBase", {
                              daily: decimalFormatter.format(payer.grossDaily),
                              days: payer.daysWorked,
                            })})`}
                      </span>
                      <span>
                        {t("summary.withheldIrpf")}: {euroFormatter.format(payer.retenidoPeriodo)}
                        {` (${t("summary.overPeriodGross", {
                          percentage: payer.irpfPercentage,
                        })})`}
                      </span>
                      <span>
                        {t("summary.socialSecurity")}:{" "}
                        {euroFormatter.format(payer.socialSecurityPeriodo)}
                        {` (${t("summary.overPeriodGross", {
                          percentage: payer.socialSecurityPercentage,
                        })})`}
                      </span>
                      <span>
                        {t("summary.otherDeductions")}:{" "}
                        {euroFormatter.format(payer.otherDeductionsPeriodo)}
                      </span>
                      <span>
                        {t("summary.netWorkIncome")}:{" "}
                        {euroFormatter.format(payer.rendimientoNetoPeriodo)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm font-semibold text-gray-800">{t("summary.currentTotals")}</p>
              <div className="mt-2">
                <DetailRow
                  label={t("summary.totalGross")}
                  value={euroFormatter.format(summary.totalBruto)}
                />
                <DetailRow
                  label={t("summary.totalNetIncome")}
                  value={euroFormatter.format(summary.totalRendimientoNeto)}
                />
                <DetailRow
                  label={t("summary.withheldIrpf")}
                  value={euroFormatter.format(summary.irpfRetenido)}
                />
                <DetailRow
                  label={t("summary.taxBase")}
                  value={euroFormatter.format(summary.baseLiquidable)}
                />
                <DetailRow
                  label={t("summary.estimatedQuota")}
                  value={euroFormatter.format(summary.cuotaIrpfEstimada)}
                />
                <DetailRow
                  label={t("summary.currentPending")}
                  value={euroFormatter.format(summary.irpfPendiente)}
                />
              </div>
            </div>
          </div>

          {recommendation && recommendationBreakdown && (
            <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm font-semibold text-emerald-900">
                {t("summary.futureProjection")}
              </p>
              <div className="mt-2">
                <DetailRow
                  label={t("summary.futurePeriodGross")}
                  value={euroFormatter.format(recommendation.futureGrossForPeriod)}
                />
                <DetailRow
                  label={t("summary.recommendedFutureWithholding")}
                  value={`${recommendation.recommendedPercentage}% (${euroFormatter.format(recommendationBreakdown.futureWithheldWithRecommendation)})`}
                />
                <DetailRow
                  label={t("summary.newPayerAnnualGross")}
                  value={euroFormatter.format(recommendationBreakdown.futureAnnualGross)}
                />
                <DetailRow
                  label={t("summary.newPayerAnnualSocialSecurity")}
                  value={euroFormatter.format(
                    recommendationBreakdown.annualSocialSecurityEstimated
                  )}
                />
                <DetailRow
                  label={t("summary.newPayerAnnualWithholding")}
                  value={euroFormatter.format(
                    recommendationBreakdown.annualWithheldWithRecommendation
                  )}
                />
                <DetailRow
                  label={t("summary.newPayerAnnualNet")}
                  value={euroFormatter.format(recommendationBreakdown.annualNetApprox)}
                />
                <DetailRow
                  label={t("summary.newPayerMonthlyNet", {
                    payPeriods: recommendationBreakdown.payPeriods,
                  })}
                  value={euroFormatter.format(recommendationBreakdown.monthlyNetApprox)}
                />
                <DetailRow
                  label={t("summary.projectedWithheldTotal")}
                  value={euroFormatter.format(recommendationBreakdown.totalWithheldProjected)}
                />
                <DetailRow
                  label={t("summary.projectedEstimatedQuota")}
                  value={euroFormatter.format(recommendation.projectedSummary.cuotaIrpfEstimada)}
                />
                <DetailRow
                  label={t("summary.projectedPendingRecalculated")}
                  value={euroFormatter.format(recommendationBreakdown.pendingWithRecommendation)}
                />
                <DetailRow
                  label={t("summary.projectedPendingFunction")}
                  value={euroFormatter.format(recommendation.projectedPendingAfterRecommendation)}
                />
                {irpfSimulation && (
                  <>
                    <DetailRow
                      label={t("summary.selectorFutureWithholding", {
                        percentage: selectedFutureIrpf,
                      })}
                      value={euroFormatter.format(irpfSimulation.futureWithheldSelected)}
                    />
                    <DetailRow
                      label={t("summary.selectorWithheldTotal")}
                      value={euroFormatter.format(irpfSimulation.totalWithheldSelected)}
                    />
                    <DetailRow
                      label={t("summary.selectorTreasuryResult")}
                      value={
                        irpfSimulation.haciendaResult >= 0
                          ? t("summary.refundOf", {
                              amount: euroFormatter.format(irpfSimulation.haciendaResult),
                            })
                          : t("summary.toPay", {
                              amount: euroFormatter.format(Math.abs(irpfSimulation.haciendaResult)),
                            })
                      }
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-4 rounded-4xl border border-gray-200 bg-gray-950 p-5 text-white shadow-2xl shadow-gray-400/30 sm:p-8 md:grid-cols-[1.4fr_0.6fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
              {t("summary.quickReadTag")}
            </p>
            <h2 className="mt-3 text-2xl font-semibold">{t("summary.quickReadTitle")}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              {t("summary.quickReadText")}
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-3xl bg-white/10 p-6">
            <p className="text-sm text-gray-300">{t("summary.taxBase")}</p>
            <p className="mt-2 text-3xl font-semibold">
              {euroFormatter.format(summary.baseLiquidable)}
            </p>
            <p className="mt-6 text-sm text-gray-300">{t("summary.taxBaseCardText")}</p>
          </div>
        </section>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <Link
            href="/stepper"
            className="rounded-full border border-gray-300 bg-white px-6 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-100"
          >
            {t("summary.backToStepper")}
          </Link>
          <p className="text-sm text-gray-600">{t("summary.sessionNotice")}</p>
        </div>
      </main>
    </div>
  );
}
