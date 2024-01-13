"use client";

import useSWR from "swr";
import { addMutateOption, fetcher, mutationFetcher } from "@/helpers/fetcher";
import { IFindAllWorkplacesResponse } from "@task-manager/shared";
import {
  ArrowRightEndOnRectangleIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import DialogCreateWorkspace from "@/components/DialogCreateWorkspace";

export default function Dashboard() {
  const { data, isLoading } = useSWR<IFindAllWorkplacesResponse>(
    "/api/v1/workplace",
    fetcher,
  );

  const { trigger } = useSWRMutation(
    "/api/v1/workplace",
    mutationFetcher<{ name: string; text: string }>(
      "POST",
      "Workplace creation",
    ),
    addMutateOption(/\/api\/v1\/workplace/),
  );

  const [showCreateWorkplace, setShowCreateWorkplace] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <DialogCreateWorkspace
        open={showCreateWorkplace}
        onClose={() => setShowCreateWorkplace(false)}
        onSubmit={({ name, text }) => {
          setShowCreateWorkplace(false);
          trigger({ name, text });
        }}
      />

      <div className="flex justify-between items-center p-4 bg-white rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-6">
            <BuildingOffice2Icon />
          </div>
          <div className="text-xl">Workplaces</div>
        </div>
        <Button onClick={() => setShowCreateWorkplace(true)}>
          + New Workplace
        </Button>
      </div>

      {!data?.workplaces.length && (
        <div className="p-4 bg-white rounded-xl">
          <p className="text-center text-lg font-semibold">
            {isLoading ? <Spinner /> : "You don't have any workplaces yet"}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {data?.workplaces.map((workplace) => (
          <div
            key={workplace.id}
            className="pb-8 bg-white rounded-xl overflow-hidden"
          >
            <Link href={`/workplaces/get?id=${workplace.id}`}>
              <div className="flex justify-between items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors">
                <div className="text-base font-medium">{workplace.name}</div>
                <div className="w-6">
                  <ArrowRightEndOnRectangleIcon />
                </div>
              </div>
            </Link>
            <div className="px-4 py-2">
              <p className="text-sm font-medium text-gray-600">
                {workplace.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
