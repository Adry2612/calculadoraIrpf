import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryCard } from "./SummaryCard";

describe("SummaryCard", () => {
  it("muestra etiqueta de devolución cuando el valor es negativo", () => {
    render(<SummaryCard label="Resultado" value="-123,45 EUR" />);

    expect(screen.getByText("Resultado")).toBeInTheDocument();
    expect(screen.getByText("A devolver")).toBeInTheDocument();
  });

  it("muestra etiqueta de pago cuando el valor es positivo", () => {
    render(<SummaryCard label="Resultado" value="123,45 EUR" />);

    expect(screen.getByText("A pagar")).toBeInTheDocument();
  });

  it("muestra un estado neutral cuando no hay saldo pendiente", () => {
    render(<SummaryCard label="Resultado" value="0,00 EUR" />);

    expect(screen.getByText("Sin saldo pendiente")).toBeInTheDocument();
  });
});
