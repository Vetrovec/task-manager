"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function WorkplacesGetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div className="flex gap-4">
      <div className="flex flex-col p-4 gap-2 bg-blue-500 rounded-xl">
        <Link href={`/workplaces/get?id=${id}`}>
          <div className="text-center text-white">Overview</div>
        </Link>
        <Link href={`/workplaces/get/history?id=${id}`}>
          <div className="text-center text-white">Unpaid Tasks</div>
        </Link>
        <Link href={`/workplaces/get/payroll?id=${id}`}>
          <div className="text-center text-white">Payroll List</div>
        </Link>
      </div>
      <div className="flex-auto">{children}</div>
    </div>
  );
}
