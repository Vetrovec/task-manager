import Tile from "@/components/Tile";
import { IUser, UserWorkplaceRole } from "@task-manager/shared";
import useSWRMutation from "swr/mutation";
import { mutationFetcher } from "../helpers/fetcher";
import { ActionTile } from "./ActionTile";

interface WorkplaceUserTileProps {
  variant?: "nested" | "default";
  canPay: boolean;
  canRemove: boolean;
  isMe: boolean;
  role: UserWorkplaceRole;
  user: IUser;
  workplaceId: string;
}

export default function WorkplaceUserTile({
  variant,
  canPay,
  canRemove,
  isMe,
  role,
  user,
  workplaceId,
}: WorkplaceUserTileProps) {
  const { trigger: triggerDeleteTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/user/${user.id}`,
    mutationFetcher("DELETE"),
  );

  const { trigger: triggerPay } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/payroll`,
    mutationFetcher<{ userId: number }>("POST"),
  );

  return (
    <ActionTile
      variant={variant}
      actions={
        canPay || canRemove
          ? [
              { id: "pay", title: "Pay", disabled: !canPay },
              { id: "remove", title: "Remove", disabled: !canRemove },
            ]
          : []
      }
      onAction={(actionId) => {
        switch (actionId) {
          case "pay":
            triggerPay({ userId: user.id });
            break;
          case "remove":
            triggerDeleteTask();
            break;
        }
      }}
    >
      <p className="text-lg font-semibold">
        {isMe && <span className="text-sm text-blue-500">(You)&nbsp;</span>}
        {user.displayName}
      </p>
      <p className="text-sm font-medium text-gray-500">{role}</p>
    </ActionTile>
  );
}
