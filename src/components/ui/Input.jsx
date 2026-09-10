import clsx from "clsx";

export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-zinc-700 dark:text-white">
          {label}
        </label>
      )}

      <input
        {...props}
        className={clsx(
          "h-11 w-full rounded-xl border border-zinc-200 bg-gray-50 px-4 outline-none transition",
          "focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10",
          "dark:border-zinc-700 dark:bg-zinc-900 dark:text-white",
          className,
        )}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
