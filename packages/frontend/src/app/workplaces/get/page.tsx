"use client";

import { fetcher, mutationFetcher } from "@/helpers/fetcher";
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
    mutationFetcher<{ email: string; role: UserWorkplaceRole }>("POST"),
  );

  const { trigger: triggerCreateTask } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/task`,
    mutationFetcher<{ name: string; description: string; price: number }>(
      "POST",
    ),
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
            const canManage = isOperator && target.id !== user.id;
            return (
              <WorkplaceUserTile
                key={target.id}
                user={target}
                role={role}
                workplaceId={workplaceId}
                canManage={canManage}
              />
            );
          })}
        </>
      )}
      <div className="flex col-span-3 p-4 bg-white rounded-xl">
        <div className="font-semibold text-lg">Active Tasks</div>
      </div>
      {!activeTasks?.length && (
        <div className="col-span-3 p-4 bg-white rounded-xl">
          <p className="text-center">
            {isLoadingActiveTasks
              ? "Loading..."
              : "You currently have to active tasks"}
          </p>
        </div>
      )}
      {activeTasks?.map((task) => (
        <ActiveTaskTile key={task.id} task={task} workplaceId={workplaceId} />
      ))}
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
          <p className="text-center">
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
          canDelete={isOperator}
        />
      ))}
    </div>
  );
}
