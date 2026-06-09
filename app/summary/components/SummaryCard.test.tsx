import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryCard } from "./SummaryCard";

describe("SummaryCard", () => {
  it("muestra etiqueta de devolucion cuando el valor es negativo", () => {
    render(<SummaryCard label="Resultado" value="-123,45 EUR" />);

    expect(screen.getByText("Resultado")).toBeInTheDocument();
    expect(screen.getByText("A Devolver")).toBeInTheDocument();
  });

  it("muestra etiqueta de pago cuando el valor es positivo", () => {
    render(<SummaryCard label="Resultado" value="123,45 EUR" />);

    expect(screen.getByText("A Pagar")).toBeInTheDocument();
  });
});
