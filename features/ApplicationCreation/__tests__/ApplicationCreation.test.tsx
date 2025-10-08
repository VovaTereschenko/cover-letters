import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ApplicationCreation from "../ApplicationCreation";
import { render } from "../../../test-utils/renderWithProviders";
import { useJobApplicationStore } from "@/store/jobApplication";
import { useAppStore } from "@/store/applications";

describe("ApplicationCreation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useJobApplicationStore.getState().clearAll();
    useAppStore.setState((state) => ({
      ...state,
      applications: [],
    }));
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

  it("renders with initial empty state", async () => {
    render(<ApplicationCreation />);

    expect(await screen.findByLabelText(/job title/i)).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: /new application/i })
    ).toBeInTheDocument();
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

  it("triggers API request when form is submitted with valid data", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        coverLetter: "Generated cover letter content",
      }),
    });

    render(<ApplicationCreation />);

    const jobTitleInput = await screen.findByLabelText(/job title/i);
    const companyInput = await screen.findByLabelText(/company/i);
    const skillsInput = await screen.findByLabelText(/i am good at/i);
    const additionalDetailsInput = await screen.findByLabelText(
      /additional details/i
    );

    await user.type(jobTitleInput, "Software Engineer");
    await user.type(companyInput, "Tech Corp");
    await user.type(skillsInput, "JavaScript, React, Node.js");
    await user.type(
      additionalDetailsInput,
      "Experienced developer with 5 years in web development"
    );

    const generateButton = await screen.findByRole("button", {
      name: /generate now/i,
    });
    await user.click(generateButton);

    expect(global.fetch).toHaveBeenCalledWith("/api/generate-cover-letter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobTitle: "Software Engineer",
        company: "Tech Corp",
        skills: "JavaScript, React, Node.js",
        additionalDetails:
          "Experienced developer with 5 years in web development",
      }),
      signal: expect.any(AbortSignal),
    });
  });

  it("handles API request failure gracefully", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: "Server error occurred",
      }),
    });

    render(<ApplicationCreation />);

    const jobTitleInput = await screen.findByLabelText(/job title/i);
    const companyInput = await screen.findByLabelText(/company/i);
    const skillsInput = await screen.findByLabelText(/i am good at/i);
    const additionalDetailsInput = await screen.findByLabelText(
      /additional details/i
    );

    await user.type(jobTitleInput, "Software Engineer");
    await user.type(companyInput, "Tech Corp");
    await user.type(skillsInput, "JavaScript, React");
    await user.type(additionalDetailsInput, "Passionate about coding");

    const generateButton = await screen.findByRole("button", {
      name: /generate now/i,
    });
    await user.click(generateButton);

    expect(global.fetch).toHaveBeenCalledWith("/api/generate-cover-letter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobTitle: "Software Engineer",
        company: "Tech Corp",
        skills: "JavaScript, React",
        additionalDetails: "Passionate about coding",
      }),
      signal: expect.any(AbortSignal),
    });

    expect(
      await screen.findByRole("button", {
        name: /generate now/i,
      })
    ).toBeInTheDocument();
  });

  it("does not trigger API request when form validation fails", async () => {
    const user = userEvent.setup();
    render(<ApplicationCreation />);

    const generateButton = await screen.findByRole("button", {
      name: /generate now/i,
    });
    await user.click(generateButton);

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
