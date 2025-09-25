import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProgressIndication } from "../ProgressIndication";

describe("ProgressIndication", () => {
  it("renders progress dots for incomplete state", async () => {
    render(<ProgressIndication currentStep={3} />);

    expect(
      await screen.findByText("3/5 applications generated")
    ).toBeInTheDocument();
    expect(await screen.findByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByLabelText("Completed")).not.toBeInTheDocument();
  });

  it("renders checkmark for completed state", async () => {
    render(<ProgressIndication currentStep={5} />);

    expect(
      await screen.findByText("5/5 applications generated")
    ).toBeInTheDocument();
    expect(await screen.findByLabelText("Completed")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("renders exceeded state with checkmark", async () => {
    render(<ProgressIndication currentStep={7} />);

    expect(
      await screen.findByText("7 applications generated")
    ).toBeInTheDocument();
    expect(await screen.findByLabelText("Completed")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("handles singular text correctly", async () => {
    render(<ProgressIndication currentStep={1} />);

    expect(
      await screen.findByText("1/5 application generated")
    ).toBeInTheDocument();
  });

  it("uses custom text props", async () => {
    render(
      <ProgressIndication
        currentStep={2}
        singularText="document created"
        pluralText="documents created"
      />
    );

    expect(
      await screen.findByText("2/5 documents created")
    ).toBeInTheDocument();
  });

  it("uses custom totalSteps", async () => {
    render(<ProgressIndication currentStep={3} totalSteps={10} />);

    expect(
      await screen.findByText("3/10 applications generated")
    ).toBeInTheDocument();
  });

  it("renders correct number of dots", async () => {
    render(<ProgressIndication currentStep={2} totalSteps={4} />);

    const progressbar = await screen.findByRole("progressbar");
    const dots = progressbar.querySelectorAll("li");
    expect(dots).toHaveLength(4);
  });

  it("has correct ARIA attributes", async () => {
    render(<ProgressIndication currentStep={3} />);

    const progressbar = await screen.findByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "3");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "5");
    expect(progressbar).toHaveAttribute(
      "aria-label",
      "Progress: 3 out of 5 applications generated completed"
    );
  });
});
