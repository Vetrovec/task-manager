"use client";

import FormattedDate from "@/components/FormattedDate";
import Tile from "@/components/Tile";
import { fetcher } from "@/helpers/fetcher";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { IGetAuditsResponse } from "@task-manager/shared";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

export default function Audit() {
  const searchParams = useSearchParams();
  const workplaceId = searchParams.get("id");

  if (!workplaceId) {
    throw new Error("Missing workplace id");
  }

  useDocumentTitle("Audit Log - Task Manager");

  const { data, isLoading } = useSWR<IGetAuditsResponse>(
    `/api/v1/audits/Workplace?entityId=${workplaceId}`,
    fetcher,
  );

  const sortedAuditLog = data?.log?.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <Tile>
      <div className="pb-2 border-b-2 mb-4">
        <div className="font-semibold text-lg">Audit Log</div>
      </div>
      <div className="mb-4">
        Here are all auditable actions that have occured in this workplace.
      </div>
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
          {isLoading && (
            <tr>
              <td className="py-2" colSpan={5} align="center">
                Loading...
              </td>
            </tr>
          )}
          {sortedAuditLog?.length === 0 && (
            <tr>
              <td className="py-2" colSpan={5} align="center">
                No logs found
              </td>
            </tr>
          )}
          {sortedAuditLog?.map((audit) => (
            <tr key={audit.id}>
              <td className="py-2">{audit.id}</td>
              <td className="py-2">{audit.userId}</td>
              <td className="py-2">
                <FormattedDate date={new Date(audit.createdAt)} />
              </td>
              <td className="py-2">{audit.actionType}</td>
              <td className="py-2">{audit.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Tile>
  );
}
