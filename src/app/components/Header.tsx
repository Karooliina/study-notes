import Link from "next/link";
import HeaderAuth from "@/app/components/HeaderAuth";
import { checkAuth } from "@/app/actions";

export const Header = async () => {
  const { user } = await checkAuth();

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <Link
          href="/"
          className="font-bold text-xl text-nowrap hover:text-foreground/80"
        >
          Study Notes
        </Link>
        <HeaderAuth user={user?.email} />
      </div>
    </nav>
  );
};
