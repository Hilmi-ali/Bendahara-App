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
  className = "",
}) {
  const variants = {
    primary:
      "bg-primary text-white shadow-sm hover:bg-blue-700 hover:shadow-md",

    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700",

    success: "bg-green-600 text-white hover:bg-green-700 hover:shadow-md",

    danger: "bg-red-600 text-white hover:bg-red-700 hover:shadow-md",

    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-800",

    outline:
      "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800",
  };

  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-lg",
  };

  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={clsx(
        "flex items-center justify-center gap-2 rounded-xl font-medium",
        "transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "focus:outline-none focus:ring-4 focus:ring-blue-500/10",
        "hover:scale-[1.01]",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth && "w-full",
        className,
      )}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-label="Loading"
        />
      ) : (
        <>
          {Icon && <Icon className="text-base" />}
          {children}
        </>
      )}
    </button>
  );
}
