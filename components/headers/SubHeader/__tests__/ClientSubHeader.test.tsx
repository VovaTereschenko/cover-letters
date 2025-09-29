import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { ClientSubHeader } from "../ClientSubHeader";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ClientSubHeader", () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders applications title", async () => {
    render(<ClientSubHeader />);

    expect(await screen.findByText("Applications")).toBeInTheDocument();
  });

  it("renders create new button", async () => {
    render(<ClientSubHeader />);

    expect(
      await screen.findByRole("button", { name: "Create New" })
    ).toBeInTheDocument();
  });

  it("navigates to new application when create new button is clicked", async () => {
    const user = userEvent.setup();
    render(<ClientSubHeader />);

    const button = await screen.findByRole("button", { name: "Create New" });
    await user.click(button);

    expect(mockPush).toHaveBeenCalledWith("/new-application");
  });
});
