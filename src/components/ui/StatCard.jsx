import CountUp from "react-countup";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "bg-indigo-600",
}) {
  const isNumber =
    typeof value === "number" ||
    (!isNaN(Number(String(value).replace(/[^0-9]/g, ""))) &&
      !String(value).includes("Rp"));

  return (
    <div
      className="
        group relative overflow-hidden rounded-2xl
        bg-white/70 dark:bg-darkcard/70 backdrop-blur-xl
        border border-white/20 dark:border-white/5
        shadow-lg shadow-black/5 dark:shadow-black/30
        hover:shadow-xl hover:-translate-y-0.5
        transition-all duration-300
        p-4 flex items-center gap-3 font-sans
      "
    >
      <div
        className={`absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-20 blur-2xl ${color}`}
      />
      <div
        className={`relative w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white shadow-md ${color}`}
      >
        <Icon size={20} />
      </div>
      <div className="relative min-w-0">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 tracking-wide truncate">
          {title}
        </p>
        <h2 className="mt-0.5 text-xl font-extrabold text-zinc-500 dark:text-white tracking-tight tabular-nums truncate">
          {isNumber ? (
            <CountUp end={Number(value)} duration={1.2} separator="." />
          ) : (
            value
          )}
        </h2>
      </div>
    </div>
  );
}
