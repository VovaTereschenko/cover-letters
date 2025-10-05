import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ApplicationCreation from "../ApplicationCreation";
import { render } from "../../../test-utils/renderWithProviders";

describe("ApplicationCreation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  it("renders the form with all fields", async () => {
    render(<ApplicationCreation />);

    expect(await screen.findByLabelText(/job title/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/company/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/i am good at/i)).toBeInTheDocument();
    expect(
      await screen.findByLabelText(/additional details/i)
    ).toBeInTheDocument();
  });

  it("shows default title text", async () => {
    render(<ApplicationCreation />);

    expect(
      await screen.findByRole("heading", { name: /new application/i })
    ).toBeInTheDocument();
  });

  it("renders generate button initially", async () => {
    render(<ApplicationCreation />);

    expect(
      await screen.findByRole("button", { name: /generate now/i })
    ).toBeInTheDocument();
  });

  it("accepts initialApplicationsCount prop", async () => {
    render(<ApplicationCreation initialApplicationsCount={5} />);

    expect(await screen.findByLabelText(/job title/i)).toBeInTheDocument();
  });

  it("has proper semantic structure", async () => {
    render(<ApplicationCreation />);

    expect(await screen.findByRole("main")).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { level: 1 })
    ).toBeInTheDocument();
  });

  it("allows user interaction with form fields", async () => {
    const user = userEvent.setup();
    render(<ApplicationCreation />);

    const jobTitleInput = await screen.findByLabelText(/job title/i);
    await user.type(jobTitleInput, "Test Job");

    expect(jobTitleInput).toBeInTheDocument();
  });

  describe("Accessibility", () => {
    it("has proper labels for form fields", async () => {
      render(<ApplicationCreation />);

      expect(await screen.findByLabelText(/job title/i)).toBeInTheDocument();
      expect(await screen.findByLabelText(/company/i)).toBeInTheDocument();
      expect(await screen.findByLabelText(/i am good at/i)).toBeInTheDocument();
      expect(
        await screen.findByLabelText(/additional details/i)
      ).toBeInTheDocument();
    });

    it("has proper button accessibility", async () => {
      render(<ApplicationCreation />);

      const generateButton = await screen.findByRole("button", {
        name: /generate now/i,
      });
      expect(generateButton).toBeInTheDocument();
    });
  });
});
