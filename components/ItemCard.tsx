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
    <div className="relative bg-gray-200 max-w-96 rounded-md shadow-md border p-2">
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 "
        aria-label="Delete"
      >
        <FaDeleteLeft />
      </button>
      <button
        onClick={updateItem}
        className="absolute bottom-2 right-2 text-blue-500 hover:text-blue-700 "
        aria-label="Edit"
      >
        <CiEdit />
      </button>
      <div className="font-bold">{item.itemname}</div>
      <div>
        Quantity: {item.quantity}
        {item.unit}
      </div>
      <div>Price: {item.price} taka</div>
    </div>
  );
}
