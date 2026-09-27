import { Link } from "react-router";

const LowStockWidget = ({ items = [] }) => {
  console.log(items);
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            ⚠️ Low Stock Alerts
          </h3>
          <p className="text-xs text-slate-500">
            Products requiring immediate reorder
          </p>
        </div>
        <Link
          to="/inventory"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
        >
          Manage Inventory →
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-4">
          All products have sufficient stock.
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-lg"
            >
              <span className="font-medium text-slate-800">{item.title}</span>
              <span className="font-bold text-rose-600">
                {item.stockQuantity} left
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LowStockWidget;
