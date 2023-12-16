"use client";

import { redirect } from "next/navigation";
import { useUser } from "./hooks/useUser";

export default function Home() {
  useUser();
  redirect("/dashboard");
}
