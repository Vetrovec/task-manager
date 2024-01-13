import { ITask } from "@task-manager/shared";
import useSWRMutation from "swr/mutation";
import TaskTile from "./TaskTile";
import { addMutateOption, mutationFetcher } from "../helpers/fetcher";

interface ClaimableTaskTileProps {
  variant?: "nested" | "default";
  task: ITask;
  workplaceId: string;
  canDelete: boolean;
}

export default function ClaimableTaskTile({
  variant,
  task,
  workplaceId,
  canDelete,
}: ClaimableTaskTileProps) {
  const { trigger: triggerClaimTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task/${task.id}/claim`,
    mutationFetcher("PATCH", "Task claim"),
    addMutateOption(/\/api\/v1\/workplace\/.*?\/task/),
  );

  const { trigger: triggerDelteTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task/${task.id}`,
    mutationFetcher("DELETE", "Task deletion"),
    addMutateOption(/\/api\/v1\/workplace\/.*?\/task/),
  );

  return (
    <TaskTile
      variant={variant}
      task={task}
      actions={[
        { id: "claim", title: "Claim" },
        ...(canDelete ? [{ id: "delete", title: "Delete" }] : []),
      ]}
      onAction={(actionId) => {
        switch (actionId) {
          case "claim":
            triggerClaimTask();
            break;
          case "delete":
            triggerDelteTask();
            break;
        }
      }}
    />
  );
}
