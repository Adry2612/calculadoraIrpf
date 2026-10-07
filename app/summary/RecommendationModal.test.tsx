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

    expect(screen.getByText("Cálculo completado")).toBeInTheDocument();
    expect(screen.getByText("18%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("bloquea el scroll mientras está abierto y lo restaura al cerrarse", () => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "scroll";

    const props = {
      recommendedPercentage: 18,
      projectedPendingAfterRecommendation: "-300 EUR",
      monthlyNetSelected: "2.200 EUR",
      annualNetSelected: "30.000 EUR",
      onClose: vi.fn(),
    };
    const { rerender } = render(<RecommendationModal {...props} isOpen />);

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.documentElement.style.overflow).toBe("hidden");

    rerender(<RecommendationModal {...props} isOpen={false} />);

    expect(document.body.style.overflow).toBe("auto");
    expect(document.documentElement.style.overflow).toBe("scroll");

    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  });
});
