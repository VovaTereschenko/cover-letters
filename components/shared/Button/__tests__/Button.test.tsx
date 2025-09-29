import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Button } from "../Button";

describe("Button", () => {
  it("renders button with text", async () => {
    render(<Button>Click me</Button>);

    expect(
      await screen.findByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = await screen.findByRole("button", { name: "Click me" });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", async () => {
    render(<Button disabled>Click me</Button>);

    const button = await screen.findByRole("button", { name: "Click me" });
    expect(button).toBeDisabled();
  });

  it("shows loading state", async () => {
    render(<Button loading>Click me</Button>);

    const button = await screen.findByRole("button");
    expect(button).toBeDisabled();
    expect(await screen.findByLabelText("Loading")).toBeInTheDocument();
  });

  it("renders primary variant by default", async () => {
    render(<Button>Click me</Button>);

    const button = await screen.findByRole("button", { name: "Click me" });
    expect(button).toHaveClass("primary");
  });

  it("renders outlined variant", async () => {
    render(<Button variant="outlined">Click me</Button>);

    const button = await screen.findByRole("button", { name: "Click me" });
    expect(button).toHaveClass("outlined");
  });

  it("renders different sizes", async () => {
    const { rerender } = render(<Button size="small">Click me</Button>);
    let button = await screen.findByRole("button", { name: "Click me" });
    expect(button).toHaveClass("small");

    rerender(<Button size="large">Click me</Button>);
    button = await screen.findByRole("button", { name: "Click me" });
    expect(button).toHaveClass("large");
  });

  it("applies custom className", async () => {
    render(<Button className="custom-button">Click me</Button>);

    const button = await screen.findByRole("button", { name: "Click me" });
    expect(button).toHaveClass("custom-button");
  });
});
