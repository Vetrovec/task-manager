"use client";

import { addMutateOption, fetcher, mutationFetcher } from "@/helpers/fetcher";
import {
  IFindAllTasksResponse,
  IFindOneWorkplaceResponse,
} from "@task-manager/shared";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import ActiveTaskTile from "@/components/ActiveTaskTile";
import AvailableTaskTile from "@/components/AvailableTaskTile";
import DialogCreateTask from "@/components/DialogCreateTask";
import { useUser } from "@/hooks/useUser";
import Button from "@/components/Button";

export default function Workplace() {
  const searchParams = useSearchParams();
  const workplaceId = searchParams.get("id");

  const user = useUser();

  if (!workplaceId) {
    throw new Error("Missing workplace id");
  }

  const { data: workplaceData } = useSWR<IFindOneWorkplaceResponse>(
    `/api/v1/workplace/${workplaceId}`,
    fetcher,
  );

  const currentWorkplaceUser = workplaceData?.users.find(
    (target) => target.user.id === user.id,
  );
  const isOperator = currentWorkplaceUser?.role === "Operator";

  const { data: activeTasksData, isLoading: isLoadingActiveTasks } =
    useSWR<IFindAllTasksResponse>(
      `/api/v1/workplace/${workplaceId}/task/active`,
      fetcher,
    );
  const activeTasks = activeTasksData?.tasks;

  const { data: availableTasksData, isLoading: isLoadingAvailableTasks } =
    useSWR<IFindAllTasksResponse>(
      `/api/v1/workplace/${workplaceId}/task/available`,
      fetcher,
    );
  const availableTasks = availableTasksData?.tasks;

  const { trigger: triggerCreateTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task`,
    mutationFetcher<{ name: string; description: string; price: number }>(
      "POST",
      "Task creation",
    ),
    addMutateOption(/\/api\/v1\/workplace/),
  );

  const [showCreateTask, setShowCreateTask] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <DialogCreateTask
        open={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        onSubmit={(e) => {
          setShowCreateTask(false);
          triggerCreateTask({
            name: e.name,
            description: e.description,
            price: e.price,
          });
        }}
      />

      <div className="p-4 bg-white rounded-xl">
        <div className="flex justify-between pb-2 border-b-2 mb-4">
          <div className="font-semibold text-lg">Active Tasks</div>
        </div>
        {!activeTasks?.length && (
          <p className="text-center">
            {isLoadingActiveTasks
              ? "Loading..."
              : "You currently don't have any active tasks"}
          </p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {activeTasks?.map((task) => (
            <ActiveTaskTile
              key={task.id}
              variant="nested"
              task={task}
              workplaceId={workplaceId}
            />
          ))}
        </div>
      </div>

      <div className="p-4 bg-white rounded-xl">
        <div className="flex justify-between pb-2 border-b-2 mb-4">
          <div className="font-semibold text-lg">Available Tasks</div>
          {isOperator && (
            <Button onClick={() => setShowCreateTask(true)}>+ New Task</Button>
          )}
        </div>
        {!availableTasks?.length && (
          <p className="text-center">
            {isLoadingAvailableTasks
              ? "Loading..."
              : "There are currently no tasks available"}
          </p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {availableTasks?.map((task) => (
            <AvailableTaskTile
              key={task.id}
              variant="nested"
              task={task}
              workplaceId={workplaceId}
              canDelete={isOperator}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
