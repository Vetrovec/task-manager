import Tile from "@/components/Tile";
import { ITask } from "@task-manager/shared";

interface TaskTileProps {
  task: ITask;
  children?: React.ReactNode;
}

export default function TaskTile({ children, task }: TaskTileProps) {
  return (
    <Tile>
      <p className="text-lg font-semibold">{task.name}</p>
      <p className="text-sm font-medium text-gray-500">{task.description}</p>
      <p className="text-xs font-medium text-gray-500">{task.price}</p>
      {children}
    </Tile>
  );
}
