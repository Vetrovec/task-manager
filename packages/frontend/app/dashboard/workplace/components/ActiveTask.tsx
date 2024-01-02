import { ITask } from "@task-manager/shared";
import useSWRMutation from "swr/mutation";
import TaskTile from "./TaskTile";

async function patchTask(url: string) {
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { success: response.ok };
  } catch {
    return { success: false };
  }
}

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
    patchTask,
  );

  const { trigger: triggerCancelTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task/${task.id}/cancel`,
    patchTask,
  );

  return (
    <TaskTile task={task}>
      <button onClick={() => triggerCompleteTask()}>Complete</button>
      <button onClick={() => triggerCancelTask()}>Cancel</button>
    </TaskTile>
  );
}
