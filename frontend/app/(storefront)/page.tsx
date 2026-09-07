import Link from 'next/link';
import { Store, Tag, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'WeJoinLife - Multi-Seller Marketplace',
  description: 'Shop thousands of products from independent verified sellers and local shops.',
};

export default function StorefrontHomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 sm:p-12 shadow-md">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Top Local Sellers</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Shop from Multiple Sellers in One Place
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base">
            Browse verified shops, compare prices, and order with a single grouped checkout. No login required to explore!
          </p>
          <div className="pt-2 flex gap-3">
            <Link href="/shops" className="bg-white text-emerald-700 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-50 transition shadow-sm">
              Explore Shops
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Shops */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-600" />
            <span>Verified Shops</span>
          </h2>
          <Link href="/shops" className="text-sm font-medium text-emerald-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition">
            <div className="font-semibold text-slate-800">Nahda Mart</div>
            <div className="text-xs text-slate-500">Groceries & Health • ★ 4.9 (120 reviews)</div>
            <div className="mt-3 text-xs text-emerald-600 font-medium">⚡ Express Delivery Available</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition">
            <div className="font-semibold text-slate-800">MedPlus Pharmacy</div>
            <div className="text-xs text-slate-500">Medicines & Care • ★ 4.8 (340 reviews)</div>
            <div className="mt-3 text-xs text-emerald-600 font-medium">Verified Merchant</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition">
            <div className="font-semibold text-slate-800">Organic Valley</div>
            <div className="text-xs text-slate-500">Fresh Organics • ★ 5.0 (89 reviews)</div>
            <div className="mt-3 text-xs text-emerald-600 font-medium">Farm Direct</div>
          </div>
        </div>
      </section>
    </div>
  );
}
