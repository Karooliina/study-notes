import { checkAuth, getNoteDetailsAction } from "../../../actions";
import { DashboardButton } from "@/app/(user-pages)/components/DashboardButton";
import { Badge } from "@/components/ui/badge";

export default async function Note({ params }: { params: { id: string } }) {
  const { user } = await checkAuth();
  const { data: note, error } = await getNoteDetailsAction(params.id);

  if (error) {
    return <div>Error</div>;
  }

  if (!note) {
    return <div>Note not found</div>;
  }

  const createdAt = new Date(note.created_at).toLocaleDateString();

  return (
    <div className="flex-1 flex flex-col gap-12">
      <div>
        <DashboardButton />
      </div>
      <div className="flex flex-col gap-2 justify-center items-center">
        <h2>{note.title}</h2>
        <p>{note.content}</p>
        <p>{createdAt}</p>
        <Badge>{note.source}</Badge>
      </div>
    </div>
  );
}
