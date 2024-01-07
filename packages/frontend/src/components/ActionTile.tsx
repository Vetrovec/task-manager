import Button from "./Button";
import Tile from "./Tile";

interface ActionTileProps extends React.ComponentProps<typeof Tile> {
  actions?: { id: string; title: string; disabled?: boolean }[];
  onAction?: (actionId: string) => void;
}

export function ActionTile({
  actions,
  onAction,
  children,
  ...rest
}: ActionTileProps) {
  return (
    <Tile {...rest}>
      {children}
      {actions?.length ? (
        <div className="flex justify-between pt-2 border-t-2 mt-4">
          {actions.map((action) => (
            <Button
              key={action.id}
              disabled={action.disabled}
              onClick={() => onAction?.(action.id)}
            >
              {action.title}
            </Button>
          ))}
        </div>
      ) : null}
    </Tile>
  );
}
