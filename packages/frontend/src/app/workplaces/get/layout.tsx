"use client";

import { fetcher } from "@/helpers/fetcher";
import { useSearchParamsSafe } from "@/hooks/useSearchParamsSafe";
import { IFindOneWorkplaceResponse } from "@task-manager/shared";
import Link from "next/link";
import useSWR from "swr";

export default function WorkplacesGetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useSearchParamsSafe(["id"]);

  const { data, isLoading } = useSWR<IFindOneWorkplaceResponse>(
    `/api/v1/workplace/${id}`,
    fetcher,
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col p-4 gap-2 bg-blue-500 rounded-xl">
        <Link href={`/workplaces/get?id=${id}`}>
          <div className="text-center text-white">Dashboard</div>
        </Link>
        <Link href={`/workplaces/get/members?id=${id}`}>
          <div className="text-center text-white">Members</div>
        </Link>
        <Link href={`/workplaces/get/history?id=${id}`}>
          <div className="text-center text-white">Unpaid Tasks</div>
        </Link>
        <Link href={`/workplaces/get/payroll?id=${id}`}>
          <div className="text-center text-white">Payroll List</div>
        </Link>
      </div>
      <div className="flex-auto">
        <div className="flex justify-between items-center p-4 mb-4 bg-white rounded-xl">
          <div className="text-xl">{data?.workplace.name ?? "Workplace"}</div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
