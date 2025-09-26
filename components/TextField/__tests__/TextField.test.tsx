import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TextField } from "../TextField";

describe("TextField", () => {
  it("renders input variant correctly", () => {
    render(
      <TextField
        variant="input"
        label="Job title"
        placeholder="Product manager"
      />
    );

    expect(screen.getByLabelText("Job title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Product manager")).toBeInTheDocument();
  });

  it("renders textarea variant correctly", () => {
    render(
      <TextField
        variant="textarea"
        label="Additional information"
        placeholder="Why do you want to work here?"
        rows={6}
      />
    );

    const textarea = screen.getByLabelText("Additional information");
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveAttribute("rows", "6");
  });

  it("shows required asterisk when required prop is true", () => {
    render(<TextField variant="input" label="Job title" required />);

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("calls onChange when value changes", () => {
    const mockOnChange = jest.fn();

    render(
      <TextField variant="input" label="Job title" onChange={mockOnChange} />
    );

    const input = screen.getByLabelText("Job title");
    fireEvent.change(input, { target: { value: "Product Manager" } });

    expect(mockOnChange).toHaveBeenCalledWith("Product Manager");
  });

  it("shows error state correctly", () => {
    render(
      <TextField
        variant="input"
        label="Job title"
        error
        helperText="This field is required"
      />
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("handles disabled state correctly", () => {
    render(
      <TextField
        variant="input"
        label="Job title"
        disabled
        value="Disabled field"
      />
    );

    const input = screen.getByLabelText("Job title");
    expect(input).toBeDisabled();
    expect(input).toHaveValue("Disabled field");
  });

  it("supports different input types", () => {
    render(<TextField variant="input" label="Email" type="email" />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("type", "email");
  });

  it("shows helper text when provided", () => {
    render(
      <TextField
        variant="input"
        label="Password"
        helperText="Must be at least 8 characters"
      />
    );

    expect(
      screen.getByText("Must be at least 8 characters")
    ).toBeInTheDocument();
  });

  it("calls onFocus and onBlur handlers", () => {
    const mockOnFocus = jest.fn();
    const mockOnBlur = jest.fn();

    render(
      <TextField
        variant="input"
        label="Job title"
        onFocus={mockOnFocus}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByLabelText("Job title");

    fireEvent.focus(input);
    expect(mockOnFocus).toHaveBeenCalled();

    fireEvent.blur(input);
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("forwards ref correctly for input", () => {
    const ref = jest.fn();

    render(<TextField ref={ref} variant="input" label="Job title" />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it("forwards ref correctly for textarea", () => {
    const ref = jest.fn();

    render(<TextField ref={ref} variant="textarea" label="Description" />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement));
  });

  it("applies custom className", () => {
    render(
      <TextField variant="input" label="Job title" className="custom-field" />
    );

    const input = screen.getByLabelText("Job title");
    expect(input).toHaveClass("custom-field");
  });

  it("shows character count when maxSymbols is set for textarea", () => {
    render(
      <TextField
        variant="textarea"
        label="Description"
        maxSymbols={100}
        value="Test content"
      />
    );

    expect(screen.getByText("12/100")).toBeInTheDocument();
  });

  it("shows character count with helper text", () => {
    render(
      <TextField
        variant="textarea"
        label="Description"
        maxSymbols={100}
        value="Test"
        helperText="Please describe yourself"
      />
    );

    expect(screen.getByText("Please describe yourself")).toBeInTheDocument();
    expect(screen.getByText("4/100")).toBeInTheDocument();
  });

  it("shows error state when maxSymbols is exceeded", () => {
    render(
      <TextField
        variant="textarea"
        label="Description"
        maxSymbols={10}
        value="This is a very long text that exceeds the limit"
      />
    );

    const textarea = screen.getByLabelText("Description");
    expect(textarea).toHaveClass("error");

    // Check if the character count shows exceeded state
    const charCountSpan = screen.getByText(/47\/10/);
    expect(charCountSpan).toBeInTheDocument();
  });

  it("shows character count as 0/max when no value", () => {
    render(
      <TextField variant="textarea" label="Description" maxSymbols={50} />
    );

    expect(screen.getByText("0/50")).toBeInTheDocument();
  });
});
