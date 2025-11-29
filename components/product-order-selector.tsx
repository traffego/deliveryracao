"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";

type OrderMode = "quantity" | "value";

const PRESET_VALUES = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

export default function ProductOrderSelector({
    product,
}: {
    product: {
        price: number;
        unit: string;
        order_mode: string;
        min_order_quantity?: number;
        min_order_value?: number;
    };
}) {
    const [mode, setMode] = useState<OrderMode>("value");
    const [quantity, setQuantity] = useState(product.min_order_quantity || 1);
    const [value, setValue] = useState(10);

    const canOrderByValue = product.order_mode === "both" || product.order_mode === "value";
    const canOrderByQuantity = product.order_mode === "both" || product.order_mode === "quantity";

    const calculatedValue = quantity * product.price;
    const calculatedQuantity = value / product.price;

    return (
        <Card>
            <CardContent className="p-6">
                {product.order_mode === "both" && (
                    <div className="flex gap-2 mb-6">
                        <Button
                            variant={mode === "value" ? "default" : "outline"}
                            onClick={() => setMode("value")}
                            className="flex-1"
                        >
                            Por Valor (R$)
                        </Button>
                        <Button
                            variant={mode === "quantity" ? "default" : "outline"}
                            onClick={() => setMode("quantity")}
                            className="flex-1"
                        >
                            Por Quantidade
                        </Button>
                    </div>
                )}

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

                <Button className="w-full mt-6" size="lg">
                    Adicionar ao Carrinho
                </Button>
            </CardContent>
        </Card>
    );
}
