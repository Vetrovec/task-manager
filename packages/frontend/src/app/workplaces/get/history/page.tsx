"use client";

import Tile from "@/components/Tile";
import { fetcher } from "@/helpers/fetcher";
import { IFindAllTasksResponse } from "@task-manager/shared";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

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

  return (
    <Tile>
      <div className="mb-4 font-semibold text-xl">History</div>
      {isLoading && <div>Loading...</div>}
      {data?.tasks.length === 0 && <div>No tasks</div>}
      {data?.tasks.length ? (
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
            {data.tasks.map((task) => (
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
                Total: {data.tasks.reduce((acc, task) => acc + task.price, 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      ) : null}
    </Tile>
  );
}
