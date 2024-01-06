import Tile from "@/components/Tile";
import { IUser, UserWorkplaceRole } from "@task-manager/shared";
import useSWRMutation from "swr/mutation";
import { mutationFetcher } from "../helpers/fetcher";

interface WorkplaceUserTileProps {
  user: IUser;
  role: UserWorkplaceRole;
  workplaceId: string;
  canManage: boolean;
}

export default function WorkplaceUserTile({
  user,
  role,
  workplaceId,
  canManage,
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
    <Tile>
      <p className="text-lg font-semibold">{user.displayName}</p>
      <p className="text-sm font-medium">{user.email}</p>
      <p className="text-sm font-medium text-gray-500">{role}</p>
      {canManage && (
        <div className="flex justify-between items-center">
          <button onClick={() => triggerPay({ userId: user.id })}>Pay</button>
          <button onClick={() => triggerDeleteTask()}>Delete</button>
        </div>
      )}
    </Tile>
  );
}
