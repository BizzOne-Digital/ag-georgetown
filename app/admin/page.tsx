import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="font-mono text-sm">
      <h1 className="text-lg font-bold text-gray-900">AG Admin</h1>
      <ul className="mt-4 list-disc pl-5 text-gray-700">
        <li>
          <Link href="/admin/orders" className="underline hover:text-black">
            Orders
          </Link>{" "}
          - view order status, customer, items, total, date.
        </li>
        <li>
          <Link href="/admin/products" className="underline hover:text-black">
            Inventory
          </Link>{" "}
          - view and edit product price/stock.
        </li>
      </ul>
    </div>
  );
}
