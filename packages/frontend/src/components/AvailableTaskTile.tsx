import { ITask } from "@task-manager/shared";
import useSWRMutation from "swr/mutation";
import TaskTile from "./TaskTile";
import { mutationFetcher } from "../helpers/fetcher";

interface ClaimableTaskTileProps {
  task: ITask;
  workplaceId: string;
  canClaim: boolean;
  canDelete: boolean;
}

export default function ClaimableTaskTile({
  task,
  workplaceId,
  canClaim,
  canDelete,
}: ClaimableTaskTileProps) {
  const { trigger: triggerClaimTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task/${task.id}/claim`,
    mutationFetcher("PATCH"),
  );

  const { trigger: triggerDelteTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task/${task.id}`,
    mutationFetcher("DELETE"),
  );

  return (
    <TaskTile task={task}>
      {canClaim && <button onClick={() => triggerClaimTask()}>Claim</button>}
      {canDelete && <button onClick={() => triggerDelteTask()}>Delete</button>}
    </TaskTile>
  );
}
