import Tile from "@/app/components/Tile";
import { IUser, UserWorkplaceRole } from "@task-manager/shared";

interface UserTileProps {
  user: IUser;
  role: UserWorkplaceRole;
}

export default function UserTile({ user, role }: UserTileProps) {
  return (
    <Tile>
      <p className="text-lg font-semibold">{user.displayName}</p>
      <p className="text-sm font-medium">{user.email}</p>
      <p className="text-sm font-medium text-gray-500">{role}</p>
    </Tile>
  );
}
