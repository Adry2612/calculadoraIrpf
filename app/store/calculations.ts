export type PayerCalculationInput = {
  name: string;
  grossSalary: number;
  irpfPercentage: number;
  startDate: string;
  endDate: string;
  salaryIncludesSocialSecurity?: boolean;
  socialSecurityPercentage?: number;
  annualOtherDeductions?: number;
};

export type FuturePayerCalculationInput = {
  name: string;
  startDate: string;
  annualGross: string | number | readonly string[] | undefined;
};

export type IrpfBracket = {
  min: number;
  max: number | null;
  rate: number;
};

export type IrpfSummary = {
  totalBruto: number;
  totalRendimientoNeto: number;
  irpfRetenido: number;
  baseLiquidable: number;
  cuotaIrpfEstimada: number;
  irpfPendiente: number;
};

export type FutureIrpfRecommendation = {
  recommendedPercentage: number;
  futureGrossForPeriod: number;
  projectedSummary: IrpfSummary;
  projectedPendingAfterRecommendation: number;
};

// Tramos generales de referencia para IRPF (tipo combinado habitual).
// Nota: pueden variar por comunidad autonoma y ejercicio fiscal.
export const IRPF_BRACKETS: IrpfBracket[] = [
  { min: 0, max: 12450, rate: 0.19 },
  { min: 12450, max: 20200, rate: 0.24 },
  { min: 20200, max: 35200, rate: 0.30 },
  { min: 35200, max: 60000, rate: 0.37 },
  { min: 60000, max: 300000, rate: 0.45 },
  { min: 300000, max: null, rate: 0.47 },
];

export const DEFAULT_SOCIAL_SECURITY_PERCENTAGE = 6.4;

const getCurrentYearBounds = () => {
  const currentYear = new Date().getFullYear();

  return {
    currentYear,
    yearStart: new Date(currentYear, 0, 1),
    yearEnd: new Date(currentYear, 11, 31),
    lastDayOfYear: `${currentYear}-12-31`,
  };
};

const getDaysInYear = (year: number) => {
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  return isLeapYear ? 366 : 365;
};

const getCurrentYearPeriod = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return null;
  }

  const { yearStart, yearEnd } = getCurrentYearBounds();
  const normalizedStart = start > yearStart ? start : yearStart;
  const normalizedEnd = end < yearEnd ? end : yearEnd;

  if (normalizedEnd < normalizedStart) {
    return null;
  }

  return {
    normalizedStart,
    normalizedEnd,
  };
};

