import { createNote } from "./notesService";
import { createClient } from "@/utils/supabase/server";
import { CreateNoteDto, NoteDto } from "@/app/types";

// Mock Supabase client
jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

describe("createNote", () => {
  const mockUserId = "user-123";
  const mockCreateNoteData: CreateNoteDto = {
    title: "Test Note",
    content: "Test Content",
    source: "manual",
    source_text: "Original text",
  };

  const mockCreatedNote = {
    id: "note-456",
    title: "Test Note",
    content: "Test Content",
    source: "manual",
    source_text: "Original text",
    created_at: "2024-03-20T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
    user_id: "user-123",
  };

  let mockQueryBuilder: any;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error to prevent error logging during tests
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Create mock query builder
    mockQueryBuilder = {
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };
    (createClient as jest.Mock).mockResolvedValue(mockQueryBuilder);
  });

  afterEach(() => {
    // Restore console.error after each test
    consoleErrorSpy.mockRestore();
  });

  it("should successfully create a note", async () => {
    // Mock successful note creation
    mockQueryBuilder.single.mockResolvedValueOnce({
      data: mockCreatedNote,
      error: null,
    });

    const result = await createNote(mockUserId, mockCreateNoteData);

    // Verify the note was created correctly
    expect(mockQueryBuilder.from).toHaveBeenCalledWith("notes");
    expect(mockQueryBuilder.insert).toHaveBeenCalledWith({
      ...mockCreateNoteData,
      user_id: mockUserId,
    });

    // Verify correct fields were selected
    expect(mockQueryBuilder.select).toHaveBeenCalledWith(`
      id, 
      title, 
      content, 
      source_text, 
      source, 
      created_at, 
      updated_at,
      user_id
    `);

    // Verify returned data structure
    expect(result).toEqual({
      id: mockCreatedNote.id,
      title: mockCreatedNote.title,
      content: mockCreatedNote.content,
      source: mockCreatedNote.source,
      source_text: mockCreatedNote.source_text,
      created_at: mockCreatedNote.created_at,
      updated_at: mockCreatedNote.updated_at,
    });

    // Verify user_id is not included in the result
    expect(result).not.toHaveProperty("user_id");
  });

  it("should throw error when database insert fails", async () => {
    const dbError = { message: "Database error" };
    // Mock database error
    mockQueryBuilder.single.mockResolvedValueOnce({
      data: null,
      error: dbError,
    });

    await expect(createNote(mockUserId, mockCreateNoteData)).rejects.toThrow(
      "Failed to create note"
    );

    // Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error creating note:",
      dbError
    );
  });

  it("should handle AI-generated notes", async () => {
    const aiNoteData: CreateNoteDto = {
      ...mockCreateNoteData,
      source: "ai",
      source_text: "AI generated content",
    };

    const aiCreatedNote = {
      ...mockCreatedNote,
      source: "ai",
      source_text: "AI generated content",
    };

    mockQueryBuilder.single.mockResolvedValueOnce({
      data: aiCreatedNote,
      error: null,
    });

    const result = await createNote(mockUserId, aiNoteData);

    expect(mockQueryBuilder.insert).toHaveBeenCalledWith({
      ...aiNoteData,
      user_id: mockUserId,
    });
    expect(result.source).toBe("ai");
  });

  it("should handle notes without source text", async () => {
    const noteWithoutSourceText: CreateNoteDto = {
      title: "Test Note",
      content: "Test Content",
      source: "manual",
      source_text: null,
    };

    const createdNoteWithoutSourceText = {
      ...mockCreatedNote,
      source_text: null,
    };

    mockQueryBuilder.single.mockResolvedValueOnce({
      data: createdNoteWithoutSourceText,
      error: null,
    });

    const result = await createNote(mockUserId, noteWithoutSourceText);

    expect(mockQueryBuilder.insert).toHaveBeenCalledWith({
      ...noteWithoutSourceText,
      user_id: mockUserId,
    });
    expect(result.source_text).toBeNull();
  });

  it("should validate required fields", async () => {
    const invalidNote = {
      content: "Only content",
    } as CreateNoteDto;

    await expect(createNote(mockUserId, invalidNote)).rejects.toThrow();
  });
});
