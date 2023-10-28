"use client";

import { GetStatusResponse } from "@task-manager/shared";
import useSWR from "swr";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export default function Home() {
  const { data, error, isLoading } = useSWR<GetStatusResponse>(
    "/api/v1/status",
    fetcher,
  );

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-24">
      <h1 className="text-4xl font-semibold">Task Manager</h1>
      <div className="flex text-center mt-4">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message ?? "unknown"}</p>}
        {data && <p>API Status: {data.status}</p>}
      </div>
    </main>
  );
}
