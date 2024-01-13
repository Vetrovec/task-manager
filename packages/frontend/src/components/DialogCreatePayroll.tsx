import { fetcher } from "@/helpers/fetcher";
import { IPreviewPayrollResponse } from "@task-manager/shared";
import useSWR from "swr";
import Dialog from "./Dialog";
import Button from "./Button";

interface DialogCreateTaskProps {
  open: boolean;
  userId: string;
  workplaceId: string;
  onClose: () => void;
  onSubmit: () => void;
}

export default function DialogCreatePayroll({
  open,
  userId,
  workplaceId,
  onSubmit,
  onClose,
}: DialogCreateTaskProps) {
  const { data, isLoading } = useSWR<IPreviewPayrollResponse>(
    `/api/v1/workplace/${workplaceId}/payroll/preview?userId=${userId}`,
    fetcher,
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <form
        className="w-96 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div>
          {isLoading && <div>Loading...</div>}
          {data?.tasks.length === 0 && <div>No tasks</div>}
          {data?.tasks.length ? (
            <table className="w-full">
              <thead className="border-b-2">
                <tr>
                  <th align="left" className="font-semibold">
                    Task
                  </th>
                  <th align="right" className="font-semibold">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="py-2">{task.name}</td>
                    <td className="py-2" align="right">
                      {task.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
        <Button size="lg" disabled={!data?.tasks.length}>
          Create Payroll
        </Button>
      </form>
    </Dialog>
  );
}
