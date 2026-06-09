import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RecommendationModal } from "./RecommendationModal";

describe("RecommendationModal", () => {
  it("renderiza contenido principal y permite cerrar", () => {
    const onClose = vi.fn();

    render(
      <RecommendationModal
        isOpen
        recommendedPercentage={18}
        projectedPendingAfterRecommendation="-300 EUR"
        monthlyNetSelected="2.200 EUR"
        annualNetSelected="30.000 EUR"
        onClose={onClose}
      />
    );

    expect(screen.getByText("Calculo completado")).toBeInTheDocument();
    expect(screen.getByText("18%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
