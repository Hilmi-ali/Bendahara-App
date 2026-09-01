import CountUp from "react-countup";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "#2540C9",
}) {
  const isNumber =
    typeof value === "number" ||
    (!isNaN(Number(String(value).replace(/[^0-9]/g, ""))) &&
      !String(value).includes("Rp"));

  return (
    <div className="rounded-xl bg-white dark:bg-[#181A20] border border-zinc-200/80 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-colors duration-200 p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${color}1A`, color }}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-[12.5px] text-zinc-500 dark:text-zinc-400 truncate">
          {title}
        </p>
        <h2 className="mt-0.5 text-[21px] font-semibold text-zinc-900 dark:text-white tracking-tight tabular-nums truncate">
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
