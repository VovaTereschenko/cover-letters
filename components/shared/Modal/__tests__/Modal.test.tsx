import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Modal } from "../Modal";

describe("Modal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal content when open", async () => {
    render(<Modal {...defaultProps} />);

    expect(await screen.findByText("Modal content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<Modal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
  });

  it("renders title when provided", async () => {
    render(<Modal {...defaultProps} title="Test Modal" />);

    expect(await screen.findByText("Test Modal")).toBeInTheDocument();
  });

  it("renders close button by default", async () => {
    render(<Modal {...defaultProps} title="Test Modal" />);

    expect(await screen.findByRole("button")).toBeInTheDocument();
  });

  it("hides close button when showCloseButton is false", async () => {
    render(
      <Modal {...defaultProps} title="Test Modal" showCloseButton={false} />
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} title="Test Modal" />);

    const closeButton = await screen.findByRole("button");
    await user.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when overlay is clicked", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    const overlay = await screen
      .findByRole("dialog")
      .then((dialog) => dialog.parentElement);
    if (overlay) {
      await user.click(overlay);
    }

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when overlay is clicked and closeOnOverlayClick is false", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} closeOnOverlayClick={false} />);

    const overlay = await screen
      .findByRole("dialog")
      .then((dialog) => dialog.parentElement);
    if (overlay) {
      await user.click(overlay);
    }

    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when Escape key is pressed", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    await user.keyboard("{Escape}");

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when Escape key is pressed and closeOnEscape is false", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} closeOnEscape={false} />);

    await user.keyboard("{Escape}");

    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it("renders footer when provided", async () => {
    const footer = <div>Footer content</div>;
    render(<Modal {...defaultProps} footer={footer} />);

    expect(await screen.findByText("Footer content")).toBeInTheDocument();
  });

  it("applies correct size classes", async () => {
    const { rerender } = render(<Modal {...defaultProps} size="small" />);
    let modal = await screen.findByRole("dialog");
    expect(modal).toHaveClass("small");

    rerender(<Modal {...defaultProps} size="large" />);
    modal = await screen.findByRole("dialog");
    expect(modal).toHaveClass("large");
  });

  it("applies custom className", async () => {
    render(<Modal {...defaultProps} className="custom-modal" />);

    const modal = await screen.findByRole("dialog");
    expect(modal).toHaveClass("custom-modal");
  });

  it("has proper accessibility attributes", async () => {
    render(<Modal {...defaultProps} title="Test Modal" />);

    const modal = await screen.findByRole("dialog");
    expect(modal).toHaveAttribute("aria-modal", "true");
    expect(modal).toHaveAttribute("aria-labelledby", "modal-title");
  });
});
