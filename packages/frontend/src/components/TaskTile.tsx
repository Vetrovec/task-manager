import Tile from "@/components/Tile";
import { ITask } from "@task-manager/shared";
import { ActionTile } from "./ActionTile";

interface TaskTileProps extends React.ComponentProps<typeof ActionTile> {
  task: ITask;
}

export default function TaskTile({ task, children, ...rest }: TaskTileProps) {
  return (
    <ActionTile {...rest}>
      <p className="text-lg font-semibold">{task.name}</p>
      <p className="text-sm font-medium text-gray-500">{task.description}</p>
      <p className="text-xs font-medium text-gray-500">{task.price}</p>
    </ActionTile>
  );
}
