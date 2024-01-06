import { ITask } from "@task-manager/shared";
import useSWRMutation from "swr/mutation";
import TaskTile from "./TaskTile";
import { mutationFetcher } from "../helpers/fetcher";
import { mutate } from "swr";

interface ClaimableTaskTileProps {
  task: ITask;
  workplaceId: string;
  canDelete: boolean;
}

export default function ClaimableTaskTile({
  task,
  workplaceId,
  canDelete,
}: ClaimableTaskTileProps) {
  const mutationOptions = {
    onSuccess: () =>
      mutate(
        (key) =>
          typeof key === "string" &&
          /\/api\/v1\/workplace\/.*?\/task/.test(key),
        undefined,
        {
          revalidate: true,
        },
      ),
  };
  const { trigger: triggerClaimTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task/${task.id}/claim`,
    mutationFetcher("PATCH"),
    mutationOptions,
  );

  const { trigger: triggerDelteTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task/${task.id}`,
    mutationFetcher("DELETE"),
    mutationOptions,
  );

  return (
    <TaskTile task={task}>
      <div className="flex justify-between items-center">
        <button onClick={() => triggerClaimTask()}>Claim</button>
        {canDelete && (
          <button onClick={() => triggerDelteTask()}>Delete</button>
        )}
      </div>
    </TaskTile>
  );
}
