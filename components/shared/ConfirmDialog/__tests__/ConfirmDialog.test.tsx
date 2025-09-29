import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ConfirmDialog } from "../ConfirmDialog";

describe("ConfirmDialog", () => {
  const defaultProps = {
    isOpen: true,
    title: "Confirm Action",
    message: "Are you sure you want to proceed?",
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with title and message when open", async () => {
    render(<ConfirmDialog {...defaultProps} />);

    expect(await screen.findByText("Confirm Action")).toBeInTheDocument();
    expect(
      await screen.findByText("Are you sure you want to proceed?")
    ).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("Confirm Action")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Are you sure you want to proceed?")
    ).not.toBeInTheDocument();
  });

  it("renders default button text", async () => {
    render(<ConfirmDialog {...defaultProps} />);

    expect(
      await screen.findByRole("button", { name: "Yes" })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "No" })
    ).toBeInTheDocument();
  });

  it("renders custom button text", async () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        confirmText="Delete"
        cancelText="Cancel"
      />
    );

    expect(
      await screen.findByRole("button", { name: "Delete" })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "Cancel" })
    ).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog {...defaultProps} />);

    const confirmButton = await screen.findByRole("button", { name: "Yes" });
    await user.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog {...defaultProps} />);

    const cancelButton = await screen.findByRole("button", { name: "No" });
    await user.click(cancelButton);

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it("has proper dialog role and accessibility attributes", async () => {
    render(<ConfirmDialog {...defaultProps} />);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");
  });

  it("focuses dialog when opened", async () => {
    render(<ConfirmDialog {...defaultProps} />);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveFocus();
  });

  it("calls onCancel when Escape key is pressed", async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog {...defaultProps} />);

    await user.keyboard("{Escape}");

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it("applies correct button variants", async () => {
    render(<ConfirmDialog {...defaultProps} />);

    const cancelButton = await screen.findByRole("button", { name: "No" });
    const confirmButton = await screen.findByRole("button", { name: "Yes" });

    expect(cancelButton).toHaveClass("outlined");
    expect(confirmButton).toHaveClass("primary");
  });
});
