import { use, useEffect, useState } from "react";

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
        <button className="w-full h-14 bg-black text-white rounded-lg">
          Create
        </button>
      </form>
    </dialog>
  );
}
