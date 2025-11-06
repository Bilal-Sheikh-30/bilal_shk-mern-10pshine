global.import = { meta: { env: { VITE_BACKEND_URL: "http://localhost:3000" } } };
globalThis.VITE_BACKEND_URL = "http://localhost:3000";

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EditNote from "../pages/EditNote";

const backendURL = "http://localhost:3000";
// Mock ReactQuill
jest.mock("react-quill-new", () => () => <div data-testid="quill-editor" />);

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "123" }),
}));

describe("EditNote Component", () => {
  const mockNote = {
    _id: "123",
    title: "Sample Note",
    content: "<p>Sample content</p>",
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-10-10T00:00:00Z",
  };

  beforeEach(() => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Bilal",
        email: "bilal@example.com",
        signupDate: "2024-05-01",
      })
    );

    global.fetch = jest.fn((url, options) => {
      if (url === `${backendURL}/notes/123`) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockNote),
        });
      }
      if (url === `${backendURL}/notes/edit/123`) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: "Updated successfully" }),
        });
      }
      if (url === `${backendURL}/auth/logout`) {
        return Promise.resolve({ ok: true });
      }
      return Promise.reject(new Error("Unknown URL"));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={["/editNote/123"]}>
        <Routes>
          <Route path="/editNote/:id" element={<EditNote />} />
        </Routes>
      </MemoryRouter>
    );

  test("renders loading text initially", async () => {
    renderComponent();
    expect(screen.getByText(/Loading note/i)).toBeInTheDocument();
  });

  test("fetches and displays note data", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockNote.title)).toBeInTheDocument();
      expect(screen.getByTestId("quill-editor")).toBeInTheDocument();
    });
  });

  test("shows popup if trying to save empty title or content", async () => {
    renderComponent();
    await waitFor(() => screen.getByDisplayValue(mockNote.title));

    const titleInput = screen.getByPlaceholderText("Note Title...");
    fireEvent.change(titleInput, { target: { value: "" } });

    const saveButton = screen.getByText(/Save Changes/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Please fill in both title and content/i)
      ).toBeInTheDocument();
    });
  });

  test("opens save confirmation when valid changes are made", async () => {
    renderComponent();
    await waitFor(() => screen.getByDisplayValue(mockNote.title));

    const titleInput = screen.getByPlaceholderText("Note Title...");
    fireEvent.change(titleInput, { target: { value: "Updated Note" } });

    const saveButton = screen.getByText(/Save Changes/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Save Changes\?/i)).toBeInTheDocument();
    });
  });

  test("confirms save and shows success popup", async () => {
    renderComponent();
    await waitFor(() => screen.getByDisplayValue(mockNote.title));

    fireEvent.change(screen.getByPlaceholderText("Note Title..."), {
      target: { value: "Updated Note" },
    });

    fireEvent.click(screen.getByText(/Save Changes/i));
    await waitFor(() => screen.getByText(/Save Changes\?/i));

    fireEvent.click(screen.getByText(/^Save$/)); // Confirm save

    await waitFor(() => {
      expect(screen.getByText(/Note updated successfully/i)).toBeInTheDocument();
    });
  });

  test("shows cancel confirmation when unsaved changes exist", async () => {
    renderComponent();
    await waitFor(() => screen.getByDisplayValue(mockNote.title));

    fireEvent.change(screen.getByPlaceholderText("Note Title..."), {
      target: { value: "Unsaved change" },
    });

    fireEvent.click(screen.getByText(/Cancel/i));
    await waitFor(() => {
      expect(screen.getByText(/Discard Changes\?/i)).toBeInTheDocument();
    });
  });

  test("logs out user and redirects to login", async () => {
    renderComponent();
    await waitFor(() => screen.getByDisplayValue(mockNote.title));

    fireEvent.click(screen.getByTitle("Logout"));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
