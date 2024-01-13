import { fetcher } from "@/helpers/fetcher";
import { IFindOnePayrollResponse } from "@task-manager/shared";
import useSWR from "swr";
import Dialog from "./Dialog";

interface DialogCreateTaskProps {
  open: boolean;
  payrollId: string;
  workplaceId: string;
  onClose: () => void;
}

export default function DialogShowPayroll({
  open,
  payrollId,
  workplaceId,
  onClose,
}: DialogCreateTaskProps) {
  const { data, isLoading } = useSWR<IFindOnePayrollResponse>(
    `/api/v1/workplace/${workplaceId}/payroll/${payrollId}`,
    fetcher,
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="w-72">
        {isLoading && <div>Loading...</div>}
        {data?.tasks.length === 0 && (
          <div>There are currently no completed tasks by this member.</div>
        )}
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
    </Dialog>
  );
}
