"use client";

import Tile from "@/components/Tile";
import { fetcher } from "@/helpers/fetcher";
import { IGetAuditsResponse } from "@task-manager/shared";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

export default function Audit() {
  const searchParams = useSearchParams();
  const workplaceId = searchParams.get("id");

  if (!workplaceId) {
    throw new Error("Missing workplace id");
  }

  const { data, isLoading } = useSWR<IGetAuditsResponse>(
    `/api/v1/audits/Workplace?entityId=${workplaceId}`,
    fetcher,
  );

  return (
    <Tile>
      <div className="pb-2 border-b-2 mb-4">
        <div className="font-semibold text-lg">Audit Log</div>
      </div>
      {isLoading && <div>Loading...</div>}
      {data?.length === 0 && <div>No auditable actions have occured yet.</div>}
      {data?.length ? (
        <table className="w-full">
          <thead className="border-b-2">
            <tr>
              <th align="left" className="font-semibold">
                ID
              </th>
              <th align="left" className="font-semibold">
                User ID
              </th>
              <th align="left" className="font-semibold">
                Date
              </th>
              <th align="left" className="font-semibold">
                Action Type
              </th>
              <th align="left" className="font-semibold">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((audit) => (
              <tr key={audit.id}>
                <td className="py-2">{audit.id}</td>
                <td className="py-2">{audit.userId}</td>
                <td className="py-2">
                  {new Date(audit.createdAt).toISOString()}
                </td>
                <td className="py-2">{audit.actionType}</td>
                <td className="py-2">{audit.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </Tile>
  );
}
