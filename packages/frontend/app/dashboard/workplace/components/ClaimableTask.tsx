import { ITask } from "@task-manager/shared";
import useSWRMutation from "swr/mutation";
import TaskTile from "./TaskTile";

async function claimTask(url: string) {
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

interface ClaimableTaskTileProps {
  task: ITask;
  workplaceId: string;
}

export default function ClaimableTaskTile({
  task,
  workplaceId,
}: ClaimableTaskTileProps) {
  const { trigger: triggerClaimTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task/${task.id}/claim`,
    claimTask,
  );

  return (
    <TaskTile task={task}>
      <button onClick={() => triggerClaimTask()}>Claim</button>
    </TaskTile>
  );
}
