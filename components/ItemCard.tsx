import { FaDeleteLeft } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";

interface Item {
  _id: string;
  itemname: string;
  quantity: number;
  unit: string;
  price: number;
}

export default function ItemCard({
  item,
  onDelete,
  updateItem,
}: {
  item: Item;
  onDelete: () => void;
  updateItem: () => void;
}) {
  return (
    <div className="mb-4 relative bg-white rounded-xl shadow-lg border border-gray-200 p-4 transition-transform transform hover:scale-105 hover:shadow-2xl">
      <button
        onClick={onDelete}
        className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
        aria-label="Delete"
      >
        <FaDeleteLeft size={20} />
      </button>
      <button
        onClick={updateItem}
        className="absolute bottom-4 right-4 text-blue-500 hover:text-blue-700 transition-colors"
        aria-label="Edit"
      >
        <CiEdit size={20} />
      </button>

      <div className="text-xl font-semibold text-gray-800 mb-2">
        {item.itemname}
      </div>

      <div className="text-gray-600 mb-2">
        <span className="font-medium text-gray-700">Quantity:</span>{" "}
        {item.quantity} {item.unit}
      </div>
      <div className="text-gray-600">
        <span className="font-medium text-gray-700">Price:</span> {item.price}{" "}
        Taka
      </div>
    </div>
  );
}
