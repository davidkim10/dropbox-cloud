import type { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeToggler } from "./ThemeToggler";

interface HeaderProps {}

export const Header: FC<HeaderProps> = ({}) => {
  return (
    <header className="flex items-center justify-between border-b">
      <Link className="flex items-center gap-2" href="/">
        <div className="bg-[#0160fe] w-fit">
          <Image
            src="/dropbox-w.png"
            alt="SimpleCloud"
            width={58}
            height={58}
            className="p-3"
          />
        </div>
        <h1 className="font-bold text-lg">SimpleCloud</h1>
      </Link>

      <div className="px-5 py-2 flex space-x-2 items-center">
        <ThemeToggler />
        <SignedOut>
          <SignInButton afterSignInUrl="/dashboard" mode="modal" />
        </SignedOut>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
};
