import { fireEvent, render, screen } from "@testing-library/react";
import { NoteListItem } from "./NoteListItem";
import { format } from "date-fns";

describe("NoteListItem", () => {
  const mockNote = {
    id: "1",
    title: "Test Note",
    content: "Test Content",
    source: "ai" as const,
    created_at: "2024-03-20T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
  };

  const mockLongNote = {
    ...mockNote,
    title:
      "A very long title that should be truncated in the UI because it exceeds the maximum length",
    content:
      "A very long content that should be truncated in the UI. This content is deliberately long to test the truncation functionality of our component. We want to make sure that long text is handled gracefully.",
  };

  it("should correctly transform and display note data", () => {
    render(<NoteListItem note={mockNote} />);

    // Check if title is rendered
    expect(screen.getByText("Test Note")).toBeInTheDocument();

    // Check if content is rendered
    expect(screen.getByText("Test Content")).toBeInTheDocument();

    // Check if date is correctly formatted
    const formattedDate = format(new Date(mockNote.created_at), "PPP");
    expect(screen.getByText(`Created on ${formattedDate}`)).toBeInTheDocument();

    // Check if link has correct href
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/notes/${mockNote.id}`);
  });

  it("should render correct link with proper href", () => {
    render(<NoteListItem note={mockNote} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/notes/${mockNote.id}`);
  });

  it("should truncate long content", () => {
    render(<NoteListItem note={mockLongNote} />);

    const contentElement = screen.getByText(mockLongNote.content);
    expect(contentElement).toHaveClass("content");
  });

  it("should render AI source badge for AI notes", () => {
    render(<NoteListItem note={mockNote} />);

    const badge = screen.getByText("AI Generated");
    expect(badge).toBeInTheDocument();
  });

  it("should render Manual source badge for manual notes", () => {
    render(<NoteListItem note={{ ...mockNote, source: "manual" }} />);

    const badge = screen.getByText("Manual");
    expect(badge).toBeInTheDocument();
  });

  it("should format date in a human-readable format", () => {
    const customDate = "2024-01-15T08:30:00Z";
    render(<NoteListItem note={{ ...mockNote, created_at: customDate }} />);

    const expectedDate = format(new Date(customDate), "PPP");
    expect(screen.getByText(`Created on ${expectedDate}`)).toBeInTheDocument();
  });

  it("should have hover state styles", () => {
    render(<NoteListItem note={mockNote} />);

    const card = screen.getByTestId("note-list-card");
    expect(card).toHaveClass("hover:bg-muted/50");
  });
});
