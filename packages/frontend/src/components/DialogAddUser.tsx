import { UserWorkplaceRole } from "@task-manager/shared";
import { useEffect, useState } from "react";
import Dialog from "./Dialog";
import Button from "./Button";
import Input from "./Input";

interface DialogAddUserProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: { email: string; role: UserWorkplaceRole }) => void;
}

export default function DialogAddUser({
  open,
  onSubmit,
  onClose,
}: DialogAddUserProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserWorkplaceRole>("Worker");

  useEffect(() => {
    if (open) {
      setEmail("");
      setRole("Worker");
    }
  }, [open]);

  return (
    <Dialog onClose={onClose} open={open}>
      <form
        className="w-96 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ email, role });
        }}
      >
        <label>
          <div className="px-2">Email</div>
          <Input
            className="w-full"
            type="email"
            placeholder="Enter an email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <div className="px-2">Role</div>
          <select
            className="w-full h-10 px-2 border border-gray-300 rounded-lg focus:outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value as UserWorkplaceRole)}
          >
            <option value="Worker">Worker</option>
            <option value="Operator">Operator</option>
          </select>
        </label>
        <Button size="lg">Add Member</Button>
      </form>
    </Dialog>
  );
}
