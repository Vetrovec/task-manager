"use client";

import Tile from "@/components/Tile";
import { fetcher } from "@/helpers/fetcher";
import { IFindAllPayrollResponse } from "@task-manager/shared";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

export default function Payroll() {
  const searchParams = useSearchParams();
  const workplaceId = searchParams.get("id");

  if (!workplaceId) {
    throw new Error("Missing workplace id");
  }

  const { data, isLoading } = useSWR<IFindAllPayrollResponse>(
    `/api/v1/workplace/${workplaceId}/payroll`,
    fetcher,
  );

  return (
    <Tile>
      <div className="pb-2 border-b-2 mb-4">
        <div className="font-semibold text-xl">Payroll List</div>
      </div>
      {isLoading && <div>Loading...</div>}
      {data?.payrolls.length === 0 && <div>No payrolls</div>}
      {data?.payrolls.length ? (
        <table className="w-full">
          <thead className="border-b-2">
            <tr>
              <th align="left" className="font-semibold">
                Date
              </th>
              <th align="right" className="font-semibold">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {data.payrolls.map((payroll) => (
              <tr key={payroll.id}>
                <td className="py-2">
                  {new Date(payroll.createdAt).toISOString()}
                </td>
                <td className="py-2" align="right">
                  {payroll.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </Tile>
  );
}
