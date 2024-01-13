"use client";

import useSWRMutation from "swr/mutation";
import { useUser } from "@/hooks/useUser";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

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
      <div className="flex w-full h-16 px-4 mb-4 justify-between items-center bg-white rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-8">
            <UserCircleIcon />
          </div>
          <div className="text-xl">{user.displayName}</div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/workplaces/list">
            <div className="px-2 py-1 border bg-slate-200 hover:bg-slate-100 rounded-md text-sm">
              Workplaces
            </div>
          </Link>
          <button
            className="px-2 py-1 border bg-slate-200 hover:bg-slate-100 rounded-md text-sm"
            onClick={() => trigger()}
          >
            Logout
          </button>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
