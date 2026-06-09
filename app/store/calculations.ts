import { calcIrpfRegional, calcIrpfState, calcPersonalMinimum } from "spanish-tax-calculators";

export type PayerCalculationInput = {
  name: string;
  grossSalary: number;
  irpfPercentage: number;
  startDate: string;
  endDate: string;
  payPeriods?: 12 | 14;
  extraPaymentsProrated?: boolean;
  extraPaymentMonths?: [number, number];
  salaryIncludesSocialSecurity?: boolean;
  socialSecurityPercentage?: number;
  annualOtherDeductions?: number;
};

export type FuturePayerCalculationInput = {
  name: string;
  startDate: string;
  annualGross: string | number | readonly string[] | undefined;
  payPeriods?: 12 | 14;
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

export type PersonalTaxProfile = {
  region: string;
  birthYear: number;
  childrenCount: number;
  discapacidadGrado: 0 | 33 | 65;
  ascendientesACargo: boolean;
};

// Tramos generales de referencia para IRPF (tipo combinado habitual).
// Nota: pueden variar por comunidad autonoma y ejercicio fiscal.
export const IRPF_BRACKETS: IrpfBracket[] = [
  { min: 0, max: 12450, rate: 0.19 },
  { min: 12450, max: 20200, rate: 0.24 },
  { min: 20200, max: 35200, rate: 0.3 },
  { min: 35200, max: 60000, rate: 0.37 },
  { min: 60000, max: 300000, rate: 0.45 },
  { min: 300000, max: null, rate: 0.47 },
];

export const DEFAULT_SOCIAL_SECURITY_PERCENTAGE = 6.4;

const ASCENDANT_ALLOWANCE = 1150;

const REGION_TO_IRPF_REGION: Record<string, string> = {
  andalucia: "andalucia",
  aragon: "aragon",
  asturias: "asturias",
  baleares: "baleares",
  canarias: "canarias",
  cantabria: "cantabria",
  "castilla-la-mancha": "castilla_la_mancha",
  "castilla-y-leon": "castilla_leon",
  cataluna: "catalunya",
  extremadura: "extremadura",
  galicia: "galicia",
  madrid: "madrid",
  murcia: "murcia",
  navarra: "navarra",
  "pais-vasco": "pais_vasco",
  "la-rioja": "la_rioja",
  "comunidad-valenciana": "comunidad_valenciana",
};

const normalizeRegion = (region: string) => REGION_TO_IRPF_REGION[region] ?? "";

type ForalRegion = "navarra" | "pais_vasco";

type ProgressiveBracket = {
  upTo: number;
  rate: number;
};

// Tablas forales mantenidas localmente para poder actualizarlas de forma independiente.
const FORAL_IRPF_BRACKETS: Record<ForalRegion, ProgressiveBracket[]> = {
  navarra: [
    { upTo: 12450, rate: 0.085 },
    { upTo: 20200, rate: 0.105 },
    { upTo: 35200, rate: 0.145 },
    { upTo: 60000, rate: 0.175 },
    { upTo: 300000, rate: 0.22 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.235 },
  ],
  pais_vasco: [
    { upTo: 12450, rate: 0.07 },
    { upTo: 20200, rate: 0.1 },
    { upTo: 35200, rate: 0.135 },
    { upTo: 60000, rate: 0.165 },
    { upTo: 300000, rate: 0.2 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.22 },
  ],
};

const isForalRegion = (region: string): region is ForalRegion =>
  region === "navarra" || region === "pais_vasco";

const calculateProgressiveQuota = (base: number, brackets: ProgressiveBracket[]) => {
  if (base <= 0) {
    return 0;
  }

  let tax = 0;
  let previousLimit = 0;

  for (const { upTo, rate } of brackets) {
    if (base <= previousLimit) {
      break;
    }

    const taxableSlice = Math.min(base, upTo) - previousLimit;
    if (taxableSlice > 0) {
      tax += taxableSlice * rate;
    }

    previousLimit = upTo;
  }

  return Number(tax.toFixed(2));
};

const calculateRegionalIrpf = (base: number, region: string) => {
  if (isForalRegion(region)) {
    return calculateProgressiveQuota(base, FORAL_IRPF_BRACKETS[region]);
  }

  return calcIrpfRegional(base, region);
};

const getPersonalTaxInputs = (personalInfo: PersonalTaxProfile, currentYear: number) => {
  const age = Math.max(18, currentYear - personalInfo.birthYear);
  const disabilityLevel: 0 | 33 | 65 = personalInfo.discapacidadGrado;

  const basePersonalMinimum = calcPersonalMinimum({
    age,
    numChildren: personalInfo.childrenCount,
    childrenUnder3: 0,
    disabilityLevel,
  });

  const ascendantMinimum = personalInfo.ascendientesACargo ? ASCENDANT_ALLOWANCE : 0;

  return {
    minimoPersonal: Number((basePersonalMinimum + ascendantMinimum).toFixed(2)),
    normalizedRegion: normalizeRegion(personalInfo.region),
  };
};

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

const getCurrentYearPeriod = (startDate: string, endDate: string, capToCurrentMonth = false) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return null;
  }

  const { yearStart, yearEnd } = getCurrentYearBounds();
  const normalizedStart = start > yearStart ? start : yearStart;
  let normalizedEnd = end < yearEnd ? end : yearEnd;

  if (capToCurrentMonth) {
    const now = new Date();
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    normalizedEnd = endOfCurrentMonth < normalizedEnd ? endOfCurrentMonth : normalizedEnd;
  }

  if (normalizedEnd < normalizedStart) {
    return null;
  }

  return {
    normalizedStart,
    normalizedEnd,
  };
};

