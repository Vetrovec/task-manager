"use client";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import useSWR from "swr";
import { IGetMeResponse } from "@task-manager/shared";
import Loading from "@/components/Loading";
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
  const { data, isLoading } = useSWR<IGetMeResponse>(
    "/api/v1/auth/me",
    fetcher,
  );

  return (
    <html lang="en">
      <head>
        <title>Task Manager</title>
        <meta name="description" content="Unicorn University project" />
      </head>
      <body className={inter.className}>
        <ToastContainer position="bottom-right" />
        {isLoading ? (
          <Loading />
        ) : (
          <UserContext.Provider value={data ? { user: data.user } : null}>
            {children}
          </UserContext.Provider>
        )}
      </body>
    </html>
  );
}
