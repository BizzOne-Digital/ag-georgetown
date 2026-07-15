import { listAllOrders } from "@/lib/repositories/order.repository";
import { formatPrice } from "@/components/catalog/price-tag";

export const dynamic = "force-dynamic"; // always show current order data, never cache

export default async function AdminOrdersPage() {
  const orders = await listAllOrders();

  return (
    <div className="font-mono text-sm">
      <h1 className="text-lg font-bold text-gray-900">Orders ({orders.length})</h1>

      {orders.length === 0 ? (
        <p className="mt-4 text-gray-500">No orders yet.</p>
      ) : (
        <table className="mt-4 w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-gray-400">
              <th className="py-2 pr-4">Order #</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Items</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={String(order._id)} className="border-b border-gray-200">
                <td className="py-2 pr-4">{order.orderNumber}</td>
                <td className="py-2 pr-4">{order.status}</td>
                <td className="py-2 pr-4">{order.email}</td>
                <td className="py-2 pr-4">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td className="py-2 pr-4">{formatPrice(order.total)}</td>
                <td className="py-2 pr-4">{new Date(order.placedAt).toLocaleString("en-CA")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
