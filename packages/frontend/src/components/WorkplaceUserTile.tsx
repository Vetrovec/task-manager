import Tile from "@/components/Tile";
import { IUser, UserWorkplaceRole } from "@task-manager/shared";
import useSWRMutation from "swr/mutation";
import { mutationFetcher } from "../helpers/fetcher";

interface WorkplaceUserTileProps {
  user: IUser;
  role: UserWorkplaceRole;
  workplaceId: string;
  canDelete: boolean;
}

export default function WorkplaceUserTile({
  user,
  role,
  workplaceId,
  canDelete,
}: WorkplaceUserTileProps) {
  const { trigger: triggerDelteTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/user/${user.id}`,
    mutationFetcher("DELETE"),
  );

  return (
    <Tile>
      <p className="text-lg font-semibold">{user.displayName}</p>
      <p className="text-sm font-medium">{user.email}</p>
      <p className="text-sm font-medium text-gray-500">{role}</p>
      {canDelete && <button onClick={() => triggerDelteTask()}>Delete</button>}
    </Tile>
  );
}
