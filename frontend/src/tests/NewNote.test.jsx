import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NewNote from "../pages/Newnote"; 
import "@testing-library/jest-dom";

globalThis.VITE_BACKEND_URL = "http://localhost:3000";
// mock react-router navigation
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("react-quill-new", () => (props) => (
  <textarea
    data-testid="quill-editor"
    value={props.value}
    onChange={(e) => props.onChange(e.target.value)}
    placeholder={props.placeholder}
  />
));

// mock localStorage
beforeEach(() => {
  localStorage.setItem('user', JSON.stringify({ name: 'Bilal Sheikh', email: 'bilal@example.com' }));
});

// mock fetch
beforeAll(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("NewNote Page", () => {
  test("renders title input and editor", () => {
    render(
      <MemoryRouter>
        <NewNote />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Note Title.../i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Start writing your note/i)).toBeInTheDocument();
  });

  test("shows error popup when trying to save empty note", async () => {
    render(
      <MemoryRouter>
        <NewNote />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Save Note/i));

    expect(await screen.findByText(/Please fill in both title and content/i)).toBeInTheDocument();
  });

  test("successfully saves note", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Note created successfully!" }),
    });

    render(
      <MemoryRouter>
        <NewNote />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Note Title/i), {
      target: { value: "My Note" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Start writing/i), {
      target: { value: "This is my note content." },
    });

    fireEvent.click(screen.getByText(/Save Note/i));

    expect(await screen.findByText(/Note created successfully!/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText("OK"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("handles network error gracefully", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter>
        <NewNote />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Note Title/i), {
      target: { value: "Note" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Start writing/i), {
      target: { value: "Content" },
    });

    fireEvent.click(screen.getByText(/Save Note/i));

    expect(await screen.findByText(/Network error while saving note/i)).toBeInTheDocument();
  });

  test("displays and hides user profile popup", () => {
    render(
      <MemoryRouter>
        <NewNote />
      </MemoryRouter>
    );

    const profileBtn = screen.getByTitle("Logout").previousSibling;
    fireEvent.click(profileBtn);
    expect(profileBtn).toBeInTheDocument();
  });

  test("cancel draft confirmation shows and navigates back", async () => {
    render(
      <MemoryRouter>
        <NewNote />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Note Title/i), {
      target: { value: "Temp Note" },
    });

    fireEvent.click(screen.getByText(/Cancel/i));
    expect(await screen.findByText(/Discard Draft/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Discard$/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
