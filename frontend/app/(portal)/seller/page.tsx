export default function SellerDashboard() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Seller Dashboard</h1>
          <p className="text-sm text-slate-500">Manage your inventory, incoming sub-orders, and payouts.</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700">
          + Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Pending Sub-Orders</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">12</div>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Active Products</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">84</div>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Available Payout Balance</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">SAR 3,420.50</div>
        </div>
      </div>
    </div>
  );
}
