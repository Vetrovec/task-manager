"use client";

import Image from "next/image";
import landingImage from "./landing.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full p-8">
      <h1 className="text-6xl mb-12">Task Manager</h1>
      <div className="flex flex-1 items-center justify-around gap-4">
        <div className="w-96 shrink-0">{children}</div>
        <div>
          <Image src={landingImage} alt="Landing" />
        </div>
      </div>
    </div>
  );
}
