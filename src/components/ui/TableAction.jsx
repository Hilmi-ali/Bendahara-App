import { HiPencilSquare, HiTrash } from "react-icons/hi2";

export default function TableAction({ onEdit, onDelete }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onEdit}
        className="
          w-9
          h-9
          rounded-xl
          bg-blue-100
          hover:bg-blue-200
          text-blue-700
          flex
          items-center
          justify-center
        "
      >
        <HiPencilSquare />
      </button>

      <button
        onClick={onDelete}
        className="
          w-9
          h-9
          rounded-xl
          bg-red-100
          hover:bg-red-200
          text-red-700
          flex
          items-center
          justify-center
        "
      >
        <HiTrash />
      </button>
    </div>
  );
}
