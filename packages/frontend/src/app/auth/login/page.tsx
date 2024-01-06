"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

async function login(
  url: string,
  { arg }: { arg: { email: string; password: string } },
) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: arg.email,
        password: arg.password,
      }),
    });
    return { success: response.ok };
  } catch {
    return { success: false };
  }
}

export default function Login() {
  const { error, data, trigger } = useSWRMutation("/api/v1/auth/login", login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const showLoginError = !!error || (data && !data.success);

  if (data?.success) {
    window.location.assign("/");
  }

  return (
    <>
      <Link
        className="flex justify-center items-center h-14 border bg-white border-black rounded-full focus:outline-none"
        href="/api/v1/auth/google"
      >
        Sign in with Google
      </Link>
      <form
        className="flex flex-col my-8 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          trigger({ email, password });
        }}
      >
        <label>
          <div className="px-2">Email</div>
          <input
            className="w-full h-14 px-2 border border-gray-300 rounded-lg focus:outline-none"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <div className="px-2">Password</div>
          <input
            className="w-full h-14 px-2 border border-gray-300 rounded-lg focus:outline-none"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {showLoginError && (
          <div className="text-red-500">Something went wrong</div>
        )}
        <button className="h-14 rounded-xl text-white bg-indigo-950">
          Login
        </button>
      </form>
      <Link className="text-indigo-950" href="/auth/sign-up">
        Not registered yet? Create a new account
      </Link>
    </>
  );
}
