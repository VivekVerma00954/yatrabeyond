import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "@/components/Logo";

// next/link requires a router context — mock it minimally
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Logo component", () => {
  it("renders with full variant by default", () => {
    render(<Logo />);
    expect(screen.getByRole("link", { name: /yatrabeyond/i })).toBeInTheDocument();
  });

  it("has href pointing to home", () => {
    render(<Logo />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("icon variant does not render wordmark text", () => {
    render(<Logo variant="icon" />);
    // The wordmark "YatraBeyond" should not be in the document
    expect(screen.queryByText(/Yatra/)).toBeNull();
  });

  it("wordmark variant does not render icon", () => {
    const { container } = render(<Logo variant="wordmark" />);
    expect(container.querySelector(".logo-icon-slot")).toBeNull();
  });

  it("has accessible name via aria-label", () => {
    render(<Logo />);
    const link = screen.getByLabelText(/yatrabeyond.*home/i);
    expect(link).toBeInTheDocument();
  });
});
