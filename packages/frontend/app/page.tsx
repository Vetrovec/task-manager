"use client";

import { IGetMeResponse } from "@task-manager/shared";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

async function login(
  url: string,
  { arg }: { arg: { email: string; password: string } },
) {
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: arg.email,
      password: arg.password,
    }),
  });
}

export default function Home() {
  const { mutate } = useSWRConfig();

  const { data, isLoading } = useSWR<IGetMeResponse>(
    "/api/v1/auth/me",
    fetcher,
    { keepPreviousData: false },
  );

  const { trigger } = useSWRMutation("/api/v1/auth/login", login, {
    onSuccess: () => mutate("/api/v1/auth/me"),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-24">
      <h1 className="text-4xl font-semibold">Task Manager</h1>
      <div className="flex mt-4">
        {isLoading && <p>Loading...</p>}
        {!isLoading && !data?.user && (
          <div className="flex flex-col gap-2">
            <a className="text-center" href="/api/v1/auth/google">
              Login with Google
            </a>
            <div className="w-full h-0.5 bg-black" />
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                trigger({ email, password });
              }}
            >
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Login</button>
            </form>
          </div>
        )}
        {data?.user && <p>Hi, {data.user.displayName}</p>}
      </div>
    </main>
  );
}
