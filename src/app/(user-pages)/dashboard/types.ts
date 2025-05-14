import { NoteListItemDto } from "@/app/types";
import { ZodIssue } from "zod";

export interface DashboardApiResponse {
  data:
    | {
        data: NoteListItemDto[];
      }
    | undefined;
  error: string | ZodIssue[] | undefined;
  status: number;
}

export interface GetNotesQueryParams {
  order?: "asc" | "desc";
}

// View Models
export interface NoteCardViewModel {
  id: string;
  title: string;
  content: string;
  source: "ai" | "manual";
  displayDate: string;
  detailPath: string;
}

// Error Types
export interface DashboardError extends Error {
  digest?: string;
  code?: string;
  status?: number;
}
