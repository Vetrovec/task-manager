import { use, useEffect, useState } from "react";
import Dialog from "./Dialog";
import Button from "./Button";
import Input from "./Input";

interface DialogCreateTaskProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: { name: string; description: string; price: number }) => void;
}

export default function DialogCreateTask({
  open,
  onSubmit,
  onClose,
}: DialogCreateTaskProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(1);

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setPrice(1);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <form
        className="w-96 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ name, description, price });
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          <div className="px-2">Price</div>
          <Input
            className="w-full"
            type="number"
            min={1}
            placeholder="Enter a price"
            value={price}
            onChange={(e) => setPrice(e.target.valueAsNumber)}
          />
        </label>
        <Button size="lg">Create Task</Button>
      </form>
    </Dialog>
  );
}
