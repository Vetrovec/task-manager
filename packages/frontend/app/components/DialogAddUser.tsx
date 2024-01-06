import { UserWorkplaceRole } from "@task-manager/shared";
import { use, useEffect, useState } from "react";

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
    <dialog
      className="fixed top-1/2 left-1/2 p-8 m-0 border border-black rounded-xl -translate-x-1/2 -translate-y-1/2"
      open={open}
    >
      <button className="absolute top-2 right-4 text-lg" onClick={onClose}>
        &times;
      </button>
      <form
        className="w-96 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ email, role });
        }}
      >
        <label>
          <div className="px-2">Email</div>
          <input
            className="w-full h-14 px-2 border border-gray-300 rounded-lg focus:outline-none"
            type="email"
            placeholder="Enter an email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <div className="px-2">Role</div>
          <select
            className="w-full h-14 px-2 border border-gray-300 rounded-lg focus:outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value as UserWorkplaceRole)}
          >
            <option value="Worker">Worker</option>
            <option value="Operator">Operator</option>
          </select>
        </label>
        <button className="w-full h-14 bg-black text-white rounded-lg">
          Add
        </button>
      </form>
    </dialog>
  );
}
