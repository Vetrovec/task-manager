interface DialogProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

export default function Dialog({ children, open, onClose }: DialogProps) {
  return (
    <dialog
      className="fixed top-1/2 left-1/2 p-8 m-0 shadow bg-white border rounded-xl -translate-x-1/2 -translate-y-1/2"
      open={open}
    >
      <button className="absolute top-2 right-4 text-lg" onClick={onClose}>
        &times;
      </button>
      {children}
    </dialog>
  );
}
