"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, QrCode, CreditCard, Banknote, Loader2 } from "lucide-react";
import Link from "next/link";

export default function OrderConfirmationPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params.slug as string;

    const orderId = searchParams.get("orderId");
    const orderNumber = searchParams.get("orderNumber");
    const paymentMethod = searchParams.get("paymentMethod");
    const total = searchParams.get("total");

    console.log("Order confirmation page loaded", { orderId, orderNumber, paymentMethod, total });

    const [pixCode, setPixCode] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (paymentMethod === "pix") {
            // Simular geração de código PIX
            setTimeout(() => {
                setPixCode("00020126580014br.gov.bcb.pix013612345678");
                setLoading(false);
            }, 1000);
        } else {
            setLoading(false);
        }
    }, [paymentMethod]);

    if (!orderId) {
        console.log("No orderId found, showing error page");
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <p>Pedido não encontrado</p>
                <Button asChild className="mt-4">
                    <Link href={`/loja/${slug}`}>Voltar para loja</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Confirmação de Pedido */}
                <div className="text-center mb-8">
                    <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold mb-2">Pedido Realizado!</h1>
                    <p className="text-gray-600">Número do pedido: <strong>#{orderNumber}</strong></p>
                </div>

                {/* PIX */}
                {paymentMethod === "pix" && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <QrCode className="w-5 h-5" />
                                Pagamento via PIX
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
                                    <p className="text-gray-600">Gerando QR Code...</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* QR Code Simulado */}
                                    <div className="bg-white p-4 rounded-lg border-2 border-emerald-600 mx-auto w-64 h-64 flex items-center justify-center">
                                        <div className="text-center">
                                            <QrCode className="w-48 h-48 text-gray-800 mx-auto mb-2" />
                                            <p className="text-xs text-gray-500">QR Code PIX</p>
                                        </div>
                                    </div>

                                    {/* Código PIX Copia e Cola */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Código PIX Copia e Cola:
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={pixCode}
                                                readOnly
                                                className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm"
                                            />
                                            <Button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(pixCode);
                                                    alert("Código copiado!");
                                                }}
                                                size="sm"
                                            >
                                                Copiar
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>Valor:</strong> R$ {total}
                                        </p>
                                        <p className="text-xs text-blue-600 mt-2">
                                            O pagamento será confirmado automaticamente após o PIX ser processado.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Dinheiro */}
                {paymentMethod === "money" && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Banknote className="w-5 h-5" />
                                Pagamento em Dinheiro
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-green-800 font-medium mb-2">
                                        Pagamento na entrega
                                    </p>
                                    <p className="text-sm text-green-700">
                                        Valor: <strong>R$ {total}</strong>
                                    </p>
                                    <p className="text-xs text-green-600 mt-2">
                                        Tenha o dinheiro separado para facilitar a entrega!
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Cartão */}
                {paymentMethod === "card" && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Pagamento com Cartão
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <p className="text-purple-800 font-medium mb-2">
                                        Pagamento na entrega
                                    </p>
                                    <p className="text-sm text-purple-700">
                                        Valor: <strong>R$ {total}</strong>
                                    </p>
                                    <p className="text-xs text-purple-600 mt-2">
                                        A maquininha será levada pelo entregador. Aceitamos crédito e débito!
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Mercado Pago */}
                {paymentMethod === "mercadopago" && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                💳 Mercado Pago
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-blue-800 font-medium mb-2">
                                        Processando pagamento...
                                    </p>
                                    <p className="text-sm text-blue-700">
                                        Você será redirecionado para completar o pagamento.
                                    </p>
                                </div>
                                <Button className="w-full" size="lg">
                                    Ir para Mercado Pago
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Próximos Passos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Próximos Passos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-emerald-600 font-bold">1</span>
                            </div>
                            <div>
                                <p className="font-medium">Pedido em análise</p>
                                <p className="text-sm text-gray-600">Aguardando confirmação de pagamento</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-600 font-bold">2</span>
                            </div>
                            <div>
                                <p className="font-medium">Preparando pedido</p>
                                <p className="text-sm text-gray-600">Seus produtos serão separados</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-600 font-bold">3</span>
                            </div>
                            <div>
                                <p className="font-medium">Saiu para entrega</p>
                                <p className="text-sm text-gray-600">Entrega em 30-60 minutos</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Ações */}
                <div className="flex gap-4 mt-6">
                    <Button asChild className="flex-1" variant="outline">
                        <Link href={`/loja/${slug}`}>
                            Voltar para loja
                        </Link>
                    </Button>
                    <Button asChild className="flex-1">
                        <Link href={`/loja/${slug}/pedidos/${orderId}`}>
                            Acompanhar Pedido
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
