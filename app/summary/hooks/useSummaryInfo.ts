import { useCallback, useMemo, useState } from "react";
import { useCalculadoraStore } from "../../store/useCalculadoraStore";
import { useI18n } from "../../i18n/useI18n";
import {
  DEFAULT_SOCIAL_SECURITY_PERCENTAGE,
  PersonalTaxProfile,
  calculateOtherDeductionsForPeriod,
  calculateSocialSecurityForPeriod,
  calculateTotalForPeriod,
  calculateTotalIrpfWithheld,
  getExtraPaymentCountForPeriod,
  getIrpfSummary,
  getNetWorkIncomeForPeriod,
  getRecommendedIrpfPercentageForFuturePayer,
  getTotalGrossAllPayers,
  getTotalIrpfAllPayers,
  getTotalNetWorkIncomeAllPayers,
} from "../../store/calculations";

export function useSummaryInfo() {
  const { localeTag, t } = useI18n();
  const pagadores = useCalculadoraStore((state) => state.pagadores);
  const pagadorFuturo = useCalculadoraStore((state) => state.pagadorFuturo);
  const datosPersonales = useCalculadoraStore((state) => state.datosPersonales);
  const retentionPreference = useCalculadoraStore(
    (state) => state.datosPersonales.retentionPreference
  );

  const personalTaxProfile = useMemo<PersonalTaxProfile>(
    () => ({
      region: datosPersonales.region,
      birthYear: datosPersonales.birthYear,
      childrenCount: datosPersonales.childrenCount,
      discapacidadGrado: datosPersonales.discapacidadGrado,
      ascendientesACargo: datosPersonales.ascendientesACargo,
    }),
    [
      datosPersonales.ascendientesACargo,
      datosPersonales.birthYear,
      datosPersonales.childrenCount,
      datosPersonales.discapacidadGrado,
      datosPersonales.region,
    ]
  );

  const currentYear = new Date().getFullYear();
  const daysInCurrentYear =
    (currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0 ? 366 : 365;

  const formatDate = useCallback(
    (date: string) => {
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) {
        return "-";
      }

      return parsed.toLocaleDateString(localeTag);
    },
    [localeTag]
  );

  const euroFormatter = useMemo(
    () =>
      new Intl.NumberFormat(localeTag, {
        style: "currency",
        currency: "EUR",
      }),
    [localeTag]
  );

  const decimalFormatter = useMemo(
    () =>
      new Intl.NumberFormat(localeTag, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [localeTag]
  );

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
      return (
        Math.floor((normalizedEnd.getTime() - normalizedStart.getTime()) / millisecondsPerDay) + 1
      );
    },
    [currentYear]
  );

  const payerBreakdown = useMemo(
    () =>
      pagadores.map((pagador, index) => {
        const daysWorked = getDaysWorked(pagador.startDate, pagador.endDate);
        const payPeriods = pagador.payPeriods ?? 12;
        const extraPaymentsProrated = pagador.extraPaymentsProrated ?? false;
        const extraPaymentMonths = pagador.extraPaymentMonths ?? [6, 12];
        const annualBaseGross =
          payPeriods === 14 && !extraPaymentsProrated
            ? pagador.grossSalary * (12 / 14)
            : pagador.grossSalary;
        const grossDaily = annualBaseGross / daysInCurrentYear;
        const extraPaymentCount = getExtraPaymentCountForPeriod(
          pagador.startDate,
          pagador.endDate,
          payPeriods,
          extraPaymentsProrated,
          extraPaymentMonths,
          true
        );
        const brutoPeriodo = calculateTotalForPeriod(
          pagador.startDate,
          pagador.endDate,
          pagador.grossSalary,
          payPeriods,
          extraPaymentsProrated,
          extraPaymentMonths,
          true
        );
        const retenidoPeriodo = calculateTotalIrpfWithheld(
          pagador.startDate,
          pagador.endDate,
          pagador.grossSalary,
          pagador.irpfPercentage,
          payPeriods,
          extraPaymentsProrated,
          extraPaymentMonths,
          true
        );
        const socialSecurityPeriodo = calculateSocialSecurityForPeriod(
          pagador.startDate,
          pagador.endDate,
          pagador.grossSalary,
          payPeriods,
          extraPaymentsProrated,
          extraPaymentMonths,
          true,
          pagador.salaryIncludesSocialSecurity,
          pagador.socialSecurityPercentage
        );
        const otherDeductionsPeriodo = calculateOtherDeductionsForPeriod(
          pagador.startDate,
          pagador.endDate,
          pagador.annualOtherDeductions ?? 0,
          true
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
          socialSecurityPercentage:
            pagador.socialSecurityPercentage ?? DEFAULT_SOCIAL_SECURITY_PERCENTAGE,
          payPeriods,
          extraPaymentsProrated,
          extraPaymentMonths,
          extraPaymentCount,
        };
      }),
    [pagadores, daysInCurrentYear, getDaysWorked]
  );

  const summary = useMemo(() => {
    const totalBruto = getTotalGrossAllPayers(pagadores);
    const totalRendimientoNeto = getTotalNetWorkIncomeAllPayers(pagadores);
    const irpfRetenido = getTotalIrpfAllPayers(pagadores);
    return getIrpfSummary(
      totalBruto,
      irpfRetenido,
      5550,
      undefined,
      totalRendimientoNeto,
      personalTaxProfile
    );
  }, [pagadores, personalTaxProfile]);

  const recommendation = useMemo(() => {
    if (!pagadorFuturo.startDate || pagadorFuturo.grossSalary <= 0) {
      return null;
    }

    const targetPendingByPreference: Record<"devolucion-segura" | "blindado" | "ajustado", number> =
      {
        "devolucion-segura": -1000,
        blindado: -400,
        ajustado: 0,
      };

    const result = getRecommendedIrpfPercentageForFuturePayer(
      pagadores,
      {
        name: pagadorFuturo.name,
        startDate: pagadorFuturo.startDate,
        annualGross: pagadorFuturo.grossSalary,
        payPeriods: pagadorFuturo.payPeriods,
      },
      targetPendingByPreference[retentionPreference],
      5550,
      undefined,
      personalTaxProfile
    );

    if (result.futureGrossForPeriod <= 0) {
      return null;
    }

    return result;
  }, [pagadores, pagadorFuturo, personalTaxProfile, retentionPreference]);

  const [selectedFutureIrpfOverride, setSelectedFutureIrpfOverride] = useState<number | null>(null);
  const [dismissedRecommendationKey, setDismissedRecommendationKey] = useState<string | null>(null);
  const selectedFutureIrpf =
    selectedFutureIrpfOverride ?? recommendation?.recommendedPercentage ?? 0;

  const recommendationModalKey = recommendation
    ? [
        pagadorFuturo.name,
        pagadorFuturo.startDate,
        pagadorFuturo.grossSalary,
        pagadorFuturo.payPeriods,
        recommendation.recommendedPercentage,
      ].join("-")
    : null;

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
      (recommendation.futureGrossForPeriod * (recommendation.recommendedPercentage / 100)).toFixed(
        2
      )
    );

    const annualWithheldWithRecommendation = Number(
      (futureAnnualGross * (recommendation.recommendedPercentage / 100)).toFixed(2)
    );

    const annualNetApprox = Number(
      (
        futureAnnualGross -
        annualSocialSecurityEstimated -
        annualWithheldWithRecommendation
      ).toFixed(2)
    );
    const monthlyNetApprox = Number((annualNetApprox / payPeriods).toFixed(2));

    const totalWithheldProjected = Number(
      (summary.irpfRetenido + futureWithheldWithRecommendation).toFixed(2)
    );
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
    const totalWithheldSelected = Number(
      (summary.irpfRetenido + futureWithheldSelected).toFixed(2)
    );
    const haciendaResult = Number(
      (totalWithheldSelected - recommendation.projectedSummary.cuotaIrpfEstimada).toFixed(2)
    );

    const futureAnnualGross = Number(pagadorFuturo.grossSalary) || 0;
    const payPeriods = pagadorFuturo.payPeriods ?? 12;
    const annualSocialSecurityEstimated = Number(
      (futureAnnualGross * (DEFAULT_SOCIAL_SECURITY_PERCENTAGE / 100)).toFixed(2)
    );
    const annualWithheldSelected = Number(
      (futureAnnualGross * (selectedFutureIrpf / 100)).toFixed(2)
    );
    const annualNetSelected = Number(
      (futureAnnualGross - annualSocialSecurityEstimated - annualWithheldSelected).toFixed(2)
    );
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
  }, [
    pagadorFuturo.grossSalary,
    pagadorFuturo.payPeriods,
    recommendation,
    selectedFutureIrpf,
    summary.irpfRetenido,
  ]);

  const isRecommendationModalOpen = Boolean(
    recommendation && irpfSimulation && recommendationModalKey !== dismissedRecommendationKey
  );

  return {
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
  };
}