export const calculateTotalForPeriod = (
  startDate: string,
  endDate: string,
  annualGrossSalary: number,
  payPeriods: 12 | 14 = 12,
  extraPaymentsProrated = false,
  extraPaymentMonths?: [number, number],
  capToCurrentMonth = false
) => {
  const normalizedPeriod = getCurrentYearPeriod(startDate, endDate, capToCurrentMonth);
  if (!normalizedPeriod || !Number.isFinite(annualGrossSalary) || annualGrossSalary <= 0) {
    return 0;
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const daysWorked =
    Math.floor(
      (normalizedPeriod.normalizedEnd.getTime() - normalizedPeriod.normalizedStart.getTime()) /
        millisecondsPerDay
    ) + 1;
  const { currentYear } = getCurrentYearBounds();
  const daysInYear = getDaysInYear(currentYear);

  if (payPeriods === 14 && !extraPaymentsProrated) {
    const extraPayments = getExtraPaymentCountForPeriod(
      startDate,
      endDate,
      14,
      false,
      extraPaymentMonths
    );
    const baseAnnualGross = annualGrossSalary * (12 / 14);
    const baseGrossForPeriod = (baseAnnualGross / daysInYear) * daysWorked;
    const extraGrossForPeriod = (annualGrossSalary / 14) * extraPayments;

    return Number((baseGrossForPeriod + extraGrossForPeriod).toFixed(2));
  }

  const dailyGrossSalary = annualGrossSalary / daysInYear;

  return Number((dailyGrossSalary * daysWorked).toFixed(2));
};

export const getExtraPaymentCountForPeriod = (
  startDate: string,
  endDate: string,
  payPeriods: 12 | 14 = 12,
  extraPaymentsProrated = false,
  extraPaymentMonths: [number, number] = [6, 12],
  capToCurrentMonth = false
) => {
  if (payPeriods !== 14 || extraPaymentsProrated) {
    return 0;
  }

  const normalizedPeriod = getCurrentYearPeriod(startDate, endDate, capToCurrentMonth);
  if (!normalizedPeriod) {
    return 0;
  }

  const { currentYear } = getCurrentYearBounds();
  const safeMonths = extraPaymentMonths.map((month) => {
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      return 12;
    }
    return month;
  }) as [number, number];

  const extraPaymentDates = safeMonths.map((month) => new Date(currentYear, month, 0));

  return extraPaymentDates.reduce((count, extraDate) => {
    if (
      extraDate >= normalizedPeriod.normalizedStart &&
      extraDate <= normalizedPeriod.normalizedEnd
    ) {
      return count + 1;
    }

    return count;
  }, 0);
};

export const calculateTotalIrpfWithheld = (
  startDate: string,
  endDate: string,
  annualGrossSalary: number,
  irpfPercentage: number,
  payPeriods: 12 | 14 = 12,
  extraPaymentsProrated = false,
  extraPaymentMonths?: [number, number],
  capToCurrentMonth = false
) => {
  const totalForPeriod = calculateTotalForPeriod(
    startDate,
    endDate,
    annualGrossSalary,
    payPeriods,
    extraPaymentsProrated,
    extraPaymentMonths,
    capToCurrentMonth
  );
  return Number((totalForPeriod * (irpfPercentage / 100)).toFixed(2));
};

