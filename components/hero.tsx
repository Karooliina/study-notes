export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <h1 className="sr-only">Study Notes</h1>
      <p className="text-2xl font-bold">Study Notes</p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
