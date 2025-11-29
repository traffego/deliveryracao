"use client";

import { useCartStore } from "@/lib/store/cart-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function CartPage() {
    const params = useParams();
    const slug = params.slug as string;
    const { items, removeItem, getTotal, clearCart } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Carrinho vazio</h1>
                    <p className="text-gray-600 mb-6">
                        Adicione produtos ao seu carrinho para continuar
                    </p>
                    <Button asChild>
                        <Link href={`/loja/${slug}/produtos`}>
                            Ver Produtos
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const total = getTotal();
    const deliveryFee = 10.00;
    const finalTotal = total + deliveryFee;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Seu Carrinho</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-1">{item.productName}</h3>

                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge variant={item.orderType === "by_value" ? "default" : "secondary"}>
                                                {item.orderType === "by_value" ? "Por Valor" : "Por Quantidade"}
                                            </Badge>
                                        </div>

                                        <div className="text-sm text-gray-600 space-y-1">
                                            {item.orderType === "by_value" ? (
                                                <>
                                                    <p>Valor solicitado: <strong>{formatCurrency(item.requestedValue!)}</strong></p>
                                                    <p>Quantidade: <strong>{item.quantity.toFixed(2)} {item.unit}</strong></p>
                                                </>
                                            ) : (
                                                <p>Quantidade: <strong>{item.quantity.toFixed(2)} {item.unit}</strong></p>
                                            )}
                                            <p>Preço unitário: {formatCurrency(item.price)} / {item.unit}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-emerald-600 mb-3">
                                            {formatCurrency(item.subtotal)}
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Remover
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <Button
                        variant="outline"
                        onClick={clearCart}
                        className="w-full text-red-600 hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Limpar Carrinho
                    </Button>
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-8">
                        <CardHeader>
                            <CardTitle>Resumo do Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">{formatCurrency(total)}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Taxa de entrega</span>
                                <span className="font-medium">{formatCurrency(deliveryFee)}</span>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-4">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-2xl text-emerald-600">
                                        {formatCurrency(finalTotal)}
                                    </span>
                                </div>

                                <Button className="w-full" size="lg" asChild>
                                    <Link href={`/loja/${slug}/checkout`}>
                                        Finalizar Pedido
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>

                            <Button variant="outline" className="w-full" asChild>
                                <Link href={`/loja/${slug}/produtos`}>
                                    Continuar Comprando
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
