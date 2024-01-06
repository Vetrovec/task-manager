"use client";

import useSWRMutation from "swr/mutation";
import { useUser } from "@/hooks/useUser";

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
        <div className="text-xl">{user.displayName}</div>
        <button className="text-sm" onClick={() => trigger()}>
          Logout
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
}
