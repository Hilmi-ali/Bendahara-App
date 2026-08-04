export default function PaymentProgress({ percent }) {
  return (
    <div className="rounded-3xl bg-white/70 dark:bg-darkcard/70 backdrop-blur-xl p-6 shadow-lg">
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold dark:text-white">Collection Rate</h3>

        <span className="font-bold text-green-600">{percent}%</span>
      </div>

      <div className="h-3 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-1000"
          style={{
            width: `${percent}%`,
          }}
        />
      </div>
    </div>
  );
}
