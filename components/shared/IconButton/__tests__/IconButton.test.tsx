import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { IconButton } from "../IconButton";
import { HomeIcon } from "../../../icons";

describe("IconButton", () => {
  it("renders icon button", async () => {
    render(<IconButton icon={<HomeIcon />} aria-label="Home" />);

    expect(
      await screen.findByRole("button", { name: "Home" })
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = jest.fn();
    render(
      <IconButton icon={<HomeIcon />} onClick={handleClick} aria-label="Home" />
    );

    const button = await screen.findByRole("button", { name: "Home" });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", async () => {
    render(<IconButton icon={<HomeIcon />} disabled aria-label="Home" />);

    const button = await screen.findByRole("button", { name: "Home" });
    expect(button).toBeDisabled();
  });

  it("renders different sizes", async () => {
    const { rerender } = render(
      <IconButton icon={<HomeIcon />} size="small" aria-label="Home" />
    );
    let button = await screen.findByRole("button", { name: "Home" });
    expect(button).toHaveClass("small");

    rerender(<IconButton icon={<HomeIcon />} size="large" aria-label="Home" />);
    button = await screen.findByRole("button", { name: "Home" });
    expect(button).toHaveClass("large");
  });

  it("applies custom className", async () => {
    render(
      <IconButton
        icon={<HomeIcon />}
        className="custom-icon-button"
        aria-label="Home"
      />
    );

    const button = await screen.findByRole("button", { name: "Home" });
    expect(button).toHaveClass("custom-icon-button");
  });
});
