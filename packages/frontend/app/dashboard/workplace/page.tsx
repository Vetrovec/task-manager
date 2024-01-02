"use client";

import { fetcher } from "@/app/helpers/fetcher";
import { IFindAllTasksResponse } from "@task-manager/shared";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import ClaimableTaskTile from "./components/ClaimableTask";
import ActiveTaskTile from "./components/ActiveTask";

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

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);

  const closeCreateTask = () => {
    setShowCreateTask(false);
    setName("");
    setDescription("");
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <dialog
        className="fixed top-1/2 left-1/2 p-8 m-0 border border-black rounded-xl -translate-x-1/2 -translate-y-1/2"
        open={showCreateTask}
      >
        <button
          className="absolute top-2 right-4 text-lg"
          onClick={closeCreateTask}
        >
          &times;
        </button>
        <form
          className="w-96 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            triggerCreateTask({ name, description, price });
            closeCreateTask();
          }}
        >
          <label>
            <div className="px-2">Name</div>
            <input
              className="w-full h-14 px-2 border border-gray-300 rounded-lg focus:outline-none"
              type="text"
              placeholder="Enter a name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            <div className="px-2">Description</div>
            <input
              className="w-full h-14 px-2 border border-gray-300 rounded-lg focus:outline-none"
              type="text"
              placeholder="Enter a description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            <div className="px-2">Price</div>
            <input
              className="w-full h-14 px-2 border border-gray-300 rounded-lg focus:outline-none"
              type="number"
              placeholder="Enter a price"
              value={price}
              onChange={(e) => setPrice(e.target.valueAsNumber)}
            />
          </label>
          <button className="w-full h-14 bg-black text-white rounded-lg">
            Create
          </button>
        </form>
      </dialog>
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