export const calculateSocialSecurityForPeriod = (
  startDate: string,
  endDate: string,
  annualGrossSalary: number,
  payPeriods: 12 | 14 = 12,
  extraPaymentsProrated = false,
  extraPaymentMonths: [number, number] | undefined = undefined,
  capToCurrentMonth = false,
  salaryIncludesSocialSecurity = false,
  socialSecurityPercentage = DEFAULT_SOCIAL_SECURITY_PERCENTAGE
) => {
  if (salaryIncludesSocialSecurity) {
    return 0;
  }

  const grossForPeriod = calculateTotalForPeriod(
    startDate,
    endDate,
    annualGrossSalary,
    payPeriods,
    extraPaymentsProrated,
    extraPaymentMonths,
    capToCurrentMonth
  );
  return Number((grossForPeriod * (socialSecurityPercentage / 100)).toFixed(2));
};

export const calculateOtherDeductionsForPeriod = (
  startDate: string,
  endDate: string,
  annualOtherDeductions: number,
  capToCurrentMonth = false
) => {
  if (!Number.isFinite(annualOtherDeductions) || annualOtherDeductions <= 0) {
    return 0;
  }

  return calculateTotalForPeriod(
    startDate,
    endDate,
    annualOtherDeductions,
    12,
    false,
    undefined,
    capToCurrentMonth
  );
};

export const getNetWorkIncomeForPeriod = (pagador: PayerCalculationInput) => {
  const grossForPeriod = calculateTotalForPeriod(
    pagador.startDate,
    pagador.endDate,
    pagador.grossSalary,
    pagador.payPeriods ?? 12,
    pagador.extraPaymentsProrated ?? false,
    pagador.extraPaymentMonths,
    true
  );
  const socialSecurity = calculateSocialSecurityForPeriod(
    pagador.startDate,
    pagador.endDate,
    pagador.grossSalary,
    pagador.payPeriods ?? 12,
    pagador.extraPaymentsProrated ?? false,
    pagador.extraPaymentMonths,
    true,
    pagador.salaryIncludesSocialSecurity,
    pagador.socialSecurityPercentage ?? DEFAULT_SOCIAL_SECURITY_PERCENTAGE
  );
  const otherDeductions = calculateOtherDeductionsForPeriod(
    pagador.startDate,
    pagador.endDate,
    pagador.annualOtherDeductions ?? 0,
    true
  );

  return Number(Math.max(0, grossForPeriod - socialSecurity - otherDeductions).toFixed(2));
};

export const getTotalGrossAllPayers = (pagadores: PayerCalculationInput[]) =>
  Number(
    pagadores
      .reduce(
        (total, pagador) =>
          total +
          calculateTotalForPeriod(
            pagador.startDate,
            pagador.endDate,
            pagador.grossSalary,
            pagador.payPeriods ?? 12,
            pagador.extraPaymentsProrated ?? false,
            pagador.extraPaymentMonths,
            true
          ),
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
            pagador.irpfPercentage,
            pagador.payPeriods ?? 12,
            pagador.extraPaymentsProrated ?? false,
            pagador.extraPaymentMonths,
            true
          ),
        0
      )
      .toFixed(2)
  );

export const getTotalNetWorkIncomeAllPayers = (pagadores: PayerCalculationInput[]) =>
  Number(
    pagadores.reduce((total, pagador) => total + getNetWorkIncomeForPeriod(pagador), 0).toFixed(2)
  );

export const getBaseLiquidable = (totalBruto: number, minimoPersonal = 5550) => {
  const baseLiquidable = totalBruto - minimoPersonal;
  return Number(Math.max(0, baseLiquidable).toFixed(2));
};

