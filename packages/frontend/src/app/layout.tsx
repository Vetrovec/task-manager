"use client";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import useSWR from "swr";
import { IGetMeResponse } from "@task-manager/shared";
import Spinner from "@/components/Spinner";
import { UserContext } from "@/contexts/UserContext";
import { fetcher } from "@/helpers/fetcher";

const inter = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, error, isLoading } = useSWR<IGetMeResponse>(
    "/api/v1/auth/me",
    fetcher,
    {
      shouldRetryOnError: false,
    },
  );

  return (
    <html lang="en">
      <head>
        <title>Task Manager</title>
        <meta name="description" content="Unicorn University project" />
      </head>
      <body className={inter.className}>
        <ToastContainer position="bottom-right" />
        {isLoading && !data && !error ? (
          <div className="h-screen flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <UserContext.Provider value={data ? { user: data.user } : null}>
            {children}
          </UserContext.Provider>
        )}
      </body>
    </html>
  );
}
