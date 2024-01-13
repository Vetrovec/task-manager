import { use, useEffect, useState } from "react";
import Dialog from "./Dialog";
import Button from "./Button";

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
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setPrice(0);
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
          <input
            className="w-full h-14 px-2 border border-gray-300 rounded-lg focus:outline-none"
            type="text"
            placeholder="Enter a name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          <div className="px-2">Description</div>
          <input
            className="w-full h-14 px-2 border border-gray-300 rounded-lg focus:outline-none"
            type="text"
            placeholder="Enter a description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          <div className="px-2">Price</div>
          <input
            className="w-full h-14 px-2 border border-gray-300 rounded-lg focus:outline-none"
            type="number"
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
