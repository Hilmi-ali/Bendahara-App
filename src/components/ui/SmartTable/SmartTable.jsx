import Card from "../Card";

export default function SmartTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "Tidak ada data.",
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-zinc-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="
                    px-5
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    dark:text-white
                  "
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} className="text-center py-10">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-12 text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!loading &&
              data.map((row, index) => (
                <tr
                  key={row.id}
                  className="
                    border-t
                    dark:border-zinc-800
                    hover:bg-gray-50
                    dark:hover:bg-zinc-900
                    transition
                  "
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-5 py-4 dark:text-white">
                      {column.render
                        ? column.render(row, index)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
