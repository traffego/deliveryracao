"use client";

import { ShoppingCart, X, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function CartModal({
    isOpen,
    onClose,
    storeSlug,
}: {
    isOpen: boolean;
    onClose: () => void;
    storeSlug: string;
}) {
    const items = useCartStore((state) => state.items);
    const total = useCartStore((state) => state.getTotal());

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-40 animate-in fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 animate-in slide-in-from-right">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Carrinho</h2>
                                <p className="text-sm text-gray-600">
                                    {items.length} {items.length === 1 ? 'item' : 'itens'}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {items.length === 0 ? (
                            <div className="text-center py-12">
                                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-600 mb-2">Carrinho vazio</p>
                                <p className="text-sm text-gray-500">
                                    Adicione produtos para continuar
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-gray-50 rounded-lg p-4"
                                    >
                                        <h3 className="font-semibold mb-1">{item.productName}</h3>
                                        <div className="flex justify-between items-center text-sm text-gray-600">
                                            <span>
                                                {item.quantity.toFixed(2)} {item.unit}
                                                {item.orderType === 'by_value' && ' (por valor)'}
                                                {item.orderType === 'by_bag' && ` - ${item.bagSize}`}
                                            </span>
                                            <span className="font-bold text-emerald-600">
                                                {formatCurrency(item.subtotal)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="border-t p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Total:</span>
                                <span className="text-2xl font-bold text-emerald-600">
                                    {formatCurrency(total)}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <Button
                                    asChild
                                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                                    size="lg"
                                >
                                    <Link href={`/loja/${storeSlug}/checkout`}>
                                        <ArrowRight className="mr-2 h-5 w-5" />
                                        Finalizar Compra
                                    </Link>
                                </Button>

                                <Button
                                    onClick={onClose}
                                    variant="outline"
                                    className="w-full"
                                    size="lg"
                                >
                                    Continuar Comprando
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
