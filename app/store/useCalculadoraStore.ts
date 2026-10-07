import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
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
  payPeriods: 12 | 14;
  extraPaymentsProrated?: boolean;
  extraPaymentMonths?: [number, number];
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
  discapacidadGrado: 0 | 33 | 65;
  ascendientesACargo: boolean;
  retentionPreference: "devolucion-segura" | "blindado" | "ajustado";
}

interface CalculadoraStore {
  locale: "es" | "ca" | "gl" | "eu" | "oc";
  setLocale: (locale: "es" | "ca" | "gl" | "eu" | "oc") => void;
  resetCalculation: () => void;
  step: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  calculateTotalForPeriod: (
    startDate: string,
    endDate: string,
    annualGrossSalary: number,
    payPeriods?: 12 | 14,
    extraPaymentsProrated?: boolean,
    extraPaymentMonths?: [number, number],
    capToCurrentMonth?: boolean
  ) => number;
  calculateTotalIrpfWithheld: (
    startDate: string,
    endDate: string,
    annualGrossSalary: number,
    irpfPercentage: number,
    payPeriods?: 12 | 14,
    extraPaymentsProrated?: boolean,
    extraPaymentMonths?: [number, number],
    capToCurrentMonth?: boolean
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

const serverStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useCalculadoraStore = create<CalculadoraStore>()(
  persist(
    (set, get) => ({
      locale: "es",
      setLocale: (locale) => set({ locale }),
      resetCalculation: () =>
        set((state) => ({
          step: 1,
          datosPersonales: {
            region: "",
            civilStatus: "",
            birthYear: new Date().getFullYear(),
            childrenCount: 0,
            discapacidad: false,
            discapacidadGrado: 0,
            ascendientesACargo: false,
            retentionPreference: "ajustado",
          },
          pagadores: [],
          pagadorFuturo: {
            name: "",
            grossSalary: 0,
            startDate: "",
            payPeriods: 12,
          },
          locale: state.locale,
        })),
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
        const datosPersonales = get().datosPersonales;
        return getIrpfSummary(
          totalBruto,
          irpfRetenido,
          5550,
          undefined,
          totalBruto,
          datosPersonales
        );
      },
      datosPersonales: {
        region: "",
        civilStatus: "",
        birthYear: new Date().getFullYear(),
        childrenCount: 0,
        discapacidad: false,
        discapacidadGrado: 0,
        ascendientesACargo: false,
        retentionPreference: "ajustado",
      },
      setDatosPersonales: (data) => set({ datosPersonales: data }),
      pagadores: [],
      pagadorFuturo: {
        name: "",
        grossSalary: 0,
        startDate: "",
        payPeriods: 12,
      },
      addPagador: (pagador) => set((state) => ({ pagadores: [...state.pagadores, pagador] })),
      addPagadorFuturo: (update) =>
        set((state) => ({ pagadorFuturo: update(state.pagadorFuturo) })),
      updatePersonalInfo: (info) =>
        set((state) => ({
          datosPersonales: { ...state.datosPersonales, ...info },
        })),
    }),
    {
      name: "calculadora-irpf",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? serverStorage : localStorage
      ),
      partialize: (state) => ({
        locale: state.locale,
        step: state.step,
        datosPersonales: state.datosPersonales,
        pagadores: state.pagadores,
        pagadorFuturo: state.pagadorFuturo,
      }),
      skipHydration: true,
      version: 1,
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.error("No se pudo recuperar la simulacion guardada localmente.", error);
        }
      },
    }
  )
);
