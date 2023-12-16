"use client";

import Link from "next/link";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

async function signup(
  url: string,
  { arg }: { arg: { displayName: string; email: string; password: string } },
) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: arg.email,
        displayName: arg.displayName,
        password: arg.password,
      }),
    });
    return { success: response.ok };
  } catch {
    return { success: false };
  }
}

export default function SignUp() {
  const { error, data, trigger } = useSWRMutation(
    "/api/v1/auth/signup",
    signup,
  );

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const showLoginError = !!error || (data && !data.success);

  if (data?.success) {
    window.location.assign("/");
  }

  return (
    <>
      <Link
        className="flex justify-center items-center h-14 border border-black rounded-full"
        href="/api/v1/auth/google"
      >
        Sign up with google
      </Link>
      <form
        className="flex flex-col my-8 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          trigger({ email, displayName, password });
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
          <div className="px-2">Display Name</div>
          <input
            className="w-full h-14 px-2 border border-gray-300 rounded-lg focus:outline-none"
            type="text"
            placeholder="Enter your display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
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
        <label>
          <div className="px-2">Repeat Password</div>
          <input
            className="w-full h-14 px-2 border border-gray-300 rounded-lg focus:outline-none"
            type="password"
            placeholder="Enter your password again"
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
          />
        </label>
        {showLoginError && (
          <div className="text-red-500">Something went wrong</div>
        )}
        <button
          className="h-14 rounded-xl text-white bg-indigo-950 disabled:opacity-50"
          disabled={!password || password !== passwordAgain}
        >
          Sign Up
        </button>
      </form>
      <Link className="text-indigo-950" href="/auth/login">
        Already registered? Login
      </Link>
    </>
  );
}
