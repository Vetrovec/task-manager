"use client";

import useSWR from "swr";
import { fetcher, mutationFetcher } from "@/helpers/fetcher";
import { IFindAllWorkplacesResponse } from "@task-manager/shared";
import {
  ArrowRightEndOnRectangleIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";

export default function Dashboard() {
  const { data, isLoading } = useSWR<IFindAllWorkplacesResponse>(
    "/api/v1/workplace",
    fetcher,
  );

  const { trigger } = useSWRMutation(
    "/api/v1/workplace",
    mutationFetcher<{ name: string; text: string }>("POST"),
  );

  const [showCreateWorkplace, setShowCreateWorkplace] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const closeCreateWorkplace = () => {
    setShowCreateWorkplace(false);
    setName("");
    setText("");
  };

  return (
    <div className="flex flex-col gap-4">
      <dialog
        className="fixed top-1/2 left-1/2 p-8 m-0 border border-black rounded-xl -translate-x-1/2 -translate-y-1/2"
        open={showCreateWorkplace}
      >
        <button
          className="absolute top-2 right-4 text-lg"
          onClick={closeCreateWorkplace}
        >
          &times;
        </button>
        <form
          className="w-96 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            trigger({ name, text });
            closeCreateWorkplace();
          }}
        >
          <label>
            <div className="px-2">Name</div>
            <input
              className="w-full h-14 px-2 border border-gray-300 rounded-lg focus:outline-none"
              type="text"
              placeholder="Enter a name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            <div className="px-2">Description</div>
            <input
              className="w-full h-14 px-2 border border-gray-300 rounded-lg focus:outline-none"
              type="text"
              placeholder="Enter a description"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </label>
          <button className="w-full h-14 bg-black text-white rounded-lg">
            Create
          </button>
        </form>
      </dialog>

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
            {isLoading ? "Loading..." : "You don't have any workplaces yet"}
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
