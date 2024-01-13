import { ITask } from "@task-manager/shared";
import useSWRMutation from "swr/mutation";
import TaskTile from "./TaskTile";
import { mutationFetcher } from "../helpers/fetcher";
import { mutate } from "swr";

interface ActiveTaskTileProps {
  variant?: "nested" | "default";
  task: ITask;
  workplaceId: string;
}

export default function ActiveTaskTile({
  variant,
  task,
  workplaceId,
}: ActiveTaskTileProps) {
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

  const { trigger: triggerCompleteTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task/${task.id}/complete`,
    mutationFetcher("PATCH", "Task completion"),
    mutationOptions,
  );

  const { trigger: triggerCancelTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task/${task.id}/cancel`,
    mutationFetcher("PATCH", "Task cancellation"),
    mutationOptions,
  );

  return (
    <TaskTile
      variant={variant}
      task={task}
      actions={[
        { id: "complete", title: "Complete" },
        { id: "cancel", title: "Cancel" },
      ]}
      onAction={(actionId) => {
        switch (actionId) {
          case "complete":
            triggerCompleteTask();
            break;
          case "cancel":
            triggerCancelTask();
            break;
        }
      }}
    />
  );
}
