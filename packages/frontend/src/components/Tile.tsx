interface TileProps {
  variant?: "nested" | "default";
  children?: React.ReactNode;
}

export default function Tile({ variant, children }: TileProps) {
  const backgroundColor = variant === "nested" ? "bg-slate-100" : "bg-white";
  return <div className={`p-4 rounded-xl ${backgroundColor}`}>{children}</div>;
}
