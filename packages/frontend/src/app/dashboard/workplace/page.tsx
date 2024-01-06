"use client";

import { fetcher } from "@/helpers/fetcher";
import {
  IFindAllTasksResponse,
  IFindOneWorkplaceResponse,
  UserWorkplaceRole,
} from "@task-manager/shared";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import ActiveTaskTile from "@/components/ActiveTaskTile";
import AvailableTaskTile from "@/components/AvailableTaskTile";
import DialogCreateTask from "@/components/DialogCreateTask";
import DialogAddUser from "@/components/DialogAddUser";
import WorkplaceUserTile from "@/components/WorkplaceUserTile";
import { useUser } from "@/hooks/useUser";

async function addTask(
  url: string,
  { arg }: { arg: { email: string; role: UserWorkplaceRole } },
) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: arg.email,
        role: arg.role,
      }),
    });
    return { success: response.ok };
  } catch {
    return { success: false };
  }
}

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
  const workplaceId = searchParams.get("id");

  const user = useUser();

  if (!workplaceId) {
    throw new Error("Missing workplace id");
  }

  const { data: workplaceData, isLoading: isLoadingWorkplace } =
    useSWR<IFindOneWorkplaceResponse>(
      `/api/v1/workplace/${workplaceId}`,
      fetcher,
    );

  const currentWorkplaceUser = workplaceData?.users.find(
    (target) => target.user.id === user.id,
  );
  const isOperator = currentWorkplaceUser?.role === "Operator";
  const isWorker = currentWorkplaceUser?.role === "Worker";

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

  const { trigger: triggerAddUser } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/user`,
    addTask,
  );

  const { trigger: triggerCreateTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task`,
    createTask,
  );

  const [showAddUser, setShowAddUser] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);

  if (isLoadingWorkplace) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <DialogAddUser
        open={showAddUser}
        onClose={() => setShowAddUser(false)}
        onSubmit={(e) =>
          triggerAddUser({
            email: e.email,
            role: e.role,
          })
        }
      />
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
      <div className="flex col-span-3 justify-between items-center p-4 bg-white rounded-xl">
        <div className="text-xl">
          {isLoadingWorkplace
            ? "Loading..."
            : workplaceData?.workplace.name ?? "Workplace"}
        </div>
      </div>
      {isOperator && (
        <>
          <div className="flex col-span-3 justify-between p-4 bg-white rounded-xl">
            <div className="font-semibold text-lg">Users</div>
            <button
              className="font-semibold text-lg"
              onClick={() => setShowAddUser(true)}
            >
              + Add User
            </button>
          </div>
          {workplaceData?.users.map(({ user: target, role }) => {
            const canDelete = isOperator && target.id !== user.id;
            return (
              <WorkplaceUserTile
                key={target.id}
                user={target}
                role={role}
                workplaceId={workplaceId}
                canDelete={canDelete}
              />
            );
          })}
        </>
      )}
      {isWorker && (
        <>
          <div className="flex col-span-3 p-4 bg-white rounded-xl">
            <div className="font-semibold text-lg">Active Tasks</div>
          </div>
          {!activeTasks?.length && (
            <div className="col-span-3 p-4 bg-white rounded-xl">
              <p className="text-center text-lg font-semibold">
                {isLoadingActiveTasks
                  ? "Loading..."
                  : "You don't have any active tasks"}
              </p>
            </div>
          )}
          {activeTasks?.map((task) => (
            <ActiveTaskTile
              key={task.id}
              task={task}
              workplaceId={workplaceId}
            />
          ))}
        </>
      )}
      <div className="flex col-span-3 justify-between p-4 bg-white rounded-xl">
        <div className="font-semibold text-lg">Available Tasks</div>
        {isOperator && (
          <button
            className="font-semibold text-lg"
            onClick={() => setShowCreateTask(true)}
          >
            + New Task
          </button>
        )}
      </div>
      {!availableTasks?.length && (
        <div className="col-span-3 p-4 bg-white rounded-xl">
          <p className="text-center text-lg font-semibold">
            {isLoadingAvailableTasks
              ? "Loading..."
              : "There are currently no tasks available"}
          </p>
        </div>
      )}
      {availableTasks?.map((task) => (
        <AvailableTaskTile
          key={task.id}
          task={task}
          workplaceId={workplaceId}
          canClaim={isWorker}
          canDelete={isOperator}
        />
      ))}
    </div>
  );
}
