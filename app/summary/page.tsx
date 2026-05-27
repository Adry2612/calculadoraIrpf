"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useCalculadoraStore } from "../store/useCalculadoraStore";
import {
  DEFAULT_SOCIAL_SECURITY_PERCENTAGE,
  calculateOtherDeductionsForPeriod,
  calculateSocialSecurityForPeriod,
  calculateTotalForPeriod,
  calculateTotalIrpfWithheld,
  getIrpfSummary,
  getNetWorkIncomeForPeriod,
  getRecommendedIrpfPercentageForFuturePayer,
  getTotalGrossAllPayers,
  getTotalIrpfAllPayers,
  getTotalNetWorkIncomeAllPayers,
} from "../store/calculations";

function SummaryCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-6 shadow-sm ${accent ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white"}`}
    >
      <p className={`text-sm font-medium ${accent ? "text-gray-300" : "text-gray-500"}`}>{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-200/80 py-3 text-sm last:border-b-0">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}

const euroFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

const decimalFormatter = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function SummaryPage() {
  const pagadores = useCalculadoraStore((state) => state.pagadores);
  const pagadorFuturo = useCalculadoraStore((state) => state.pagadorFuturo);
  const currentYear = new Date().getFullYear();
  const daysInCurrentYear =
    (currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0 ? 366 : 365;

  const formatDate = (date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleDateString("es-ES");
  };

  const getDaysWorked = useCallback(
    (startDate: string, endDate: string) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const yearStart = new Date(currentYear, 0, 1);
      const yearEnd = new Date(currentYear, 11, 31);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
        return 0;
      }

      const normalizedStart = start > yearStart ? start : yearStart;
      const normalizedEnd = end < yearEnd ? end : yearEnd;
      if (normalizedEnd < normalizedStart) {
        return 0;
      }

      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      return Math.floor((normalizedEnd.getTime() - normalizedStart.getTime()) / millisecondsPerDay) + 1;
    },
    [currentYear]
  );

  const payerBreakdown = useMemo(
    () =>
      pagadores.map((pagador, index) => {
        const daysWorked = getDaysWorked(pagador.startDate, pagador.endDate);
        const grossDaily = pagador.grossSalary / daysInCurrentYear;
        const brutoPeriodo = calculateTotalForPeriod(pagador.startDate, pagador.endDate, pagador.grossSalary);
        const retenidoPeriodo = calculateTotalIrpfWithheld(
          pagador.startDate,
          pagador.endDate,
          pagador.grossSalary,
          pagador.irpfPercentage
        );
        const socialSecurityPeriodo = calculateSocialSecurityForPeriod(
          pagador.startDate,
          pagador.endDate,
          pagador.grossSalary,
          pagador.salaryIncludesSocialSecurity,
          pagador.socialSecurityPercentage
        );
        const otherDeductionsPeriodo = calculateOtherDeductionsForPeriod(
          pagador.startDate,
          pagador.endDate,
          pagador.annualOtherDeductions ?? 0
        );
        const rendimientoNetoPeriodo = getNetWorkIncomeForPeriod(pagador);

        return {
          key: `${pagador.name}-${index}`,
          name: pagador.name || `Pagador ${index + 1}`,
          startDate: pagador.startDate,
          endDate: pagador.endDate,
          annualGross: pagador.grossSalary,
          daysWorked,
          grossDaily,
          brutoPeriodo,
          retenidoPeriodo,
          socialSecurityPeriodo,
          otherDeductionsPeriodo,
          rendimientoNetoPeriodo,
          irpfPercentage: pagador.irpfPercentage,
          socialSecurityPercentage: pagador.socialSecurityPercentage ?? DEFAULT_SOCIAL_SECURITY_PERCENTAGE,
        };
      }),
    [pagadores, daysInCurrentYear, getDaysWorked]
  );

  const summary = useMemo(() => {
    const totalBruto = getTotalGrossAllPayers(pagadores);
    const totalRendimientoNeto = getTotalNetWorkIncomeAllPayers(pagadores);
    const irpfRetenido = getTotalIrpfAllPayers(pagadores);
    return getIrpfSummary(totalBruto, irpfRetenido, 5550, undefined, totalRendimientoNeto);
  }, [pagadores]);

  const recommendation = useMemo(() => {
    if (!pagadorFuturo.startDate || pagadorFuturo.grossSalary <= 0) {
      return null;
    }

    const result = getRecommendedIrpfPercentageForFuturePayer(pagadores, {
      name: pagadorFuturo.name,
      startDate: pagadorFuturo.startDate,
      annualGross: pagadorFuturo.grossSalary,
    });

    if (result.futureGrossForPeriod <= 0) {
      return null;
    }

    return result;
  }, [pagadores, pagadorFuturo]);

  const [selectedFutureIrpfOverride, setSelectedFutureIrpfOverride] = useState<number | null>(null);
  const selectedFutureIrpf = selectedFutureIrpfOverride ?? recommendation?.recommendedPercentage ?? 0;

  const recommendationBreakdown = useMemo(() => {
    if (!recommendation) {
      return null;
    }

    const futureAnnualGross = Number(pagadorFuturo.grossSalary) || 0;
    const payPeriods = pagadorFuturo.payPeriods ?? 12;
    const annualSocialSecurityEstimated = Number(
      (futureAnnualGross * (DEFAULT_SOCIAL_SECURITY_PERCENTAGE / 100)).toFixed(2)
    );

    const futureWithheldWithRecommendation = Number(
      (recommendation.futureGrossForPeriod * (recommendation.recommendedPercentage / 100)).toFixed(2)
    );

    const annualWithheldWithRecommendation = Number(
      (futureAnnualGross * (recommendation.recommendedPercentage / 100)).toFixed(2)
    );
    const annualNetApprox = Number(
      (futureAnnualGross - annualSocialSecurityEstimated - annualWithheldWithRecommendation).toFixed(2)
    );
    const monthlyNetApprox = Number((annualNetApprox / payPeriods).toFixed(2));

    const totalWithheldProjected = Number((summary.irpfRetenido + futureWithheldWithRecommendation).toFixed(2));
    const pendingWithRecommendation = Number(
      (recommendation.projectedSummary.cuotaIrpfEstimada - totalWithheldProjected).toFixed(2)
    );

    return {
      futureAnnualGross,
      futureWithheldWithRecommendation,
      annualWithheldWithRecommendation,
      annualSocialSecurityEstimated,
      annualNetApprox,
      monthlyNetApprox,
      payPeriods,
      totalWithheldProjected,
      pendingWithRecommendation,
    };
  }, [pagadorFuturo.grossSalary, pagadorFuturo.payPeriods, recommendation, summary.irpfRetenido]);

  const irpfSimulation = useMemo(() => {
    if (!recommendation) {
      return null;
    }

    const futureWithheldSelected = Number(
      (recommendation.futureGrossForPeriod * (selectedFutureIrpf / 100)).toFixed(2)
    );
    const totalWithheldSelected = Number((summary.irpfRetenido + futureWithheldSelected).toFixed(2));
    const haciendaResult = Number((totalWithheldSelected - recommendation.projectedSummary.cuotaIrpfEstimada).toFixed(2));

    const futureAnnualGross = Number(pagadorFuturo.grossSalary) || 0;
    const payPeriods = pagadorFuturo.payPeriods ?? 12;
    const annualSocialSecurityEstimated = Number(
      (futureAnnualGross * (DEFAULT_SOCIAL_SECURITY_PERCENTAGE / 100)).toFixed(2)
    );
    const annualWithheldSelected = Number((futureAnnualGross * (selectedFutureIrpf / 100)).toFixed(2));
    const annualNetSelected = Number((futureAnnualGross - annualSocialSecurityEstimated - annualWithheldSelected).toFixed(2));
    const monthlyNetSelected = Number((annualNetSelected / payPeriods).toFixed(2));

    return {
      futureWithheldSelected,
      totalWithheldSelected,
      haciendaResult,
      annualWithheldSelected,
      annualNetSelected,
      monthlyNetSelected,
      payPeriods,
    };
  }, [pagadorFuturo.grossSalary, pagadorFuturo.payPeriods, recommendation, selectedFutureIrpf, summary.irpfRetenido]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f5f5f5,#e7e5e4_45%,#d6d3d1_100%)] px-6 py-10 text-gray-900 sm:px-10">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="overflow-hidden rounded-4xl border border-gray-200 bg-white/85 p-8 shadow-2xl shadow-gray-300/40 backdrop-blur">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500">Resumen IRPF</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Resultado final de tu cálculo</h1>
            <p className="max-w-2xl text-base leading-7 text-gray-600">
              Aquí tienes el total bruto acumulado, el IRPF ya pagado y la estimación fiscal calculada sobre tu base liquidable.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Total bruto" value={euroFormatter.format(summary.totalBruto)} accent />
            <SummaryCard label="IRPF pagado" value={euroFormatter.format(summary.irpfRetenido)} />
            <SummaryCard label="Cuota estimada" value={euroFormatter.format(summary.cuotaIrpfEstimada)} />
            <SummaryCard label="IRPF pendiente" value={euroFormatter.format(summary.irpfPendiente)} />
          </div>
        </section>


        {recommendation && (
          <section className="grid gap-4 rounded-4xl border border-emerald-200 bg-emerald-50 p-8 text-emerald-950 shadow-xl shadow-emerald-100 md:grid-cols-[1.4fr_0.6fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Recomendacion IRPF</p>
              <h2 className="mt-3 text-2xl font-semibold">Para acercarte a 0 EUR de pendiente, aplica este porcentaje</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-900/80">
                Con el empleo futuro desde la fecha de inicio hasta final de ano, la recomendacion aproximada es
                <span className="ml-1 font-semibold">{recommendation.recommendedPercentage}%</span> de retencion.
              </p>
              <p className="mt-3 text-sm text-emerald-900/70">
                Pendiente proyectado tras aplicar la recomendacion:
                <span className="ml-1 font-semibold">
                  {euroFormatter.format(recommendation.projectedPendingAfterRecommendation)}
                </span>
              </p>

              {irpfSimulation && (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-white/70 p-4">
                  <details>
                    <summary className="cursor-pointer text-sm font-semibold text-emerald-900">
                      Simulador de IRPF futuro (tiempo real)
                    </summary>
                    <div className="mt-3 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedFutureIrpfOverride(Math.max(0, Number((selectedFutureIrpf - 1).toFixed(1))))}
                          className="rounded-lg border border-emerald-200 bg-white px-3 py-1 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
                          aria-label="Reducir IRPF en 1 punto"
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
                          onClick={() => setSelectedFutureIrpfOverride(Math.min(100, Number((selectedFutureIrpf + 1).toFixed(1))))}
                          className="rounded-lg border border-emerald-200 bg-white px-3 py-1 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
                          aria-label="Aumentar IRPF en 1 punto"
                        >
                          +
                        </button>
                        <span className="text-sm font-semibold">%</span>
                      </div>

                      <p className="text-sm text-emerald-900/80">
                        Resultado estimado en Hacienda con <span className="font-semibold">{selectedFutureIrpf}%</span>:
                        <span className="ml-1 font-semibold">
                          {irpfSimulation.haciendaResult >= 0
                            ? `devolucion de ${euroFormatter.format(irpfSimulation.haciendaResult)}`
                            : `a pagar ${euroFormatter.format(Math.abs(irpfSimulation.haciendaResult))}`}
                        </span>
                      </p>
                      <p className="text-sm text-emerald-900/80">
                        Neto anual aprox: <span className="font-semibold">{euroFormatter.format(irpfSimulation.annualNetSelected)}</span>
                      </p>
                      <p className="text-sm text-emerald-900/80">
                        Neto mensual aprox ({irpfSimulation.payPeriods} pagas):
                        <span className="ml-1 font-semibold">{euroFormatter.format(irpfSimulation.monthlyNetSelected)}</span>
                      </p>
                    </div>
                  </details>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between rounded-3xl bg-white/70 p-6">
              <p className="text-sm text-emerald-900/70">Porcentaje recomendado para empleo futuro</p>
              <p className="mt-2 text-3xl font-semibold">{recommendation.recommendedPercentage}%</p>
              {recommendationBreakdown && (
                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-sm text-emerald-900/80">
                    Neto anual aprox: <span className="font-semibold">{euroFormatter.format(recommendationBreakdown.annualNetApprox)}</span>
                  </p>
                  <p className="text-sm text-emerald-900/80">
                    Neto mensual aprox ({recommendationBreakdown.payPeriods} pagas): <span className="font-semibold">{euroFormatter.format(recommendationBreakdown.monthlyNetApprox)}</span>
                  </p>
                </div>
              )}
              <p className="mt-6 text-sm text-emerald-900/70">
                Esta recomendacion es orientativa y se basa en los tramos generales de referencia del ano fiscal actual.
              </p>
            </div>
          </section>
        )}

        <section className="rounded-4xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-200/60">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500">Desglose de calculos</p>
            <h2 className="text-2xl font-semibold text-gray-900">Paso a paso del resultado</h2>
            <p className="text-sm text-gray-600">
              Este bloque enseña cada componente del calculo para que puedas revisar donde se desvian las cifras.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm font-semibold text-gray-800">1) Pagadores actuales (detalle)</p>
              <div className="mt-2">
                {payerBreakdown.length === 0 && <DetailRow label="Sin pagadores" value="-" />}
                {payerBreakdown.map((payer) => (
                  <div key={payer.key} className="border-b border-gray-200/80 py-3 last:border-b-0">
                    <p className="text-sm font-semibold text-gray-800">{payer.name}</p>
                    <div className="mt-2 flex flex-col gap-1 text-xs text-gray-700">
                      <span>Periodo: {formatDate(payer.startDate)} - {formatDate(payer.endDate)}</span>
                      <span>Dias trabajados: {payer.daysWorked}</span>
                      <span>Bruto anual informado: {euroFormatter.format(payer.annualGross)}</span>
                      <span>Bruto diario (anual/365): {euroFormatter.format(payer.grossDaily)}</span>
                      <span>
                        Bruto periodo: {euroFormatter.format(payer.brutoPeriodo)}
                        {` (${decimalFormatter.format(payer.grossDaily)} x ${payer.daysWorked} dias)`}
                      </span>
                      <span>
                        IRPF retenido: {euroFormatter.format(payer.retenidoPeriodo)}
                        {` (${payer.irpfPercentage}% sobre bruto periodo)`}
                      </span>
                      <span>
                        Seguridad Social: {euroFormatter.format(payer.socialSecurityPeriodo)}
                        {` (${payer.socialSecurityPercentage}% sobre bruto periodo)`}
                      </span>
                      <span>Otros deducibles: {euroFormatter.format(payer.otherDeductionsPeriodo)}</span>
                      <span>Rendimiento neto del trabajo: {euroFormatter.format(payer.rendimientoNetoPeriodo)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm font-semibold text-gray-800">2) Totales actuales</p>
              <div className="mt-2">
                <DetailRow label="Total bruto" value={euroFormatter.format(summary.totalBruto)} />
                <DetailRow label="Rendimiento neto total" value={euroFormatter.format(summary.totalRendimientoNeto)} />
                <DetailRow label="IRPF retenido" value={euroFormatter.format(summary.irpfRetenido)} />
                <DetailRow label="Base liquidable" value={euroFormatter.format(summary.baseLiquidable)} />
                <DetailRow label="Cuota estimada" value={euroFormatter.format(summary.cuotaIrpfEstimada)} />
                <DetailRow label="Pendiente actual" value={euroFormatter.format(summary.irpfPendiente)} />
              </div>
            </div>
          </div>

          {recommendation && recommendationBreakdown && (
            <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm font-semibold text-emerald-900">3) Proyeccion con empleo futuro y recomendacion</p>
              <div className="mt-2">
                <DetailRow label="Bruto futuro del periodo" value={euroFormatter.format(recommendation.futureGrossForPeriod)} />
                <DetailRow
                  label="Retencion futura recomendada"
                  value={`${recommendation.recommendedPercentage}% (${euroFormatter.format(recommendationBreakdown.futureWithheldWithRecommendation)})`}
                />
                <DetailRow
                  label="Bruto anual nuevo pagador"
                  value={euroFormatter.format(recommendationBreakdown.futureAnnualGross)}
                />
                <DetailRow
                  label="SS anual estimada nuevo pagador"
                  value={euroFormatter.format(recommendationBreakdown.annualSocialSecurityEstimated)}
                />
                <DetailRow
                  label="Retencion anual aprox nuevo pagador"
                  value={euroFormatter.format(recommendationBreakdown.annualWithheldWithRecommendation)}
                />
                <DetailRow
                  label="Neto anual aprox nuevo pagador"
                  value={euroFormatter.format(recommendationBreakdown.annualNetApprox)}
                />
                <DetailRow
                  label={`Neto mensual aprox nuevo pagador (${recommendationBreakdown.payPeriods} pagas)`}
                  value={euroFormatter.format(recommendationBreakdown.monthlyNetApprox)}
                />
                <DetailRow label="Total retenido proyectado" value={euroFormatter.format(recommendationBreakdown.totalWithheldProjected)} />
                <DetailRow
                  label="Cuota estimada proyectada"
                  value={euroFormatter.format(recommendation.projectedSummary.cuotaIrpfEstimada)}
                />
                <DetailRow
                  label="Pendiente proyectado (recalculado)"
                  value={euroFormatter.format(recommendationBreakdown.pendingWithRecommendation)}
                />
                <DetailRow
                  label="Pendiente proyectado (funcion)"
                  value={euroFormatter.format(recommendation.projectedPendingAfterRecommendation)}
                />
                {irpfSimulation && (
                  <>
                    <DetailRow
                      label={`Retencion futura con selector (${selectedFutureIrpf}%)`}
                      value={euroFormatter.format(irpfSimulation.futureWithheldSelected)}
                    />
                    <DetailRow
                      label="Total retenido con selector"
                      value={euroFormatter.format(irpfSimulation.totalWithheldSelected)}
                    />
                    <DetailRow
                      label="Resultado Hacienda con selector"
                      value={
                        irpfSimulation.haciendaResult >= 0
                          ? `Devolucion ${euroFormatter.format(irpfSimulation.haciendaResult)}`
                          : `A pagar ${euroFormatter.format(Math.abs(irpfSimulation.haciendaResult))}`
                      }
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-4 rounded-4xl border border-gray-200 bg-gray-950 p-8 text-white shadow-2xl shadow-gray-400/30 md:grid-cols-[1.4fr_0.6fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">Lectura rápida</p>
            <h2 className="mt-3 text-2xl font-semibold">El dato clave está en el total bruto y lo retenido</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              Si el IRPF retenido supera la cuota estimada, el resultado pendiente será negativo y reflejará una posible devolución.
            </p>
          </div>


          <div className="flex flex-col justify-between rounded-3xl bg-white/10 p-6">
            <p className="text-sm text-gray-300">Base liquidable</p>
            <p className="mt-2 text-3xl font-semibold">{euroFormatter.format(summary.baseLiquidable)}</p>
            <p className="mt-6 text-sm text-gray-300">
              El cálculo usa el mínimo personal por defecto de 5.550 € y los tramos generales de referencia.
            </p>
          </div>
        </section>



        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/stepper"
            className="rounded-full border border-gray-300 bg-white px-6 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-100"
          >
            Volver al stepper
          </Link>
          <p className="text-sm text-gray-600">El resumen se obtiene directamente del estado guardado en la sesión actual.</p>
        </div>
      </main>
    </div>
  );
}