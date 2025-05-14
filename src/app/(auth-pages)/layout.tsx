export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl flex flex-1 flex-col justify-center">
      {children}
    </div>
  );
}
