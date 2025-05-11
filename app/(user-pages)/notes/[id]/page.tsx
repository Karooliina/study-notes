import { checkAuth } from "../../../actions";

export default async function Note({ params }: { params: { id: string } }) {
  const { user } = await checkAuth();

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div>
        <h1 className="text-2xl font-bold">Note {params.id}</h1>
      </div>
    </div>
  );
}
