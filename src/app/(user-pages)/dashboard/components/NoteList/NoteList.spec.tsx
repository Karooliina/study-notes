import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import { NoteList } from "./NotesList";

describe("NoteList", () => {
  const mockNotes = [
    {
      id: "1",
      title: "First Note",
      content: "First Note Content",
      source: "ai" as const,
      created_at: "2024-03-20T10:00:00Z",
      updated_at: "2024-03-20T10:00:00Z",
    },
    {
      id: "2",
      title: "Second Note",
      content: "Second Note Content",
      source: "manual" as const,
      created_at: "2024-03-21T10:00:00Z",
      updated_at: "2024-03-21T10:00:00Z",
    },
  ];

  it("should render list of notes", () => {
    render(<NoteList notes={mockNotes} />);

    expect(screen.getByText("First Note")).toBeInTheDocument();
    expect(screen.getByText("Second Note")).toBeInTheDocument();
  });

  it("should render correct number of NoteListItem components", () => {
    render(<NoteList notes={mockNotes} />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });

  it("should render empty list when no notes provided", () => {
    render(<NoteList notes={[]} />);

    const emptyMessage = screen.getByTestId("no-notes-message");
    expect(emptyMessage).toBeInTheDocument();
  });
});
