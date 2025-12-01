"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart, Package2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useRouter } from "next/navigation";

type OrderMode = "quantity" | "value" | "bag";

type BagOption = {
    size: string;
    weight: number;
    price: number;
    stock: number;
    sku?: string;
};

const PRESET_VALUES = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

export default function ProductOrderSelector({
    product,
    storeSlug,
}: {
    product: {
        id: string;
        name: string;
        slug: string;
        product_type: string;
        price: number;
        unit: string;
        order_mode: string;
        min_order_quantity?: number;
        min_order_value?: number;
        bag_options?: BagOption[];
        default_order_mode?: 'value' | 'quantity' | 'bag';
    };
    storeSlug: string;
}) {
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);

    const hasBagOptions = product.bag_options && product.bag_options.length > 0;

    // Usar o modo padrão configurado no banco, ou 'value' como fallback
    const defaultMode: OrderMode = (product.default_order_mode as OrderMode) || "value";

    const [mode, setMode] = useState<OrderMode>(defaultMode);
    const [quantity, setQuantity] = useState(product.min_order_quantity || 1);
    const [value, setValue] = useState(10);
    const [selectedBag, setSelectedBag] = useState<BagOption | null>(
        hasBagOptions && product.bag_options ? product.bag_options[0] : null
    );
    const [bagQuantity, setBagQuantity] = useState(1);

    const canOrderByValue = product.order_mode === "both" || product.order_mode === "value";
    const canOrderByQuantity = product.order_mode === "both" || product.order_mode === "quantity";

    const calculatedValue = quantity * product.price;
    const calculatedQuantity = value / product.price;

    const handleAddToCart = () => {
        if (mode === "bag" && selectedBag) {
            // Adicionar saco fechado
            addItem({
                id: `${product.id}-bag-${selectedBag.size}-${Date.now()}`,
                productId: product.id,
                productName: `${product.name} - Saco ${selectedBag.size}`,
                productSlug: product.slug,
                productType: "packaged",
                price: selectedBag.price,
                unit: "un",
                orderType: "by_bag",
                quantity: bagQuantity,
                bagSize: selectedBag.size,
                bagWeight: selectedBag.weight,
                subtotal: selectedBag.price * bagQuantity,
            });
        } else {
            // Lógica existente para valor/quantidade
            const finalQuantity = mode === "value" ? calculatedQuantity : quantity;
            const finalValue = mode === "value" ? value : calculatedValue;

            addItem({
                id: `${product.id}-${mode}-${Date.now()}`,
                productId: product.id,
                productName: product.name,
                productSlug: product.slug,
                productType: product.product_type,
                price: product.price,
                unit: product.unit,
                orderType: mode === "value" ? "by_value" : "by_quantity",
                quantity: finalQuantity,
                requestedValue: mode === "value" ? value : undefined,
                subtotal: finalValue,
            });
        }

        router.push(`/loja/${storeSlug}/carrinho`);
    };

    const showModeSelector = (canOrderByValue || canOrderByQuantity) && hasBagOptions;

    return (
        <Card>
            <CardContent className="p-6">
                {/* Seletor de Modo */}
                {showModeSelector && (
                    <div className="flex gap-2 mb-6">
                        {hasBagOptions && (
                            <Button
                                variant={mode === "bag" ? "default" : "outline"}
                                onClick={() => setMode("bag")}
                                className="flex-1"
                            >
                                <Package2 className="mr-2 h-4 w-4" />
                                Saco Fechado
                            </Button>
                        )}
                        {canOrderByValue && (
                            <Button
                                variant={mode === "value" ? "default" : "outline"}
                                onClick={() => setMode("value")}
                                className="flex-1"
                            >
                                Por Valor (R$)
                            </Button>
                        )}
                        {canOrderByQuantity && (
                            <Button
                                variant={mode === "quantity" ? "default" : "outline"}
                                onClick={() => setMode("quantity")}
                                className="flex-1"
                            >
                                Por Peso
                            </Button>
                        )}
                    </div>
                )}

                {/* Mostrar seletor de sacos apenas se tiver bag_options E não tiver outros modos */}
                {!showModeSelector && hasBagOptions && !canOrderByValue && !canOrderByQuantity && (
                    <div className="mb-4">
                        <Label className="text-lg font-semibold mb-3 block">Opções de Sacos</Label>
                    </div>
                )}

                {/* Modo: Saco Fechado */}
                {mode === "bag" && hasBagOptions && (
                    <div className="space-y-4">
                        <Label>Escolha o tamanho do saco</Label>

                        {/* Grid de opções de sacos */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {product.bag_options!.map((bag) => (
                                <button
                                    key={bag.size}
                                    onClick={() => setSelectedBag(bag)}
                                    className={`
                                        relative p-4 rounded-lg border-2 transition-all text-left
                                        ${selectedBag?.size === bag.size
                                            ? "border-emerald-500 bg-emerald-50"
                                            : "border-gray-200 hover:border-emerald-300"
                                        }
                                    `}
                                >
                                    <div className="font-bold text-lg">{bag.size}</div>
                                    <div className="text-emerald-600 font-semibold">
                                        R$ {bag.price.toFixed(2)}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {bag.stock > 0 ? (
                                            <span className="text-green-600">
                                                {bag.stock} em estoque
                                            </span>
                                        ) : (
                                            <span className="text-red-600">Indisponível</span>
                                        )}
                                    </div>

                                    {selectedBag?.size === bag.size && (
                                        <div className="absolute top-2 right-2">
                                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                                <svg
                                                    className="w-4 h-4 text-white"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Quantidade de sacos */}
                        {selectedBag && (
                            <>
                                <div className="pt-4">
                                    <Label>Quantidade de sacos</Label>
                                    <div className="flex items-center gap-3 mt-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setBagQuantity(Math.max(1, bagQuantity - 1))}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>

                                        <Input
                                            type="number"
                                            value={bagQuantity}
                                            onChange={(e) => setBagQuantity(parseInt(e.target.value) || 1)}
                                            min="1"
                                            max={selectedBag.stock}
                                            className="text-center text-xl font-bold"
                                        />

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                setBagQuantity(
                                                    Math.min(selectedBag.stock, bagQuantity + 1)
                                                )
                                            }
                                            disabled={bagQuantity >= selectedBag.stock}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Resumo */}
                                <div className="bg-emerald-50 p-4 rounded-lg space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Peso total:</span>
                                        <span className="font-semibold">
                                            {(selectedBag.weight * bagQuantity).toFixed(1)} kg
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Preço unitário:</span>
                                        <span className="font-semibold">
                                            R$ {selectedBag.price.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-emerald-200">
                                        <span className="text-gray-700 font-semibold">Total:</span>
                                        <span className="text-2xl font-bold text-emerald-600">
                                            R$ {(selectedBag.price * bagQuantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Modo: Por Valor */}
                {mode === "value" && canOrderByValue && (
                    <div className="space-y-4">
                        <Label>Escolha o valor</Label>

                        <div className="grid grid-cols-5 gap-2">
                            {PRESET_VALUES.map((presetValue) => (
                                <Button
                                    key={presetValue}
                                    variant={value === presetValue ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setValue(presetValue)}
                                    className="font-bold"
                                >
                                    R${presetValue}
                                </Button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setValue(Math.max(5, value - 5))}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>

                            <div className="flex-1">
                                <Input
                                    type="number"
                                    value={value}
                                    onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                                    step="5"
                                    min={product.min_order_value || 5}
                                    className="text-center text-xl font-bold"
                                />
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setValue(value + 5)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="bg-emerald-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Você receberá aproximadamente:</p>
                            <p className="text-2xl font-bold text-emerald-600">
                                {calculatedQuantity.toFixed(2)} {product.unit}
                            </p>
                        </div>
                    </div>
                )}

                {/* Modo: Por Quantidade */}
                {mode === "quantity" && canOrderByQuantity && (
                    <div className="space-y-4">
                        <Label>Quantidade ({product.unit})</Label>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>

                            <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                                step="0.5"
                                min={product.min_order_quantity || 0.5}
                                className="text-center text-xl font-bold"
                            />

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setQuantity(quantity + 0.5)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="bg-emerald-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Total:</p>
                            <p className="text-2xl font-bold text-emerald-600">
                                R$ {calculatedValue.toFixed(2)}
                            </p>
                        </div>
                    </div>
                )}

                <Button
                    onClick={handleAddToCart}
                    className="w-full mt-6"
                    size="lg"
                    disabled={mode === "bag" && (!selectedBag || selectedBag.stock === 0)}
                >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Adicionar ao Carrinho
                </Button>
            </CardContent>
        </Card>
    );
}
