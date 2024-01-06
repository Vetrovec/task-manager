"use client";

import "./globals.css";
import { Poppins } from "next/font/google";
import useSWR from "swr";
import { IGetMeResponse } from "@task-manager/shared";
import { fetcher } from "../helpers/fetcher";
import { UserContext } from "../contexts/UserContext";
import Loading from "../components/Loading";

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
