interface TileProps {
  children?: React.ReactNode;
}

export default function Tile({ children }: TileProps) {
  return <div className="p-4 bg-white rounded-xl">{children}</div>;
}
