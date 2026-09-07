import Link from 'next/link';
import { ShoppingBag, Store, Search } from 'lucide-react';
import '../globals.css';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <Link href="/" className="text-xl font-bold tracking-tight text-emerald-600 flex items-center gap-2">
              <Store className="w-6 h-6" />
              <span>WeJoinLife</span>
            </Link>

            <div className="flex-1 max-w-lg relative hidden sm:block">
              <input
                type="text"
                placeholder="Search products across all shops..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>

            <div className="flex items-center gap-4">
              <Link href="/shops" className="text-sm font-medium text-slate-600 hover:text-emerald-600 flex items-center gap-1">
                <Store className="w-4 h-4" />
                <span>Shops</span>
              </Link>
              <Link href="/cart" className="text-sm font-medium text-slate-600 hover:text-emerald-600 flex items-center gap-1 relative">
                <ShoppingBag className="w-5 h-5" />
                <span>Cart</span>
              </Link>
              <Link href="/seller" className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium">
                Seller Portal
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
          {children}
        </main>

        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          © 2026 WeJoinLife Marketplace. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
