import { IUser } from "@task-manager/shared";
import { createContext } from "react";

export type UserContextType = {
  user: IUser;
};

export const UserContext = createContext<UserContextType | null>(null);
UserContext.displayName = "UserContext";
