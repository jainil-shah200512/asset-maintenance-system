import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskActionPanel from "../TaskActionPanel";
import API from "../../api/api";
import { getRole } from "../../utils/auth";

jest.mock("../../api/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

jest.mock("../../utils/auth", () => ({
  getRole: jest.fn(),
}));

describe("TaskActionPanel", () => {
  const onRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("manager should see assign form for reported task", async () => {
    getRole.mockReturnValue("MANAGER");

    API.get.mockResolvedValue({
      data: [
        {
          id: 2,
          fullName: "Tech User",
          email: "technician@siemens.com",
        },
      ],
    });

    const task = {
      id: 1,
      status: "REPORTED",
      assignedToEmail: null,
    };

    render(<TaskActionPanel task={task} onRefresh={onRefresh} />);

    expect(await screen.findByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^assign task$/i })).toBeInTheDocument();
  });

  test("manager should see confirm and reject buttons for completed task", async () => {
    getRole.mockReturnValue("MANAGER");
    API.get.mockResolvedValue({ data: [] });

    const task = {
      id: 1,
      status: "COMPLETED",
      assignedToEmail: "technician@siemens.com",
    };

    render(<TaskActionPanel task={task} onRefresh={onRefresh} />);

    expect(await screen.findByRole("button", { name: /confirm task/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reject work/i })).toBeInTheDocument();
  });

  test("technician should see Resume Task for REWORK_REQUIRED", async () => {
    getRole.mockReturnValue("TECHNICIAN");

    const task = {
      id: 1,
      status: "REWORK_REQUIRED",
      assignedToEmail: "technician@siemens.com",
    };

    render(<TaskActionPanel task={task} onRefresh={onRefresh} />);

    expect(await screen.findByRole("button", { name: /resume task/i })).toBeInTheDocument();
  });

  test("reject should require remarks", async () => {
    getRole.mockReturnValue("MANAGER");
    API.get.mockResolvedValue({ data: [] });

    const task = {
      id: 1,
      status: "COMPLETED",
      assignedToEmail: "technician@siemens.com",
    };

    render(<TaskActionPanel task={task} onRefresh={onRefresh} />);

    const rejectButton = await screen.findByRole("button", { name: /reject work/i });
    fireEvent.click(rejectButton);

    expect(
      await screen.findByText(/remarks are required when rejecting completed work/i)
    ).toBeInTheDocument();
  });

  test("manager assign submit should call API", async () => {
    getRole.mockReturnValue("MANAGER");

    API.get.mockResolvedValue({
      data: [
        {
          id: 2,
          fullName: "Tech User",
          email: "technician@siemens.com",
        },
      ],
    });

    API.put.mockResolvedValue({ data: {} });

    const task = {
      id: 1,
      status: "REPORTED",
      assignedToEmail: null,
    };

    render(<TaskActionPanel task={task} onRefresh={onRefresh} />);

    // Wait until the real technician option is rendered
    expect(await screen.findByText(/tech user/i)).toBeInTheDocument();

    const dropdown = screen.getByRole("combobox");
    await userEvent.selectOptions(dropdown, "2");

    fireEvent.change(screen.getByPlaceholderText(/optional remarks/i), {
      target: { value: "Please handle urgently" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^assign task$/i }));

    await waitFor(() => {
      expect(API.put).toHaveBeenCalledWith("/tasks/1/assign", {
        technicianId: 2,
        remarks: "Please handle urgently",
      });
    });

    expect(onRefresh).toHaveBeenCalled();
  });
});
