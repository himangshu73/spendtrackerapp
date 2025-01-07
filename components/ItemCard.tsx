import { FaDeleteLeft } from "react-icons/fa6";

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
}: {
  item: Item;
  onDelete: () => void;
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
      <div>{item.itemname}</div>
      <div>
        {item.quantity}
        {item.unit}
      </div>
      <div>{item.price}</div>
    </div>
  );
}
