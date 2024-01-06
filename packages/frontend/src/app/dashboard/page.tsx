"use client";

import useSWR from "swr";
import { fetcher } from "../../helpers/fetcher";
import { IFindAllWorkplacesResponse } from "@task-manager/shared";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import Link from "next/link";

async function createWorkplace(
  url: string,
  { arg }: { arg: { name: string; text: string } },
) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: arg.name,
        text: arg.text,
      }),
    });
    return { success: response.ok };
  } catch {
    return { success: false };
  }
}

export default function Dashboard() {
  const { data, isLoading } = useSWR<IFindAllWorkplacesResponse>(
    "/api/v1/workplace",
    fetcher,
  );

  const { trigger } = useSWRMutation("/api/v1/workplace", createWorkplace);

  const [showCreateWorkplace, setShowCreateWorkplace] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const closeCreateWorkplace = () => {
    setShowCreateWorkplace(false);
    setName("");
    setText("");
  };

  return (
    <div className="grid grid-cols-3 gap-4">
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
      <div className="flex col-span-3 justify-end p-4 bg-white rounded-xl">
        <button
          className="font-semibold text-lg"
          onClick={() => setShowCreateWorkplace(true)}
        >
          + New Workplace
        </button>
      </div>
      {!data?.workplaces.length && (
        <div className="col-span-3 p-4 bg-white rounded-xl">
          <p className="text-center text-lg font-semibold">
            {isLoading ? "Loading..." : "You don't have any workplaces yet"}
          </p>
        </div>
      )}
      {data?.workplaces.map((workplace) => (
        <Link
          key={workplace.id}
          href={`/dashboard/workplace?id=${workplace.id}`}
        >
          <div className="p-4 bg-white rounded-xl">
            <p className="text-lg font-semibold">{workplace.name}</p>
            <p className="text-sm font-medium text-gray-500">
              {workplace.text}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
