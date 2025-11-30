"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Package, Truck, MapPin, CreditCard, Phone, User } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type OrderStatus = "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";

type OrderItem = {
    id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    order_type: string;
};

type Order = {
    id: string;
    order_number: string;
    status: OrderStatus;
    customer_name: string;
    customer_phone: string;
    delivery_street: string;
    delivery_number: string;
    delivery_neighborhood: string;
    delivery_complement?: string;
    payment_method: string;
    subtotal: number;
    delivery_fee: number;
    total: number;
    created_at: string;
    items: OrderItem[];
};

const statusMap: Record<OrderStatus, { label: string; color: string; icon: any }> = {
    pending: { label: "Aguardando Confirmação", color: "text-yellow-600 bg-yellow-50", icon: Clock },
    confirmed: { label: "Pedido Confirmado", color: "text-blue-600 bg-blue-50", icon: CheckCircle },
    preparing: { label: "Preparando Pedido", color: "text-purple-600 bg-purple-50", icon: Package },
    out_for_delivery: { label: "Saiu para Entrega", color: "text-orange-600 bg-orange-50", icon: Truck },
    delivered: { label: "Entregue", color: "text-green-600 bg-green-50", icon: CheckCircle },
    cancelled: { label: "Cancelado", color: "text-red-600 bg-red-50", icon: CheckCircle },
};

const paymentMethodMap: Record<string, string> = {
    pix: "PIX",
    money: "Dinheiro na Entrega",
    card: "Cartão na Entrega",
    mercadopago: "Mercado Pago",
};

export default function OrderTrackingPage() {
    const params = useParams();
    const slug = params.slug as string;
    const orderId = params.orderId as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const supabase = createClient();

                // Buscar pedido
                const { data: orderData, error: orderError } = await supabase
                    .from("orders")
                    .select("*")
                    .eq("id", orderId)
                    .single();

                if (orderError) throw orderError;

                // Buscar itens do pedido
                const { data: itemsData, error: itemsError } = await supabase
                    .from("order_items")
                    .select("*")
                    .eq("order_id", orderId);

                if (itemsError) throw itemsError;

                setOrder({
                    ...orderData,
                    items: itemsData || [],
                });
            } catch (err: any) {
                console.error("Error fetching order:", err);
                setError(err.message || "Erro ao carregar pedido");
            } finally {
                setLoading(false);
            }
        }

        fetchOrder();

        // Poll a cada 30 segundos para atualizar status
        const interval = setInterval(fetchOrder, 30000);

        return () => clearInterval(interval);
    }, [orderId]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando pedido...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-4">😔</div>
                    <h1 className="text-2xl font-bold mb-4">Pedido não encontrado</h1>
                    <p className="text-gray-600 mb-6">{error || "Não conseguimos encontrar este pedido."}</p>
                    <Button asChild>
                        <Link href={`/loja/${slug}`}>Voltar para loja</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const StatusIcon = statusMap[order.status]?.icon || Clock;
    const statusInfo = statusMap[order.status] || statusMap.pending;

    // Timeline steps
    const timelineSteps = [
        { status: "pending", label: "Recebido", active: true },
        { status: "confirmed", label: "Confirmado", active: ["confirmed", "preparing", "out_for_delivery", "delivered"].includes(order.status) },
        { status: "preparing", label: "Preparando", active: ["preparing", "out_for_delivery", "delivered"].includes(order.status) },
        { status: "out_for_delivery", label: "A Caminho", active: ["out_for_delivery", "delivered"].includes(order.status) },
        { status: "delivered", label: "Entregue", active: order.status === "delivered" },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href={`/loja/${slug}`} className="text-emerald-600 hover:underline mb-4 inline-block">
                        ← Voltar para loja
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Pedido #{order.order_number}</h1>
                    <p className="text-gray-600">
                        Realizado em {new Date(order.created_at).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </p>
                </div>

                {/* Status Atual */}
                <Card className="mb-8 border-2 border-emerald-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`p-4 rounded-full ${statusInfo.color}`}>
                                <StatusIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{statusInfo.label}</h2>
                                <p className="text-gray-600">Seu pedido está em andamento</p>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="relative">
                            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200"></div>
                            <div
                                className="absolute top-5 left-0 h-1 bg-emerald-500 transition-all duration-500"
                                style={{
                                    width: `${(timelineSteps.filter(s => s.active).length - 1) / (timelineSteps.length - 1) * 100}%`
                                }}
                            ></div>

                            <div className="relative flex justify-between">
                                {timelineSteps.map((step, index) => (
                                    <div key={step.status} className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step.active
                                                    ? "bg-emerald-500 border-emerald-500 text-white"
                                                    : "bg-white border-gray-300 text-gray-400"
                                                }`}
                                        >
                                            {step.active ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                        </div>
                                        <p className={`text-xs mt-2 text-center ${step.active ? "font-semibold text-gray-900" : "text-gray-500"}`}>
                                            {step.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Informações de Entrega */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Endereço de Entrega
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-gray-700">
                                <p className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <strong>{order.customer_name}</strong>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {order.customer_phone}
                                </p>
                                <div className="pt-2 border-t">
                                    <p>{order.delivery_street}, {order.delivery_number}</p>
                                    {order.delivery_complement && <p className="text-sm text-gray-600">{order.delivery_complement}</p>}
                                    <p>{order.delivery_neighborhood}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Informações de Pagamento */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Pagamento
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Método:</span>
                                    <span className="font-semibold">{paymentMethodMap[order.payment_method] || order.payment_method}</span>
                                </div>
                                <div className="border-t pt-3 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span>{formatCurrency(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Taxa de entrega:</span>
                                        <span>{formatCurrency(order.delivery_fee)}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t">
                                        <span className="font-bold text-lg">Total:</span>
                                        <span className="font-bold text-2xl text-emerald-600">{formatCurrency(order.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Itens do Pedido */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Itens do Pedido
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-start pb-4 border-b last:border-0">
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.product_name}</p>
                                        <p className="text-sm text-gray-600">
                                            {item.quantity.toFixed(2)} x {formatCurrency(item.unit_price)}
                                        </p>
                                        {item.order_type === "by_value" && (
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1 inline-block">
                                                Pedido por valor
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-bold text-lg">{formatCurrency(item.subtotal)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Botão de WhatsApp para contato */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4">Precisa de ajuda com seu pedido?</p>
                    <Button asChild variant="outline" size="lg">
                        <a href={`https://wa.me/5511999999999?text=Olá! Gostaria de informações sobre meu pedido ${order.order_number}`} target="_blank" rel="noopener noreferrer">
                            💬 Falar no WhatsApp
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}
