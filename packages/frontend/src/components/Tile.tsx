interface TileProps {
  className?: string;
  variant?: "default" | "highlighted" | "nested";
  children?: React.ReactNode;
}

export default function Tile({ className, variant, children }: TileProps) {
  const backgroundColor = {
    default: "bg-white",
    highlighted: "bg-blue-500",
    nested: "bg-slate-100",
  }[variant ?? "default"];

  return (
    <div
      className={`p-4 rounded-xl shadow ${backgroundColor} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
