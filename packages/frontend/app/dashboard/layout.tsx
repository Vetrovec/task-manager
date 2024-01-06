"use client";

import useSWRMutation from "swr/mutation";
import { useUser } from "../hooks/useUser";
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

export default function DashboardLayout({
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
    <div className="h-full p-4">
      <div className="flex h-full gap-4">
        <div className="w-28 h-full py-4 bg-blue-500 rounded-xl">
          <Link href="/dashboard">
            <div className="text-center text-white">Dashboard</div>
          </Link>
        </div>
        <div className="flex flex-col flex-auto gap-4">
          <div className="flex w-full h-16 px-4 justify-between items-center bg-white rounded-xl">
            <div className="text-xl">{user.displayName}</div>
            <button className="text-sm" onClick={() => trigger()}>
              Logout
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
