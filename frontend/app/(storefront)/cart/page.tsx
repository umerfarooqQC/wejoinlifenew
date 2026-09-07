'use client';

import { useCartStore } from '@/stores/useCartStore';
import Link from 'next/link';
import { Trash2, Store, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getGrandTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="inline-flex p-4 rounded-full bg-slate-100 text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-700">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500">Browse shops to discover products you love.</p>
        <Link href="/" className="inline-block bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700">
          Start Shopping
        </Link>
      </div>
    );
  }

  // Group items by Shop Name
  const itemsByShop = items.reduce((acc, item) => {
    acc[item.shopName] = acc[item.shopName] || [];
    acc[item.shopName].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Your Cart</h1>
      
      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
        <span>ℹ️</span>
        <span>Your order contains items from {Object.keys(itemsByShop).length} shops and will be delivered in multiple shipments.</span>
      </div>

      <div className="space-y-6">
        {Object.entries(itemsByShop).map(([shopName, shopItems]) => {
          const shopSubtotal = shopItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          return (
            <div key={shopName} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span>{shopName}</span>
                </div>
                <div className="text-xs text-slate-500">{shopItems.length} items</div>
              </div>

              <div className="divide-y divide-slate-100">
                {shopItems.map((item) => (
                  <div key={item.productId} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-slate-800">{item.name}</div>
                      <div className="text-xs text-slate-500">SAR {item.price.toFixed(2)} each</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden text-xs">
                        <button
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 bg-slate-50 hover:bg-slate-100"
                        >-</button>
                        <span className="px-3 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-2 py-1 bg-slate-50 hover:bg-slate-100"
                        >+</button>
                      </div>
                      <div className="font-semibold text-sm w-20 text-right">
                        SAR {(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-600">
                <span>Shop Subtotal:</span>
                <span className="font-semibold text-slate-800">SAR {shopSubtotal.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex justify-between items-center text-base font-bold text-slate-800">
          <span>Total:</span>
          <span className="text-emerald-600 text-xl">SAR {getGrandTotal().toFixed(2)}</span>
        </div>
        <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
