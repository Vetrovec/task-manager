import { ITask } from "@task-manager/shared";
import useSWRMutation from "swr/mutation";
import TaskTile from "./TaskTile";
import { mutationFetcher } from "../helpers/fetcher";
import { mutate } from "swr";

interface ActiveTaskTileProps {
  task: ITask;
  workplaceId: string;
}

export default function ActiveTaskTile({
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
    mutationFetcher("PATCH"),
    mutationOptions,
  );

  const { trigger: triggerCancelTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task/${task.id}/cancel`,
    mutationFetcher("PATCH"),
    mutationOptions,
  );

  return (
    <TaskTile task={task}>
      <div className="flex justify-between items-center">
        <button onClick={() => triggerCompleteTask()}>Complete</button>
        <button onClick={() => triggerCancelTask()}>Cancel</button>
      </div>
    </TaskTile>
  );
}
