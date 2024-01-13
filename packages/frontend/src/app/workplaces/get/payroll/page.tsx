"use client";

import Button from "@/components/Button";
import DialogShowPayroll from "@/components/DialogShowPayroll";
import Tile from "@/components/Tile";
import { fetcher } from "@/helpers/fetcher";
import { IFindAllPayrollResponse } from "@task-manager/shared";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function Payroll() {
  const searchParams = useSearchParams();
  const workplaceId = searchParams.get("id");

  if (!workplaceId) {
    throw new Error("Missing workplace id");
  }

  const [showPayrollId, setShowPayrollId] = useState<number | null>(null);

  const { data, isLoading } = useSWR<IFindAllPayrollResponse>(
    `/api/v1/workplace/${workplaceId}/payroll`,
    fetcher,
  );

  return (
    <Tile>
      {showPayrollId && (
        <DialogShowPayroll
          open
          payrollId={showPayrollId.toString()}
          workplaceId={workplaceId}
          onClose={() => setShowPayrollId(null)}
        />
      )}

      <div className="pb-2 border-b-2 mb-4">
        <div className="font-semibold text-lg">Payroll List</div>
      </div>
      <div className="mb-4">
        Here are all payrolls that you have received from this workplace.
      </div>
      {isLoading && <div>Loading...</div>}
      {data?.payrolls.length === 0 && <div>No payrolls</div>}
      {data?.payrolls.length ? (
        <table className="w-full">
          <thead className="border-b-2">
            <tr>
              <th align="left" className="font-semibold">
                ID
              </th>
              <th align="left" className="font-semibold">
                Created At
              </th>
              <th align="left" className="font-semibold">
                Operator
              </th>
              <th align="right" className="font-semibold">
                Amount
              </th>
              <th align="right" className="font-semibold">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {data.payrolls.map((payroll) => (
              <tr key={payroll.id}>
                <td className="py-2">{payroll.id}</td>
                <td className="py-2">
                  {new Date(payroll.createdAt).toISOString()}
                </td>
                <td className="py-2">{payroll.createdBy.email}</td>
                <td className="py-2" align="right">
                  {payroll.total}
                </td>
                <td className="py-2" align="right">
                  <Button
                    variant="secondary"
                    onClick={() => setShowPayrollId(payroll.id)}
                  >
                    Show Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </Tile>
  );
}
