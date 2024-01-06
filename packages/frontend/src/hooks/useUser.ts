import { redirect } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export function useUser() {
  const userContext = useContext(UserContext);
  const user = userContext?.user;

  if (!user) {
    redirect("/auth/login");
  }

  return user;
}
