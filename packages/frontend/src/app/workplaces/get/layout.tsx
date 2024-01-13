"use client";

import Tile from "@/components/Tile";
import { fetcher } from "@/helpers/fetcher";
import { useSearchParamsSafe } from "@/hooks/useSearchParamsSafe";
import {
  BanknotesIcon,
  BuildingOfficeIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  TableCellsIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { IFindOneWorkplaceResponse } from "@task-manager/shared";
import Link from "next/link";
import useSWR from "swr";

const menuItems = [
  {
    name: "Dashboard",
    href: "/workplaces/get",
    icon: TableCellsIcon,
  },
  {
    name: "Members",
    href: "/workplaces/get/members",
    icon: UserGroupIcon,
  },
  {
    name: "Unpaid Tasks",
    href: "/workplaces/get/history",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    name: "Payroll List",
    href: "/workplaces/get/payroll",
    icon: BanknotesIcon,
  },
  {
    name: "Audit Log",
    href: "/workplaces/get/log",
    icon: DocumentTextIcon,
  },
];

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
      <Tile
        variant="highlighted"
        className="flex flex-col p-2 gap-2 text-white"
      >
        {menuItems.map(({ href, icon: Icon, name }) => (
          <Link key={href} href={`${href}?id=${id}`}>
            <div className="flex p-2 flex-col justify-center items-center gap-2 rounded-lg aspect-square hover:bg-blue-600">
              <div className="w-12">
                <Icon />
              </div>
              <div className="text-sm">{name}</div>
            </div>
          </Link>
        ))}
      </Tile>
      <div className="flex-auto">
        <Tile className="flex items-center gap-2 p-4 mb-4">
          <div className="w-6">
            <BuildingOfficeIcon />
          </div>
          <div className="text-xl">{data?.workplace.name ?? "Workplace"}</div>
        </Tile>
        <div>{children}</div>
      </div>
    </div>
  );
}
