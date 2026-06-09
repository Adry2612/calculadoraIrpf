import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCalculadoraStore } from "../store/useCalculadoraStore";
import { Step1 } from "./Step1";

const initialState = useCalculadoraStore.getState();

const buildCurrentYearPayer = () => {
  const year = new Date().getFullYear();

  return {
    name: "Empresa Test",
    grossSalary: 50000,
    irpfPercentage: 12,
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,
    payPeriods: 12 as const,
  };
};

describe("Step1", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    useCalculadoraStore.setState(
      {
        ...initialState,
        datosPersonales: {
          ...initialState.datosPersonales,
          region: "madrid",
          childrenCount: 0,
          discapacidad: false,
          discapacidadGrado: 0,
          ascendientesACargo: false,
        },
        pagadores: [buildCurrentYearPayer()],
      },
      true
    );
  });

  it("actualiza datos personales y reduce cuota estimada al aumentar minimos familiares", () => {
    const onNext = vi.fn();
    const beforeQuota = useCalculadoraStore.getState().getIrpfSummary().cuotaIrpfEstimada;

    render(<Step1 onNext={onNext} />);

    fireEvent.click(screen.getByRole("button", { name: "Aumentar hijos o descendientes" }));

    const switches = screen.getAllByRole("switch");
    fireEvent.click(switches[0]);

    const allSelects = screen.getAllByRole("combobox");
    fireEvent.change(allSelects[2], { target: { value: "65" } });

    fireEvent.click(switches[1]);

    const personalInfo = useCalculadoraStore.getState().datosPersonales;
    const afterQuota = useCalculadoraStore.getState().getIrpfSummary().cuotaIrpfEstimada;

    expect(personalInfo.childrenCount).toBe(1);
    expect(personalInfo.discapacidad).toBe(true);
    expect(personalInfo.discapacidadGrado).toBe(65);
    expect(personalInfo.ascendientesACargo).toBe(true);
    expect(afterQuota).toBeLessThan(beforeQuota);
  });

  it("ejecuta onNext al pulsar siguiente", () => {
    const onNext = vi.fn();

    render(<Step1 onNext={onNext} />);

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));

    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
