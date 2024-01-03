"use client";

import { fetcher } from "@/app/helpers/fetcher";
import { IFindAllTasksResponse } from "@task-manager/shared";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import ClaimableTaskTile from "./components/ClaimableTask";
import ActiveTaskTile from "./components/ActiveTask";
import DialogCreateTask from "./components/DialogCreateTask";

async function createTask(
  url: string,
  { arg }: { arg: { name: string; description: string; price: number } },
) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: arg.name,
        description: arg.description,
        price: arg.price,
      }),
    });
    return { success: response.ok };
  } catch {
    return { success: false };
  }
}

export default function Workplace() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    throw new Error("Missing workplace id");
  }

  const { data: activeTasksData, isLoading: isLoadingActiveTasks } =
    useSWR<IFindAllTasksResponse>(
      `/api/v1/workplace/${id}/task/active`,
      fetcher,
    );
  const activeTasks = activeTasksData?.tasks;

  const { data: availableTasksData, isLoading: isLoadingAvailableTasks } =
    useSWR<IFindAllTasksResponse>(
      `/api/v1/workplace/${id}/task/available`,
      fetcher,
    );
  const availableTasks = availableTasksData?.tasks;

  const { trigger: triggerCreateTask } = useSWRMutation(
    `/api/v1/workplace/${id}/task`,
    createTask,
  );

  const [showCreateTask, setShowCreateTask] = useState(false);

  return (
    <div className="grid grid-cols-3 gap-4">
      <DialogCreateTask
        open={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        onSubmit={(e) =>
          triggerCreateTask({
            name: e.name,
            description: e.description,
            price: e.price,
          })
        }
      />
      <div className="flex col-span-3 justify-end p-4 bg-white rounded-xl">
        <button
          className="font-semibold text-lg"
          onClick={() => setShowCreateTask(true)}
        >
          + New Task
        </button>
      </div>
      <div className="flex col-span-3 p-4 bg-white rounded-xl">
        <div className="font-semibold text-lg">Active Tasks</div>
      </div>
      {!activeTasks?.length && (
        <div className="col-span-3 p-4 bg-white rounded-xl">
          <p className="text-center text-lg font-semibold">
            {isLoadingActiveTasks ? "Loading..." : "There are no tasks yet"}
          </p>
        </div>
      )}
      {activeTasks?.map((task) => (
        <ActiveTaskTile key={task.id} task={task} workplaceId={id} />
      ))}
      <div className="flex col-span-3 p-4 bg-white rounded-xl">
        <div className="font-semibold text-lg">Available Tasks</div>
      </div>
      {!availableTasks?.length && (
        <div className="col-span-3 p-4 bg-white rounded-xl">
          <p className="text-center text-lg font-semibold">
            {isLoadingAvailableTasks ? "Loading..." : "There are no tasks yet"}
          </p>
        </div>
      )}
      {availableTasks?.map((task) => (
        <ClaimableTaskTile key={task.id} task={task} workplaceId={id} />
      ))}
    </div>
  );
}