export const calculateIrpfFromBase = (
  baseLiquidable: number,
  brackets: IrpfBracket[] = IRPF_BRACKETS
) => {
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
  totalRendimientoNeto = totalBruto,
  personalInfo?: PersonalTaxProfile
): IrpfSummary => {
  const { currentYear } = getCurrentYearBounds();
  const personalTaxInputs = personalInfo ? getPersonalTaxInputs(personalInfo, currentYear) : null;
  const effectiveMinimum = personalTaxInputs?.minimoPersonal ?? minimoPersonal;
  const baseLiquidable = getBaseLiquidable(totalRendimientoNeto, effectiveMinimum);

  const cuotaIrpfEstimada = personalTaxInputs?.normalizedRegion
    ? Number(
        Math.max(
          0,
          calcIrpfState(totalRendimientoNeto) -
            calcIrpfState(effectiveMinimum) +
            (calculateRegionalIrpf(totalRendimientoNeto, personalTaxInputs.normalizedRegion) -
              calculateRegionalIrpf(effectiveMinimum, personalTaxInputs.normalizedRegion))
        ).toFixed(2)
      )
    : calculateIrpfFromBase(baseLiquidable, brackets);
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
  brackets: IrpfBracket[] = IRPF_BRACKETS,
  personalInfo?: PersonalTaxProfile
): IrpfSummary => {
  const totalBrutoTodosPagadores = getTotalGrossAllPayers(pagadores);
  const totalRendimientoNetoTodosPagadores = getTotalNetWorkIncomeAllPayers(pagadores);
  const totalIrpf = getTotalIrpfAllPayers(pagadores);

  const { lastDayOfYear } = getCurrentYearBounds();
  const annualGross = Number(pagadorFuturo.annualGross);
  const totalBrutoFuturo = calculateTotalForPeriod(
    pagadorFuturo.startDate,
    lastDayOfYear,
    Number.isFinite(annualGross) ? annualGross : 0,
    pagadorFuturo.payPeriods ?? 12,
    false,
    undefined,
    false
  );
  const socialSecurityFuturo = calculateSocialSecurityForPeriod(
    pagadorFuturo.startDate,
    lastDayOfYear,
    Number.isFinite(annualGross) ? annualGross : 0,
    pagadorFuturo.payPeriods ?? 12,
    false,
    undefined,
    false,
    false,
    DEFAULT_SOCIAL_SECURITY_PERCENTAGE
  );
  const totalRendimientoNetoFuturo = Number(
    Math.max(0, totalBrutoFuturo - socialSecurityFuturo).toFixed(2)
  );

  const totalBrutoGeneral = Number((totalBrutoTodosPagadores + totalBrutoFuturo).toFixed(2));
  const totalRendimientoNetoGeneral = Number(
    (totalRendimientoNetoTodosPagadores + totalRendimientoNetoFuturo).toFixed(2)
  );

  return getIrpfSummary(
    totalBrutoGeneral,
    totalIrpf,
    minimoPersonal,
    brackets,
    totalRendimientoNetoGeneral,
    personalInfo
  );
};

export const getRecommendedIrpfPercentageForFuturePayer = (
  pagadores: PayerCalculationInput[],
  pagadorFuturo: FuturePayerCalculationInput,
  desiredPending = 0,
  minimoPersonal = 5550,
  brackets: IrpfBracket[] = IRPF_BRACKETS,
  personalInfo?: PersonalTaxProfile
): FutureIrpfRecommendation => {
  const projectedSummary = getIrpfSummaryWithFuturePayer(
    pagadores,
    pagadorFuturo,
    minimoPersonal,
    brackets,
    personalInfo
  );
  const currentIrpfWithheld = getTotalIrpfAllPayers(pagadores);

  const { lastDayOfYear } = getCurrentYearBounds();
  const annualGross = Number(pagadorFuturo.annualGross);
  const futureGrossForPeriod = calculateTotalForPeriod(
    pagadorFuturo.startDate,
    lastDayOfYear,
    Number.isFinite(annualGross) ? annualGross : 0,
    pagadorFuturo.payPeriods ?? 12,
    false,
    undefined,
    false
  );

  if (futureGrossForPeriod <= 0) {
    return {
      recommendedPercentage: 0,
      futureGrossForPeriod,
      projectedSummary,
      projectedPendingAfterRecommendation: projectedSummary.irpfPendiente,
    };
  }

  const targetFutureWithheld =
    projectedSummary.cuotaIrpfEstimada - desiredPending - currentIrpfWithheld;
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
    projectedSummary.totalRendimientoNeto,
    personalInfo
  );

  return {
    recommendedPercentage,
    futureGrossForPeriod,
    projectedSummary,
    projectedPendingAfterRecommendation: projectedSummaryWithRecommendation.irpfPendiente,
  };
};
