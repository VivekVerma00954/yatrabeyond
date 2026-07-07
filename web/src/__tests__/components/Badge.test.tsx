import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("Badge component", () => {
  it("renders children", () => {
    render(<Badge>Shaivism</Badge>);
    expect(screen.getByText("Shaivism")).toBeInTheDocument();
  });

  it("applies default variant classes", () => {
    const { container } = render(<Badge>Test</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-brand-cream");
  });

  it("applies terracotta variant classes", () => {
    const { container } = render(<Badge variant="terracotta">Test</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-brand-terracotta");
  });
});
