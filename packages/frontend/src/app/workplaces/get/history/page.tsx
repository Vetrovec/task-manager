"use client";

import Tile from "@/components/Tile";
import { fetcher } from "@/helpers/fetcher";
import { IFindAllTasksResponse } from "@task-manager/shared";
import { useSearchParams } from "next/navigation";
import useSWR, { mutate } from "swr";

export default function History() {
  const searchParams = useSearchParams();
  const workplaceId = searchParams.get("id");

  if (!workplaceId) {
    throw new Error("Missing workplace id");
  }

  const { data, isLoading } = useSWR<IFindAllTasksResponse>(
    `/api/v1/workplace/${workplaceId}/task/completed`,
    fetcher,
  );

  const total = data?.tasks.reduce((acc, task) => acc + task.price, 0) ?? 0;

  return (
    <Tile>
      <div className="pb-2 border-b-2 mb-4">
        <div className="font-semibold text-lg">Unpaid Tasks</div>
      </div>
      <div className="mb-4">
        Here are all your completed tasks that have not been paid by operator
        yet.
      </div>
      <table className="w-full">
        <thead className="border-b-2">
          <tr>
            <th align="left" className="font-semibold">
              Name
            </th>
            <th align="left" className="font-semibold">
              Description
            </th>
            <th className="font-semibold">Status</th>
            <th align="right" className="font-semibold">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td className="py-2" colSpan={4} align="center">
                Loading...
              </td>
            </tr>
          )}
          {data?.tasks.length === 0 && (
            <tr>
              <td className="py-2" colSpan={4} align="center">
                No unpaid tasks found
              </td>
            </tr>
          )}
          {data?.tasks.map((task) => (
            <tr key={task.id}>
              <td className="py-2">{task.name}</td>
              <td className="py-2">{task.description}</td>
              <td className="py-2 uppercase" align="center">
                {task.status}
              </td>
              <td className="py-2" align="right">
                {task.price}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t-2">
          <tr>
            <td className="font-semibold" colSpan={4} align="right">
              Total: {total}
            </td>
          </tr>
        </tfoot>
      </table>
    </Tile>
  );
}
