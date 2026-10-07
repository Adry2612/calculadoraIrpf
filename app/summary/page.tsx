"use client";

import Link from "next/link";
import { RecommendationModal } from "./RecommendationModal";
import { SummaryCard } from "./components/SummaryCard";
import { NewCalculationAction } from "./components/NewCalculationAction";
import { useSummaryInfo } from "./hooks/useSummaryInfo";
import { faBriefcase, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 py-3 text-sm last:border-b-0">
      <span className="max-w-[65%] font-medium leading-5 text-slate-600">{label}</span>
      <span className="text-right font-semibold tabular-nums text-slate-900">{value}</span>
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
    <div className="flex-1 bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 sm:py-10 lg:px-10">
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

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:gap-8">
        <header className="sm:pr-60">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {t("summary.headerTag")}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {t("summary.headerTitle")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            {t("summary.headerSubtitle")}
          </p>
        </header>

        <SummaryCard
          label={t("summary.estimatedFinalResult")}
          value={euroFormatter.format(recommendation?.projectedPendingAfterRecommendation ?? 0)}
          accent
        />

        <section
          aria-label={t("summary.currentTotals")}
          className="grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:grid-cols-3 lg:grid-cols-6"
        >
          {[
            { label: t("summary.totalGross"), value: euroFormatter.format(summary.totalBruto) },
            {
              label: t("summary.totalNetIncome"),
              value: euroFormatter.format(summary.totalRendimientoNeto),
            },
            { label: t("summary.withheldIrpf"), value: euroFormatter.format(summary.irpfRetenido) },
            { label: t("summary.taxBase"), value: euroFormatter.format(summary.baseLiquidable) },
            {
              label: t("summary.estimatedQuota"),
              value: euroFormatter.format(summary.cuotaIrpfEstimada),
            },
            {
              label: t("summary.currentPending"),
              value: euroFormatter.format(summary.irpfPendiente),
            },
          ].map((metric, index) => (
            <div
              key={metric.label}
              className={`flex min-h-24 flex-col justify-between gap-3 border-slate-200 p-4 sm:p-5 ${
                index % 2 === 1 ? "border-l" : ""
              } ${index >= 2 ? "border-t sm:border-t-0" : ""} ${
                index >= 3 ? "sm:border-t lg:border-t-0" : ""
              } ${index % 3 !== 0 ? "sm:border-l" : "sm:border-l-0"} ${
                index === 5 ? "bg-slate-50" : ""
              }`}
            >
              <span className="text-xs font-medium leading-4 text-slate-500">{metric.label}</span>
              <span className="text-base font-semibold tabular-nums tracking-tight text-slate-900 sm:text-lg">
                {metric.value}
              </span>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 sm:px-7">
            <span className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-[#315a78]">
              <FontAwesomeIcon className="text-sm" icon={faBriefcase} />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">{t("summary.currentPayers")}</h2>
              <p className="mt-0.5 text-xs text-slate-500">{t("summary.currentPayersDetail")}</p>
            </div>
          </div>
          <div className="grid gap-0 divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0">
            {payerBreakdown.length === 0 && (
              <div className="flex min-h-36 items-center px-5 py-8 text-sm text-slate-500 sm:px-7">
                {t("summary.noPayersToShow")}
              </div>
            )}
            {payerBreakdown.map((payer) => (
              <article key={payer.key} className="p-5 sm:p-7">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                      {payer.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatDate(payer.startDate)} - {formatDate(payer.endDate)}
                    </p>
                  </div>
                  <p className="text-sm text-slate-500">
                    {t("summary.daysWorked")}:{" "}
                    <span className="font-medium tabular-nums text-slate-700">
                      {payer.daysWorked}
                    </span>
                  </p>
                </div>
                <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4">
                  <div>
                    <dt className="text-xs text-slate-500">{t("summary.annualGrossReported")}</dt>
                    <dd className="mt-1 text-sm font-semibold tabular-nums text-slate-900">
                      {euroFormatter.format(payer.annualGross)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">{t("summary.periodGross")}</dt>
                    <dd className="mt-1 text-sm font-semibold tabular-nums text-slate-900">
                      {euroFormatter.format(payer.brutoPeriodo)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">{t("summary.withheldIrpf")}</dt>
                    <dd className="mt-1 text-sm font-semibold tabular-nums text-slate-900">
                      {euroFormatter.format(payer.retenidoPeriodo)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">{t("summary.netWorkIncome")}</dt>
                    <dd className="mt-1 text-sm font-semibold tabular-nums text-slate-900">
                      {euroFormatter.format(payer.rendimientoNetoPeriodo)}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 sm:px-7">
            <span className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-[#315a78]">
              <FontAwesomeIcon className="text-sm" icon={faChartLine} />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">{t("summary.futureProjection")}</h2>
              {recommendation && recommendationBreakdown && (
                <p className="mt-0.5 text-xs text-slate-500">{t("summary.recommendationNotice")}</p>
              )}
            </div>
          </div>
          {recommendation && recommendationBreakdown ? (
            <div className="p-5 sm:p-7">
              <div className="grid gap-x-10 md:grid-cols-2">
                <div>
                  <DetailRow
                    label={t("summary.futurePeriodGross")}
                    value={euroFormatter.format(recommendation?.futureGrossForPeriod ?? 0)}
                  />
                  <DetailRow
                    label={t("summary.newPayerAnnualGross")}
                    value={euroFormatter.format(recommendationBreakdown?.futureAnnualGross ?? 0)}
                  />
                  <DetailRow
                    label={t("summary.newPayerAnnualWithholding")}
                    value={euroFormatter.format(
                      recommendationBreakdown?.annualWithheldWithRecommendation ?? 0
                    )}
                  />
                  <DetailRow
                    label={t("summary.newPayerMonthlyNet", {
                      payPeriods: recommendationBreakdown?.payPeriods ?? 12,
                    })}
                    value={euroFormatter.format(recommendationBreakdown?.monthlyNetApprox ?? 0)}
                  />
                  <DetailRow
                    label={t("summary.projectedEstimatedQuota")}
                    value={euroFormatter.format(
                      recommendation?.projectedSummary.cuotaIrpfEstimada ?? 0
                    )}
                  />
                </div>
                <div>
                  <DetailRow
                    label={t("summary.recommendedFutureWithholding")}
                    value={recommendation ? `${recommendation.recommendedPercentage}%` : "-"}
                  />
                  <DetailRow
                    label={t("summary.newPayerAnnualSocialSecurity")}
                    value={euroFormatter.format(
                      recommendationBreakdown?.annualSocialSecurityEstimated ?? 0
                    )}
                  />
                  <DetailRow
                    label={t("summary.newPayerAnnualNet")}
                    value={euroFormatter.format(recommendationBreakdown?.annualNetApprox ?? 0)}
                  />
                  <DetailRow
                    label={t("summary.projectedWithheldTotal")}
                    value={euroFormatter.format(
                      recommendationBreakdown?.totalWithheldProjected ?? 0
                    )}
                  />
                  <DetailRow
                    label={t("summary.projectedPendingRecalculated")}
                    value={euroFormatter.format(
                      recommendationBreakdown?.pendingWithRecommendation ?? 0
                    )}
                  />
                </div>
              </div>
              <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-3 sm:p-5">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium leading-4 text-slate-500">
                    {t("summary.selectorFutureWithholding", {
                      percentage: selectedFutureIrpf,
                    })}
                  </span>
                  <span className="text-lg font-semibold tabular-nums text-slate-900">
                    {euroFormatter.format(irpfSimulation?.futureWithheldSelected ?? 0)}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium leading-4 text-slate-500">
                    {t("summary.selectorWithheldTotal")}
                  </span>
                  <span className="text-lg font-semibold tabular-nums text-slate-900">
                    {euroFormatter.format(irpfSimulation?.totalWithheldSelected ?? 0)}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium leading-4 text-slate-500">
                    {t("summary.selectorTreasuryResult")}
                  </span>
                  <span className="text-lg font-semibold text-slate-900">
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
          ) : (
            <p className="px-5 py-7 text-sm leading-6 text-slate-500 sm:px-7">
              {t("summary.futureProjectionEmpty")}
            </p>
          )}
        </section>

        {recommendation && (
          <section className="grid gap-6 rounded-2xl border border-slate-200 border-l-4 border-l-[#315a78] bg-white p-5 sm:p-7 md:grid-cols-[1.4fr_0.6fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#315a78]">
                {t("summary.recommendationTag")}
              </p>
              <h2 className="mt-3 text-2xl font-semibold">{t("summary.recommendationTitle")}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#405b70]">
                {t("summary.recommendationText", {
                  percentage: recommendation.recommendedPercentage,
                })}
              </p>
              <p className="mt-3 text-sm text-[#405b70]">
                {t("summary.projectedPendingAfterRecommendation")}
                <span className="ml-1 font-semibold">
                  {euroFormatter.format(recommendation.projectedPendingAfterRecommendation)}
                </span>
              </p>

              {irpfSimulation && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <details>
                    <summary className="cursor-pointer text-sm font-semibold text-[#304d65]">
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
                          className="rounded-md border border-[#cbd8e1] bg-white px-3 py-1 text-sm font-semibold text-[#304d65] hover:bg-[#e4edf2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315a78]"
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
                          className="w-24 rounded-md border border-[#cbd8e1] bg-white px-2 py-1 text-right text-sm text-[#202b36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315a78]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedFutureIrpfOverride(
                              Math.min(100, Number((selectedFutureIrpf + 1).toFixed(1)))
                            )
                          }
                          className="rounded-md border border-[#cbd8e1] bg-white px-3 py-1 text-sm font-semibold text-[#304d65] hover:bg-[#e4edf2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315a78]"
                          aria-label={t("summary.increaseIrpfAria")}
                        >
                          +
                        </button>
                        <span className="text-sm font-semibold">%</span>
                      </div>

                      <p className="text-sm text-[#405b70]">
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
                      <p className="text-sm text-[#405b70]">
                        {t("summary.annualNetApprox")}{" "}
                        <span className="font-semibold">
                          {euroFormatter.format(irpfSimulation.annualNetSelected)}
                        </span>
                      </p>
                      <p className="text-sm text-[#405b70]">
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

            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <p className="text-sm text-[#405b70]">
                {t("summary.recommendedForFutureEmployment")}
              </p>
              <p className="mt-2 text-3xl font-semibold">{recommendation.recommendedPercentage}%</p>
              {recommendationBreakdown && (
                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-sm text-[#405b70]">
                    {t("summary.annualNetApprox")}{" "}
                    <span className="font-semibold">
                      {euroFormatter.format(recommendationBreakdown.annualNetApprox)}
                    </span>
                  </p>
                  <p className="text-sm text-[#405b70]">
                    {t("summary.monthlyNetApprox", {
                      payPeriods: recommendationBreakdown.payPeriods,
                    })}{" "}
                    <span className="font-semibold">
                      {euroFormatter.format(recommendationBreakdown.monthlyNetApprox)}
                    </span>
                  </p>
                </div>
              )}
              <p className="mt-6 text-sm text-[#405b70]">{t("summary.recommendationNotice")}</p>
            </div>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <details>
            <summary className="cursor-pointer border-b border-slate-200 px-5 py-5 marker:text-slate-400 sm:px-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {t("summary.breakdownTag")}
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                {t("summary.breakdownTitle")}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                {t("summary.breakdownSubtitle")}
              </p>
            </summary>

            <div className="grid divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="p-5 sm:p-7">
                <h3 className="text-sm font-semibold text-slate-800">
                  {t("summary.currentPayers")}
                </h3>
                <div className="mt-2">
                  {payerBreakdown.length === 0 && (
                    <DetailRow label={t("summary.noPayers")} value="-" />
                  )}
                  {payerBreakdown.map((payer) => (
                    <div
                      key={payer.key}
                      className="border-b border-gray-200/80 py-3 last:border-b-0"
                    >
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

              <div className="p-5 sm:p-7">
                <h3 className="text-sm font-semibold text-slate-800">
                  {t("summary.currentTotals")}
                </h3>
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
              <div className="border-t border-slate-200 bg-slate-50 p-5 sm:p-7">
                <p className="text-sm font-semibold text-[#304d65]">
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
                                amount: euroFormatter.format(
                                  Math.abs(irpfSimulation.haciendaResult)
                                ),
                              })
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </details>
        </section>

        <aside className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-5 sm:px-7">
          <h2 className="text-sm font-semibold text-slate-800">{t("summary.quickReadTitle")}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            {t("summary.quickReadText")}
          </p>
        </aside>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <Link
            href="/stepper"
            className="rounded-lg border border-[#cbd4dc] bg-white px-5 py-3 font-medium text-[#273b4d] transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315a78]"
          >
            {t("summary.backToStepper")}
          </Link>
          <p className="text-sm text-gray-600">{t("summary.sessionNotice")}</p>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-slate-600">{t("summary.savedLocally")}</p>
          <NewCalculationAction />
        </div>
      </main>
    </div>
  );
}
