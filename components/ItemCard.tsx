interface Item {
  itemname: string;
  quantity: number;
  unit: string;
  price: number;
}

export default function ItemCard({ item }: { item: Item }) {
  return (
    <div className="bg-gray-200 max-w-96 rounded-md shadow-md border p-2">
      <div>{item.itemname}</div>
      <div>
        {item.quantity}
        {item.unit}
      </div>
      <div>{item.price}</div>
    </div>
  );
}
