import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApplicationsList } from "../ApplicationsList";
import { render } from "../../../test-utils/renderWithProviders";
import {
  MOCK_APPLICATIONS,
  createMockRouter,
} from "../../../test-utils/mockData";

const mockRouter = createMockRouter();

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/test-path",
  useSearchParams: () => new URLSearchParams(),
}));

const mockApplications = MOCK_APPLICATIONS.pair;

describe("ApplicationsList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  it("renders header with Applications title", async () => {
    render(<ApplicationsList initialApplications={mockApplications} />);

    expect(await screen.findByText("Applications")).toBeInTheDocument();
  });

  it("renders Create New button", async () => {
    render(<ApplicationsList initialApplications={mockApplications} />);

    const createButtons = await screen.findAllByText("Create New");
    expect(createButtons).toHaveLength(2); // header +  "hit your goal section"
  });

  it("renders Hit Your Goal section", async () => {
    render(<ApplicationsList initialApplications={mockApplications} />);

    expect(await screen.findByText("Hit your goal")).toBeInTheDocument();
    expect(
      await screen.findByText(
        /Generate and send out couple more job applications/i
      )
    ).toBeInTheDocument();
  });

  it("renders progress indicator", async () => {
    render(<ApplicationsList initialApplications={mockApplications} />);

    expect(await screen.findByRole("progressbar")).toBeInTheDocument();
    expect(await screen.findByText("0 out of 5")).toBeInTheDocument();
  });

  it("renders without applications when empty array provided", () => {
    render(<ApplicationsList initialApplications={[]} />);

    expect(screen.getByText("Applications")).toBeInTheDocument();
    const createButtons = screen.getAllByText("Create New");
    expect(createButtons).toHaveLength(2);
  });

  it("accepts initialApplications prop for proper initialization", async () => {
    render(<ApplicationsList initialApplications={mockApplications} />);

    expect(await screen.findByText("Applications")).toBeInTheDocument();
  });

  it("has proper semantic structure", async () => {
    render(<ApplicationsList initialApplications={mockApplications} />);

    const progressbar = await screen.findByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "5");
    expect(progressbar).toHaveAttribute("aria-valuenow", "0");
  });

  describe("Accessibility", () => {
    it("has proper heading structure", async () => {
      render(<ApplicationsList initialApplications={mockApplications} />);

      const mainHeading = await screen.findByRole("heading", { level: 1 });
      expect(mainHeading).toHaveTextContent("Applications");

      const goalHeading = await screen.findByRole("heading", { level: 2 });
      expect(goalHeading).toHaveTextContent("Hit your goal");
    });

    it("has accessible progress indicator", async () => {
      render(<ApplicationsList initialApplications={mockApplications} />);

      const progressbar = await screen.findByRole("progressbar");
      expect(progressbar).toHaveAttribute(
        "aria-label",
        "Progress: 0 out of 5 applications completed"
      );
    });

    it("has accessible buttons", async () => {
      render(<ApplicationsList initialApplications={mockApplications} />);

      const createButtons = await screen.findAllByRole("button", {
        name: "Create New",
      });
      expect(createButtons).toHaveLength(2);
      createButtons.forEach((button) => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe("User Interactions", () => {
    it("allows interaction with Create New buttons", async () => {
      const user = userEvent.setup();
      render(<ApplicationsList initialApplications={mockApplications} />);

      const createButtons = await screen.findAllByRole("button", {
        name: "Create New",
      });

      await user.hover(createButtons[0]);
      expect(createButtons[0]).toBeInTheDocument();
    });
  });
});
