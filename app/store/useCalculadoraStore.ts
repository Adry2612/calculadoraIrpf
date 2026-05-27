import { create } from "zustand";
import {
  calculateTotalForPeriod,
  calculateTotalIrpfWithheld,
  getBaseLiquidable,
  getIrpfSummary,
  getTotalGrossAllPayers,
  getTotalIrpfAllPayers,
} from "./calculations";

interface Pagador {
  name: string;
  grossSalary: number;
  irpfPercentage: number;
  startDate: string;
  endDate: string;
  salaryIncludesSocialSecurity?: boolean;
  socialSecurityPercentage?: number;
  annualOtherDeductions?: number;
}

interface PagadorFuturo extends Omit<Pagador, "irpfPercentage" | "endDate"> {
  irpfPercentage?: number;
  endDate?: string;
  payPeriods: 12 | 14;
}

interface PersonalInfo {
  region: string;
  civilStatus: string;
  birthYear: number;
  childrenCount: number;
  discapacidad: boolean;
  ascendientesACargo: boolean;
}

interface CalculadoraStore {
  locale: "es" | "ca" | "gl" | "eu" | "oc";
  setLocale: (locale: "es" | "ca" | "gl" | "eu" | "oc") => void;
  step: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  calculateTotalForPeriod: (startDate: string, endDate: string, annualGrossSalary: number) => number;
  calculateTotalIrpfWithheld: (
    startDate: string,
    endDate: string,
    annualGrossSalary: number,
    irpfPercentage: number
  ) => number;
  getTotalGrossAllPayers: () => number;
  getTotalIrpfAllPayers: () => number;
  getBaseLiquidable: () => number;
  getIrpfSummary: () => {
    totalBruto: number;
    irpfRetenido: number;
    baseLiquidable: number;
    cuotaIrpfEstimada: number;
    irpfPendiente: number;
  };
  datosPersonales: PersonalInfo;
  setDatosPersonales: (data: PersonalInfo) => void;
  pagadores: Pagador[];
  addPagador: (pagador: Pagador) => void;
  pagadorFuturo: PagadorFuturo;
  addPagadorFuturo: (update: (prev: PagadorFuturo) => PagadorFuturo) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
}

export const useCalculadoraStore = create<CalculadoraStore>((set, get) => ({
  locale: "es",
  setLocale: (locale) => set({ locale }),
  step: 1,
  setStep: (step) => set({ step }),
  nextStep: () =>
    set((state) => ({
      step: state.step + 1,
    })),
  prevStep: () =>
    set((state) => ({
      step: Math.max(1, state.step - 1),
    })),
  calculateTotalForPeriod,
  calculateTotalIrpfWithheld,
  getTotalGrossAllPayers: () => getTotalGrossAllPayers(get().pagadores),
  getTotalIrpfAllPayers: () => getTotalIrpfAllPayers(get().pagadores),
  getBaseLiquidable: () => {
    return getBaseLiquidable(get().getTotalGrossAllPayers());
  },
  getIrpfSummary: () => {
    const totalBruto = get().getTotalGrossAllPayers();
    const irpfRetenido = get().getTotalIrpfAllPayers();
    return getIrpfSummary(totalBruto, irpfRetenido);
  },
  datosPersonales: {
    region: "",
    civilStatus: "",
    birthYear: new Date().getFullYear(),
    childrenCount: 0,
    discapacidad: false,
    ascendientesACargo: false,
  },
  setDatosPersonales: (data) => set({ datosPersonales: data }),
  pagadores: [],
  pagadorFuturo: {
    name: "",
    grossSalary: 0,
    startDate: "",
    payPeriods: 12,
  },
  addPagador: (pagador) =>
    set((state) => ({ pagadores: [...state.pagadores, pagador] })),
  addPagadorFuturo: (update) =>
    set((state) => ({ pagadorFuturo: update(state.pagadorFuturo) })),
  updatePersonalInfo: (info) =>
    set((state) => ({
      datosPersonales: { ...state.datosPersonales, ...info },
    })),
}));