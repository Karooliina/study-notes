import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "../../components/ui/button";

export default async function AuthButton({ user }: { user?: string }) {
  return user ? (
    <div className="flex justify-end items-center w-full gap-4">
      Hey, {user}!
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex justify-end w-full gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
