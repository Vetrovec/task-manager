import { use, useEffect, useState } from "react";
import Dialog from "./Dialog";
import Button from "./Button";
import Input from "./Input";

interface DialogCreateTaskProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: { name: string; text: string }) => void;
}

export default function DialogCreateWorkspace({
  open,
  onSubmit,
  onClose,
}: DialogCreateTaskProps) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setText("");
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <form
        className="w-96 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ name, text });
        }}
      >
        <label>
          <div className="px-2">Name</div>
          <Input
            className="w-full"
            type="text"
            placeholder="Enter a name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          <div className="px-2">Description</div>
          <Input
            className="w-full"
            type="text"
            placeholder="Enter a description"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <Button size="lg">Create Workspace</Button>
      </form>
    </Dialog>
  );
}
