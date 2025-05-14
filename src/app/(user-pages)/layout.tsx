import { DashboardButton } from "./components/DashboardButton";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-1 flex-col">
      <header className="container mx-auto px-4 py-4">
        <DashboardButton />
      </header>
      {children}
    </div>
  );
}
