import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  fullWidth = false,
  loading = false,
  disabled = false,
  type = "button",
  onClick,
}) {
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-700 shadow-soft",

    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700",

    success: "bg-green-600 text-white hover:bg-green-700",

    danger: "bg-red-600 text-white hover:bg-red-700",

    ghost:
      "bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 dark:text-white",

    outline:
      "border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 dark:text-white",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-5",
    lg: "h-12 px-6 text-lg",
  };

  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={clsx(
        "rounded-2xl",
        "font-medium",
        "transition-all",
        "duration-200",
        "flex",
        "items-center",
        "justify-center",
        "gap-2",
        "disabled:opacity-60",
        "disabled:cursor-not-allowed",
        "hover:scale-[1.02]",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
      )}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="text-lg" />}
          {children}
        </>
      )}
    </button>
  );
}
