"use client";

import useSWRMutation from "swr/mutation";
import { useUser } from "@/hooks/useUser";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Tile from "@/components/Tile";
import Button from "@/components/Button";

async function logout(url: string) {
  try {
    const response = await fetch(url, {
      method: "POST",
    });
    return { success: response.ok };
  } catch {
    return { success: false };
  }
}

export default function WorkplacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUser();

  const { data, trigger } = useSWRMutation("/api/v1/auth/logout", logout);

  if (data?.success) {
    window.location.assign("/");
  }

  return (
    <div className="h-full min-h-screen p-4 bg-slate-300">
      <Tile className="flex w-full h-16 px-4 mb-4 justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8">
            <UserCircleIcon />
          </div>
          <div className="text-xl">{user.displayName}</div>
        </div>
        <div className="flex items-center gap-4">
          <Button as="link" variant="secondary" href="/workplaces/list">
            Workplaces
          </Button>
          <Button variant="secondary" onClick={() => trigger()}>
            Logout
          </Button>
        </div>
      </Tile>
      <div>{children}</div>
    </div>
  );
}
