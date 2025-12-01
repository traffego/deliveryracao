"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import Link from "next/link";

export default function CartBadge({ storeSlug }: { storeSlug: string }) {
    const items = useCartStore((state) => state.items);
    const itemCount = items.length;

    return (
        <Link
            href={`/loja/${storeSlug}/carrinho`}
            className="relative text-gray-700 hover:text-emerald-600 font-medium flex items-center gap-2"
        >
            <ShoppingCart className="w-5 h-5" />
            <span>Carrinho</span>

            {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-in zoom-in">
                    {itemCount}
                </span>
            )}
        </Link>
    );
}
