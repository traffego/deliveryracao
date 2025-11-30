"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

type PaymentMethod = "pix" | "money" | "card" | "mercadopago";

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { items, getTotal, clearCart } = useCartStore();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [street, setStreet] = useState("");
    const [deliveryNumber, setDeliveryNumber] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
    const [cashAmount, setCashAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const total = getTotal();
    const deliveryFee = 10.0;
    const finalTotal = total + deliveryFee;

    const handleFinishOrder = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    storeId: "b9b9b99a-da04-471e-9e18-9af8ad79f2a1",
                    customerName: name,
                    customerPhone: phone,
                    deliveryStreet: street,
                    deliveryNumber,
                    deliveryNeighborhood: neighborhood,
                    deliveryCity: "São Paulo",
                    deliveryState: "SP",
                    deliveryZipCode: "01000-000",
                    paymentMethod,
                    cashPaymentAmount: paymentMethod === "money" ? parseFloat(cashAmount) : null,
                    items,
                    subtotal: total,
                    deliveryFee,
                    total: finalTotal,
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert(`✅ Pedido #${data.orderId.slice(0, 8)} realizado com sucesso!`);
                clearCart();
                router.push(`/loja/${slug}`);
            } else {
                alert("❌ Erro ao criar pedido: " + data.error);
            }
        } catch (error) {
            alert("❌ Erro ao processar pedido");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        router.push(`/loja/${slug}/carrinho`);
        return null;
    }

    const cashChange = cashAmount ? parseFloat(cashAmount) - finalTotal : 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <Link
                href={`/loja/${slug}/carrinho`}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao carrinho
            </Link>

            <h1 className="text-4xl font-bold mb-8">Finalizar Pedido</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Seus Dados</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nome Completo *</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="João Silva"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                                <Input
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="(11) 99999-9999"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Endereço de Entrega</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <Label htmlFor="street">Rua *</Label>
                                    <Input
                                        id="street"
                                        value={street}
                                        onChange={(e) => setStreet(e.target.value)}
                                        placeholder="Rua das Flores"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="deliveryNumber">Número *</Label>
                                    <Input
                                        id="deliveryNumber"
                                        value={deliveryNumber}
                                        onChange={(e) => setDeliveryNumber(e.target.value)}
                                        placeholder="123"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="neighborhood">Bairro *</Label>
                                <Input
                                    id="neighborhood"
                                    value={neighborhood}
                                    onChange={(e) => setNeighborhood(e.target.value)}
                                    placeholder="Centro"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Forma de Pagamento</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant={paymentMethod === "pix" ? "default" : "outline"}
                                    onClick={() => setPaymentMethod("pix")}
                                    className="h-auto py-4 flex-col"
                                >
                                    <span className="text-2xl mb-1">💳</span>
                                    <span>Pix</span>
                                </Button>

                                <Button
                                    variant={paymentMethod === "money" ? "default" : "outline"}
                                    onClick={() => setPaymentMethod("money")}
                                    className="h-auto py-4 flex-col"
                                >
                                    <span className="text-2xl mb-1">💵</span>
                                    <span>Dinheiro</span>
                                </Button>

                                <Button
                                    variant={paymentMethod === "card" ? "default" : "outline"}
                                    onClick={() => setPaymentMethod("card")}
                                    className="h-auto py-4 flex-col"
                                >
                                    <span className="text-2xl mb-1">💳</span>
                                    <span>Cartão na Entrega</span>
                                </Button>

                                <Button
                                    variant={paymentMethod === "mercadopago" ? "default" : "outline"}
                                    onClick={() => setPaymentMethod("mercadopago")}
                                    className="h-auto py-4 flex-col"
                                >
                                    <span className="text-2xl mb-1">🔵</span>
                                    <span>Mercado Pago</span>
                                </Button>
                            </div>

                            {paymentMethod === "money" && (
                                <div>
                                    <Label htmlFor="cashAmount">Troco para quanto?</Label>
                                    <Input
                                        id="cashAmount"
                                        type="number"
                                        value={cashAmount}
                                        onChange={(e) => setCashAmount(e.target.value)}
                                        placeholder="100.00"
                                    />
                                    {cashChange > 0 && (
                                        <p className="text-sm text-emerald-600 mt-2">
                                            Troco: {formatCurrency(cashChange)}
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-8">
                        <CardHeader>
                            <CardTitle>Resumo do Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <div className="flex-1">
                                            <p className="font-medium">{item.productName}</p>
                                            <p className="text-gray-600 text-xs">
                                                {item.quantity.toFixed(2)} {item.unit}
                                            </p>
                                        </div>
                                        <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">{formatCurrency(total)}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Entrega</span>
                                    <span className="font-medium">{formatCurrency(deliveryFee)}</span>
                                </div>

                                <div className="flex justify-between pt-2 border-t">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-2xl text-emerald-600">
                                        {formatCurrency(finalTotal)}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-emerald-50 p-3 rounded-lg text-sm">
                                <p className="flex items-center gap-2 text-emerald-700">
                                    <Check className="w-4 h-4" />
                                    <strong>Pagamento:</strong>
                                </p>
                                <p className="text-emerald-600 ml-6">
                                    {paymentMethod === "pix" && "Pix"}
                                    {paymentMethod === "money" && "Dinheiro na entrega"}
                                    {paymentMethod === "card" && "Cartão na entrega"}
                                    {paymentMethod === "mercadopago" && "Mercado Pago"}
                                </p>
                            </div>

                            <Button
                                onClick={handleFinishOrder}
                                disabled={
                                    !name || !phone || !street || !deliveryNumber || !neighborhood || loading
                                }
                                className="w-full"
                                size="lg"
                            >
                                {loading ? "Processando..." : "Finalizar Pedido"}
                            </Button>

                            <p className="text-xs text-center text-gray-500">
                                Ao finalizar, você concorda com nossos termos
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
