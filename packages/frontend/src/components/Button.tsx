export default function Button({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="flex justify-center items-center px-2 py-1 text-white text-sm bg-blue-500 hover:bg-blue-600 rounded-md disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}
