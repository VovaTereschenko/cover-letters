import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Toast } from "../Toast";

describe("Toast", () => {
  const defaultProps = {
    message: "Test message",
    isVisible: true,
    show: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders toast message when visible and show is true", async () => {
    render(<Toast {...defaultProps} />);

    expect(await screen.findByText("Test message")).toBeInTheDocument();
  });

  it("does not render when not visible", () => {
    render(<Toast {...defaultProps} isVisible={false} />);

    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });

  it("renders with show class when show is true", async () => {
    render(<Toast {...defaultProps} show={true} />);

    const toast = await screen
      .findByText("Test message")
      .then((el) => el.parentElement);
    expect(toast).toHaveClass("show");
  });

  it("renders with hide class when show is false", async () => {
    render(<Toast {...defaultProps} show={false} />);

    const toast = await screen
      .findByText("Test message")
      .then((el) => el.parentElement);
    expect(toast).toHaveClass("hide");
  });

  it("applies correct base classes", async () => {
    render(<Toast {...defaultProps} />);

    const toast = await screen
      .findByText("Test message")
      .then((el) => el.parentElement);
    expect(toast).toHaveClass("toast");
  });
});
