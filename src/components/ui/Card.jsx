import clsx from "clsx";

export default function Card({ children, className = "", padding = true }) {
  return (
    <div
      className={clsx(
        "bg-white",
        "dark:bg-darkcard",
        "rounded-3xl",
        "shadow-soft",
        "border",
        "border-gray-100",
        "dark:border-zinc-800",
        "transition-all",
        "duration-200",
        "hover:shadow-lg",
        padding && "p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
