export default function RecentActivity({ payments, rupiah }) {
  return (
    <div className="rounded-[28px] bg-zinc-900/70 backdrop-blur-xl border border-white/5 shadow-xl shadow-black/30 p-6 h-full font-sans">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-white tracking-tight">
          Recent Activity
        </h3>
        <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-zinc-400">
          Last Payment
        </span>
      </div>

      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
        {payments.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-full bg-white/[0.03] hover:bg-white/[0.06] transition p-2 pr-4"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold shrink-0">
              {item.nama?.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white truncate">
                {item.nama}
              </div>
              <div className="text-xs text-zinc-400">{item.nis}</div>
            </div>

            <div className="font-bold text-emerald-400 whitespace-nowrap tabular-nums">
              {rupiah(item.nominal)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
