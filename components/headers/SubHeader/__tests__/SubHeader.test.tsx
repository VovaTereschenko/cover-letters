import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { SubHeader } from "../SubHeader";

describe("SubHeader", () => {
  it("renders applications title", async () => {
    render(<SubHeader />);

    expect(await screen.findByText("Applications")).toBeInTheDocument();
  });

  it("renders create new button", async () => {
    render(<SubHeader />);

    expect(
      await screen.findByRole("button", { name: "Create New" })
    ).toBeInTheDocument();
  });

  it("calls onCreateNew when button is clicked", async () => {
    const user = userEvent.setup();
    const onCreateNew = jest.fn();
    render(<SubHeader onCreateNew={onCreateNew} />);

    const button = await screen.findByRole("button", { name: "Create New" });
    await user.click(button);

    expect(onCreateNew).toHaveBeenCalledTimes(1);
  });

  it("does not crash when onCreateNew is not provided", async () => {
    const user = userEvent.setup();
    render(<SubHeader />);

    const button = await screen.findByRole("button", { name: "Create New" });
    await user.click(button);

    expect(button).toBeInTheDocument();
  });
});
