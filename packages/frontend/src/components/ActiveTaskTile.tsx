import { ITask } from "@task-manager/shared";
import useSWRMutation from "swr/mutation";
import TaskTile from "./TaskTile";
import { addMutateOption, mutationFetcher } from "../helpers/fetcher";

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
  const { trigger: triggerCompleteTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task/${task.id}/complete`,
    mutationFetcher("PATCH", "Task completion"),
    addMutateOption(/\/api\/v1\/workplace\/.*?\/task/),
  );

  const { trigger: triggerCancelTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task/${task.id}/cancel`,
    mutationFetcher("PATCH", "Task cancellation"),
    addMutateOption(/\/api\/v1\/workplace\/.*?\/task/),
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
