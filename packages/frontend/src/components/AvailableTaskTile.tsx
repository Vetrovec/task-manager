import { ITask } from "@task-manager/shared";
import useSWRMutation from "swr/mutation";
import TaskTile from "./TaskTile";
import { mutationFetcher } from "../helpers/fetcher";
import { mutate } from "swr";

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