export const calculateTotalForPeriod = (startDate: string, endDate: string, annualGrossSalary: number) => {
  const normalizedPeriod = getCurrentYearPeriod(startDate, endDate);
  if (!normalizedPeriod || !Number.isFinite(annualGrossSalary) || annualGrossSalary <= 0) {
    return 0;
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const daysWorked =
    Math.floor((normalizedPeriod.normalizedEnd.getTime() - normalizedPeriod.normalizedStart.getTime()) / millisecondsPerDay) +
    1;
  const { currentYear } = getCurrentYearBounds();
  const dailyGrossSalary = annualGrossSalary / getDaysInYear(currentYear);

  return Number((dailyGrossSalary * daysWorked).toFixed(2));
};

export const calculateTotalIrpfWithheld = (
  startDate: string,
  endDate: string,
  annualGrossSalary: number,
  irpfPercentage: number
) => {
  const totalForPeriod = calculateTotalForPeriod(startDate, endDate, annualGrossSalary);
  return Number((totalForPeriod * (irpfPercentage / 100)).toFixed(2));
};

export const calculateSocialSecurityForPeriod = (
  startDate: string,
  endDate: string,
  annualGrossSalary: number,
  salaryIncludesSocialSecurity = false,
  socialSecurityPercentage = DEFAULT_SOCIAL_SECURITY_PERCENTAGE
) => {
  if (salaryIncludesSocialSecurity) {
    return 0;
  }

  const grossForPeriod = calculateTotalForPeriod(startDate, endDate, annualGrossSalary);
  return Number((grossForPeriod * (socialSecurityPercentage / 100)).toFixed(2));
};

export const calculateOtherDeductionsForPeriod = (
  startDate: string,
  endDate: string,
  annualOtherDeductions: number
) => {
  if (!Number.isFinite(annualOtherDeductions) || annualOtherDeductions <= 0) {
    return 0;
  }

  return calculateTotalForPeriod(startDate, endDate, annualOtherDeductions);
};

export const getNetWorkIncomeForPeriod = (pagador: PayerCalculationInput) => {
  const grossForPeriod = calculateTotalForPeriod(pagador.startDate, pagador.endDate, pagador.grossSalary);
  const socialSecurity = calculateSocialSecurityForPeriod(
    pagador.startDate,
    pagador.endDate,
    pagador.grossSalary,
    pagador.salaryIncludesSocialSecurity,
    pagador.socialSecurityPercentage ?? DEFAULT_SOCIAL_SECURITY_PERCENTAGE
  );
  const otherDeductions = calculateOtherDeductionsForPeriod(
    pagador.startDate,
    pagador.endDate,
    pagador.annualOtherDeductions ?? 0
  );

  return Number(Math.max(0, grossForPeriod - socialSecurity - otherDeductions).toFixed(2));
};

export const getTotalGrossAllPayers = (pagadores: PayerCalculationInput[]) =>
  Number(
    pagadores
      .reduce(
        (total, pagador) => total + calculateTotalForPeriod(pagador.startDate, pagador.endDate, pagador.grossSalary),
        0
      )
      .toFixed(2)
  );

export const getTotalIrpfAllPayers = (pagadores: PayerCalculationInput[]) =>
  Number(
    pagadores
      .reduce(
        (total, pagador) =>
          total +
          calculateTotalIrpfWithheld(
            pagador.startDate,
            pagador.endDate,
            pagador.grossSalary,
            pagador.irpfPercentage
          ),
        0
      )
      .toFixed(2)
  );

export const getTotalNetWorkIncomeAllPayers = (pagadores: PayerCalculationInput[]) =>
  Number(
    pagadores
      .reduce((total, pagador) => total + getNetWorkIncomeForPeriod(pagador), 0)
      .toFixed(2)
  );

export const getBaseLiquidable = (totalBruto: number, minimoPersonal = 5550) => {
  const baseLiquidable = totalBruto - minimoPersonal;
  return Number(Math.max(0, baseLiquidable).toFixed(2));
};

export const calculateIrpfFromBase = (baseLiquidable: number, brackets: IrpfBracket[] = IRPF_BRACKETS) => {
  if (baseLiquidable <= 0) {
    return 0;
  }

  const cuota = brackets.reduce((total, bracket) => {
    if (baseLiquidable <= bracket.min) {
      return total;
    }

    const tramoSuperior = bracket.max ?? Number.POSITIVE_INFINITY;
    const tramoBase = Math.min(baseLiquidable, tramoSuperior) - bracket.min;
    if (tramoBase <= 0) {
      return total;
    }

    return total + tramoBase * bracket.rate;
  }, 0);

  return Number(cuota.toFixed(2));
};

export const getIrpfSummary = (
  totalBruto: number,
  irpfRetenido: number,
  minimoPersonal = 5550,
  brackets: IrpfBracket[] = IRPF_BRACKETS,
  totalRendimientoNeto = totalBruto
): IrpfSummary => {
  const baseLiquidable = getBaseLiquidable(totalRendimientoNeto, minimoPersonal);
  const cuotaIrpfEstimada = calculateIrpfFromBase(baseLiquidable, brackets);
  const irpfPendiente = Number((cuotaIrpfEstimada - irpfRetenido).toFixed(2));

  return {
    totalBruto: Number(totalBruto.toFixed(2)),
    totalRendimientoNeto: Number(totalRendimientoNeto.toFixed(2)),
    irpfRetenido: Number(irpfRetenido.toFixed(2)),
    baseLiquidable,
    cuotaIrpfEstimada,
    irpfPendiente,
  };
};

export const getIrpfSummaryWithFuturePayer = (
  pagadores: PayerCalculationInput[],
  pagadorFuturo: FuturePayerCalculationInput,
  minimoPersonal = 5550,
  brackets: IrpfBracket[] = IRPF_BRACKETS
): IrpfSummary => {
  const totalBrutoTodosPagadores = getTotalGrossAllPayers(pagadores);
  const totalRendimientoNetoTodosPagadores = getTotalNetWorkIncomeAllPayers(pagadores);
  const totalIrpf = getTotalIrpfAllPayers(pagadores);

  const { lastDayOfYear } = getCurrentYearBounds();
  const annualGross = Number(pagadorFuturo.annualGross);
  const totalBrutoFuturo = calculateTotalForPeriod(
    pagadorFuturo.startDate,
    lastDayOfYear,
    Number.isFinite(annualGross) ? annualGross : 0
  );
  const socialSecurityFuturo = calculateSocialSecurityForPeriod(
    pagadorFuturo.startDate,
    lastDayOfYear,
    Number.isFinite(annualGross) ? annualGross : 0,
    false,
    DEFAULT_SOCIAL_SECURITY_PERCENTAGE
  );
  const totalRendimientoNetoFuturo = Number(Math.max(0, totalBrutoFuturo - socialSecurityFuturo).toFixed(2));

  const totalBrutoGeneral = Number((totalBrutoTodosPagadores + totalBrutoFuturo).toFixed(2));
  const totalRendimientoNetoGeneral = Number((totalRendimientoNetoTodosPagadores + totalRendimientoNetoFuturo).toFixed(2));

  return getIrpfSummary(totalBrutoGeneral, totalIrpf, minimoPersonal, brackets, totalRendimientoNetoGeneral);
};

export const getRecommendedIrpfPercentageForFuturePayer = (
  pagadores: PayerCalculationInput[],
  pagadorFuturo: FuturePayerCalculationInput,
  minimoPersonal = 5550,
  brackets: IrpfBracket[] = IRPF_BRACKETS
): FutureIrpfRecommendation => {
  const projectedSummary = getIrpfSummaryWithFuturePayer(pagadores, pagadorFuturo, minimoPersonal, brackets);
  const currentIrpfWithheld = getTotalIrpfAllPayers(pagadores);

  const { lastDayOfYear } = getCurrentYearBounds();
  const annualGross = Number(pagadorFuturo.annualGross);
  const futureGrossForPeriod = calculateTotalForPeriod(
    pagadorFuturo.startDate,
    lastDayOfYear,
    Number.isFinite(annualGross) ? annualGross : 0
  );

  if (futureGrossForPeriod <= 0) {
    return {
      recommendedPercentage: 0,
      futureGrossForPeriod,
      projectedSummary,
      projectedPendingAfterRecommendation: projectedSummary.irpfPendiente,
    };
  }

  const targetFutureWithheld = projectedSummary.cuotaIrpfEstimada - currentIrpfWithheld;
  const rawRecommendedPercentage = (targetFutureWithheld / futureGrossForPeriod) * 100;
  const recommendedPercentage = Math.min(100, Math.max(0, Math.round(rawRecommendedPercentage)));

  const futureWithheldWithRecommendation = Number(
    (futureGrossForPeriod * (recommendedPercentage / 100)).toFixed(2)
  );
  const projectedSummaryWithRecommendation = getIrpfSummary(
    projectedSummary.totalBruto,
    Number((currentIrpfWithheld + futureWithheldWithRecommendation).toFixed(2)),
    minimoPersonal,
    brackets,
    projectedSummary.totalRendimientoNeto
  );

  return {
    recommendedPercentage,
    futureGrossForPeriod,
    projectedSummary,
    projectedPendingAfterRecommendation: projectedSummaryWithRecommendation.irpfPendiente,
  };
};
