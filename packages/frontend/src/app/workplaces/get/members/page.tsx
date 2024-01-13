"use client";

import { addMutateOption, fetcher, mutationFetcher } from "@/helpers/fetcher";
import {
  IFindOneWorkplaceResponse,
  UserWorkplaceRole,
} from "@task-manager/shared";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import DialogAddUser from "@/components/DialogAddUser";
import WorkplaceUserTile from "@/components/WorkplaceUserTile";
import { useUser } from "@/hooks/useUser";
import Button from "@/components/Button";
import DialogCreatePayroll from "@/components/DialogCreatePayroll";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function Workplace() {
  const searchParams = useSearchParams();
  const workplaceId = searchParams.get("id");

  const user = useUser();

  if (!workplaceId) {
    throw new Error("Missing workplace id");
  }

  useDocumentTitle("Members - Task Manager");

  const { data: workplaceData } = useSWR<IFindOneWorkplaceResponse>(
    `/api/v1/workplace/${workplaceId}`,
    fetcher,
  );

  const currentWorkplaceUser = workplaceData?.users.find(
    (target) => target.user.id === user.id,
  );
  const isOperator = currentWorkplaceUser?.role === "Operator";

  const { trigger: triggerAddUser } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/user`,
    mutationFetcher<{ email: string; role: UserWorkplaceRole }>(
      "POST",
      "User addition",
    ),
    addMutateOption(/\/api\/v1\/workplace/),
  );

  const { trigger: triggerPay } = useSWRMutation(
    `/api/v1/workplace/${workplaceId}/payroll`,
    mutationFetcher<{ userId: number }>("POST", "Payroll creation"),
    addMutateOption(/\/api\/v1\/workplace/),
  );

  const [showAddUser, setShowAddUser] = useState(false);
  const [showPayrollFor, setShowPayrollFor] = useState<number | null>(null);

  return (
    <div>
      <DialogAddUser
        open={showAddUser}
        onClose={() => setShowAddUser(false)}
        onSubmit={(e) => {
          setShowAddUser(false);
          triggerAddUser({
            email: e.email,
            role: e.role,
          });
        }}
      />

      {showPayrollFor && (
        <DialogCreatePayroll
          open
          userId={showPayrollFor.toString()}
          workplaceId={workplaceId}
          onClose={() => setShowPayrollFor(null)}
          onSubmit={() => {
            setShowPayrollFor(null);
            triggerPay({ userId: showPayrollFor! });
          }}
        />
      )}

      <div className="p-4 bg-white rounded-xl">
        <div className="flex justify-between pb-2 border-b-2 mb-4">
          <div className="font-semibold text-lg">Members</div>
          {isOperator && (
            <Button onClick={() => setShowAddUser(true)}>+ Add Member</Button>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {workplaceData?.users.map(({ user: target, role }) => {
            const isMe = target.id === user.id;
            return (
              <WorkplaceUserTile
                key={target.id}
                variant="nested"
                canPay={isOperator}
                canRemove={isOperator && !isMe}
                isMe={target.id === user.id}
                role={role}
                user={target}
                workplaceId={workplaceId}
                onPayClick={() => setShowPayrollFor(target.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
