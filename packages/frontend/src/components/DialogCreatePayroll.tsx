import { fetcher } from "@/helpers/fetcher";
import {
  IFindAllPayrollResponse,
  IPreviewPayrollResponse,
} from "@task-manager/shared";
import { use, useEffect, useState } from "react";
import useSWR from "swr";

interface DialogCreateTaskProps {
  open: boolean;
  userId: string;
  workplaceId: string;
  onClose: () => void;
  onSubmit: () => void;
}

export default function DialogCreatePayroll({
  open,
  userId,
  workplaceId,
  onSubmit,
  onClose,
}: DialogCreateTaskProps) {
  const { data, isLoading } = useSWR<IPreviewPayrollResponse>(
    `/api/v1/workplace/${workplaceId}/payroll/preview?userId=${userId}`,
    fetcher,
  );

  return (
    <dialog
      className="fixed top-1/2 left-1/2 p-8 m-0 border border-black rounded-xl -translate-x-1/2 -translate-y-1/2"
      open={open}
    >
      <button className="absolute top-2 right-4 text-lg" onClick={onClose}>
        &times;
      </button>
      <form
        className="w-96 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div>
          {isLoading && <div>Loading...</div>}
          {data?.tasks.length === 0 && <div>No tasks</div>}
          {data?.tasks.length ? (
            <table className="w-full">
              <thead className="border-b-2">
                <tr>
                  <th align="left" className="font-semibold">
                    Task
                  </th>
                  <th align="right" className="font-semibold">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="py-2">{task.name}</td>
                    <td className="py-2" align="right">
                      {task.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
        <button
          className="w-full h-14 bg-black text-white rounded-lg disabled:opacity-50"
          disabled={!data?.tasks.length}
        >
          Create
        </button>
      </form>
    </dialog>
  );
}
