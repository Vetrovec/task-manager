"use client";

import useSWRMutation from "swr/mutation";
import { useUser } from "../hooks/useUser";

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
    <div>
      <div>Hello, {user.displayName}!</div>
      <button onClick={() => trigger()}>Logout</button>
      <div>{children}</div>
    </div>
  );
}
