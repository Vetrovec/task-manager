import Link from "next/link";

type ButtonProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
  children?: React.ReactNode;
} & (
  | ({ as?: "button" } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  | ({
      as: "link";
      href: string;
    } & React.ButtonHTMLAttributes<HTMLAnchorElement>)
);

export default function Button(props: ButtonProps) {
  const backgroundColor = {
    primary: "bg-blue-500",
    secondary: "bg-slate-200",
  }[props.variant ?? "primary"];

  const textColor = {
    primary: "text-white",
    secondary: "text-black",
  }[props.variant ?? "primary"];

  const hoverBackgroundColor = {
    primary: "hover:bg-blue-600",
    secondary: "hover:bg-slate-100",
  }[props.variant ?? "primary"];

  const padding = {
    sm: "px-2 py-1",
    md: "px-4 py-2",
    lg: "px-6 py-3",
  }[props.size ?? "sm"];

  const elementClassName = `flex justify-center items-center text-sm rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${padding} ${backgroundColor} ${textColor} ${hoverBackgroundColor} ${
    props.className ?? ""
  }`;

  if (props.as === "link") {
    const { as, ...rest } = props;
    return (
      <Link {...rest} className={elementClassName}>
        {props.children}
      </Link>
    );
  }

  const { as, ...rest } = props;
  return (
    <button {...rest} className={elementClassName}>
      {props.children}
    </button>
  );
}
