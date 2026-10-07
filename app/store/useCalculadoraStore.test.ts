import { beforeEach, describe, expect, it } from "vitest";
import { useCalculadoraStore } from "./useCalculadoraStore";

const initialState = useCalculadoraStore.getState();

describe("useCalculadoraStore persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    useCalculadoraStore.setState(
      {
        ...initialState,
        locale: "es",
        step: 1,
        datosPersonales: {
          ...initialState.datosPersonales,
          region: "",
        },
        pagadores: [],
        pagadorFuturo: {
          name: "",
          grossSalary: 0,
          startDate: "",
          payPeriods: 12,
        },
      },
      true
    );
    useCalculadoraStore.persist.clearStorage();
  });

  it("guarda datos del cálculo y el idioma en localStorage", () => {
    const store = useCalculadoraStore.getState();
    store.setLocale("ca");
    store.updatePersonalInfo({ region: "madrid" });
    store.addPagador({
      name: "Empresa de prueba",
      grossSalary: 42000,
      irpfPercentage: 14,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      payPeriods: 12,
    });

    const saved = JSON.parse(localStorage.getItem("calculadora-irpf") ?? "null");

    expect(saved.state.locale).toBe("ca");
    expect(saved.state.datosPersonales.region).toBe("madrid");
    expect(saved.state.pagadores).toHaveLength(1);
  });

  it("recupera los datos guardados después de rehidratar", async () => {
    const state = useCalculadoraStore.getState();
    localStorage.setItem(
      "calculadora-irpf",
      JSON.stringify({
        state: {
          locale: "gl",
          step: 3,
          datosPersonales: { ...state.datosPersonales, region: "galicia" },
          pagadores: [
            {
              name: "Empresa guardada",
              grossSalary: 38000,
              irpfPercentage: 13,
              startDate: "2026-01-01",
              endDate: "2026-12-31",
              payPeriods: 12,
            },
          ],
          pagadorFuturo: state.pagadorFuturo,
        },
        version: 1,
      })
    );

    await useCalculadoraStore.persist.rehydrate();

    expect(useCalculadoraStore.getState().locale).toBe("gl");
    expect(useCalculadoraStore.getState().step).toBe(3);
    expect(useCalculadoraStore.getState().pagadores[0].name).toBe("Empresa guardada");
  });

  it("empieza un cálculo nuevo, conserva el idioma y actualiza lo guardado", () => {
    localStorage.setItem("otra-preferencia", "conservar");
    useCalculadoraStore.getState().setLocale("eu");
    useCalculadoraStore.getState().setStep(4);
    useCalculadoraStore.getState().updatePersonalInfo({ region: "navarra" });
    useCalculadoraStore.getState().addPagador({
      name: "Empresa de prueba",
      grossSalary: 42000,
      irpfPercentage: 14,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      payPeriods: 12,
    });

    useCalculadoraStore.getState().resetCalculation();
    const current = useCalculadoraStore.getState();
    const saved = JSON.parse(localStorage.getItem("calculadora-irpf") ?? "null");

    expect(current.locale).toBe("eu");
    expect(current.step).toBe(1);
    expect(current.datosPersonales.region).toBe("");
    expect(current.pagadores).toEqual([]);
    expect(saved.state.pagadores).toEqual([]);
    expect(localStorage.getItem("otra-preferencia")).toBe("conservar");
  });
});
