import { ITask } from "@task-manager/shared";
import useSWRMutation from "swr/mutation";
import TaskTile from "./TaskTile";
import { mutationFetcher } from "../helpers/fetcher";

interface ActiveTaskTileProps {
  task: ITask;
  workplaceId: string;
}

export default function ActiveTaskTile({
  task,
  workplaceId,
}: ActiveTaskTileProps) {
  const { trigger: triggerCompleteTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task/${task.id}/complete`,
    mutationFetcher("PATCH"),
  );

  const { trigger: triggerCancelTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task/${task.id}/cancel`,
    mutationFetcher("PATCH"),
  );

  return (
    <TaskTile task={task}>
      <button onClick={() => triggerCompleteTask()}>Complete</button>
      <button onClick={() => triggerCancelTask()}>Cancel</button>
    </TaskTile>
  );
}
