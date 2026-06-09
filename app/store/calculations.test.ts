import { describe, expect, it } from "vitest";
import { getIrpfSummary } from "./calculations";

describe("getIrpfSummary", () => {
  it("reduce la cuota estimada cuando aumenta el minimo personal y familiar", () => {
    const withoutFamily = getIrpfSummary(40000, 5000, 5550, undefined, 40000, {
      region: "madrid",
      birthYear: 1990,
      childrenCount: 0,
      discapacidadGrado: 0,
      ascendientesACargo: false,
    });

    const withFamily = getIrpfSummary(40000, 5000, 5550, undefined, 40000, {
      region: "madrid",
      birthYear: 1990,
      childrenCount: 2,
      discapacidadGrado: 65,
      ascendientesACargo: true,
    });

    expect(withFamily.cuotaIrpfEstimada).toBeLessThan(withoutFamily.cuotaIrpfEstimada);
    expect(withFamily.baseLiquidable).toBeLessThan(withoutFamily.baseLiquidable);
  });

  it("aplica calculo regional foral para Navarra y Pais Vasco", () => {
    const navarraSummary = getIrpfSummary(50000, 0, 5550, undefined, 50000, {
      region: "navarra",
      birthYear: 1988,
      childrenCount: 0,
      discapacidadGrado: 0,
      ascendientesACargo: false,
    });

    const basqueSummary = getIrpfSummary(50000, 0, 5550, undefined, 50000, {
      region: "pais-vasco",
      birthYear: 1988,
      childrenCount: 0,
      discapacidadGrado: 0,
      ascendientesACargo: false,
    });

    expect(navarraSummary.cuotaIrpfEstimada).toBeGreaterThan(0);
    expect(basqueSummary.cuotaIrpfEstimada).toBeGreaterThan(0);
    expect(navarraSummary.cuotaIrpfEstimada).not.toBe(basqueSummary.cuotaIrpfEstimada);
  });
});
