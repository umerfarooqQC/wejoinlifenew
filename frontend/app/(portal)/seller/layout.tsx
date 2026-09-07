import Link from 'next/link';
import { Package, ShoppingCart, Wallet, Store, LayoutDashboard } from 'lucide-react';
import '../../globals.css';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900 flex font-sans">
        <aside className="w-64 bg-slate-900 text-white p-6 space-y-6 flex flex-col justify-between hidden md:flex">
          <div className="space-y-6">
            <Link href="/" className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <Store className="w-5 h-5" />
              <span>WeJoinLife Seller</span>
            </Link>
            <nav className="space-y-1 text-sm">
              <Link href="/seller" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-white">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link href="/seller/products" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <Package className="w-4 h-4" />
                <span>Products & Stock</span>
              </Link>
              <Link href="/seller/orders" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <ShoppingCart className="w-4 h-4" />
                <span>Sub-Orders</span>
              </Link>
              <Link href="/seller/wallet" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <Wallet className="w-4 h-4" />
                <span>Wallet & Payouts</span>
              </Link>
            </nav>
          </div>
          <div className="text-xs text-slate-500">
            Logged in as Seller
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
