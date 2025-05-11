export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full flex flex-1 flex-col">{children}</div>;
}
