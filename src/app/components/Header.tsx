import Link from "next/link";
import HeaderAuth from "@/app/components/HeaderAuth";
import { checkAuth } from "@/app/actions";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";

export const Header = async () => {
  const { user } = await checkAuth();

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
        <Link
          href="/"
          className="font-bold text-xl text-nowrap hover:text-foreground/80"
        >
          Study Notes
        </Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <HeaderAuth user={user?.email} />
        </div>
      </div>
    </nav>
  );
};
