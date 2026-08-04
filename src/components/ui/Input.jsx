export default function Input({ label, error, ...props }) {
  return (
    <div className="space-y-2">
      {label && <label className="font-medium dark:text-white">{label}</label>}

      <input
        {...props}
        className="
        w-full
        h-12
        px-4
        rounded-2xl
        bg-gray-50
        dark:bg-zinc-900
        border
        border-gray-200
        dark:border-zinc-700
        outline-none
        focus:border-primary
        dark:text-white
        transition
      "
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
