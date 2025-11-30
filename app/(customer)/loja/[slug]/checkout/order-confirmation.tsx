"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, QrCode, CreditCard, Banknote } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

type OrderConfirmationProps = {
    orderId: string;
    orderNumber: string;
    total: number;
    paymentMethod: string;
    storeSlug: string;
};

export default function OrderConfirmation({
    orderId,
    orderNumber,
    total,
    paymentMethod,
    storeSlug
}: OrderConfirmationProps) {
    const [pixCode] = useState("00020126580014br.gov.bcb.pix0136" + orderId.substring(0, 20));

    const copyPixCode = () => {
        navigator.clipboard.writeText(pixCode);
        alert("✅ Código PIX copiado!");
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Sucesso */}
                <div className="text-center mb-8">
                    <CheckCircle className="w-20 h-20 text-emerald-600 mx-auto mb-4 animate-bounce" />
                    <h1 className="text-4xl font-bold mb-2">🎉 Pedido Confirmado!</h1>
                    <p className="text-xl text-gray-600">Número: <strong>#{orderNumber}</strong></p>
                </div>

                {/* PIX */}
                {paymentMethod === "pix" && (
                    <Card className="mb-6 border-emerald-500 border-2">
                        <CardHeader className="bg-emerald-50">
                            <CardTitle className="flex items-center gap-2">
                                <QrCode className="w-6 h-6 text-emerald-600" />
                                Pagamento via PIX
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-6">
                                {/* QR Code Simulado */}
                                <div className="bg-white p-6 rounded-xl border-4 border-emerald-600 mx-auto w-64 h-64 flex items-center justify-center shadow-lg">
                                    <div className="text-center">
                                        <QrCode className="w-48 h-48 text-gray-800 mx-auto" strokeWidth={1} />
                                        <p className="text-sm text-gray-600 mt-2">Escaneie para pagar</p>
                                    </div>
                                </div>

                                {/* Código Copia e Cola */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                                        💳 Código PIX Copia e Cola:
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={pixCode}
                                            readOnly
                                            className="flex-1 px-4 py-3 border-2 rounded-lg bg-gray-50 text-sm font-mono"
                                        />
                                        <Button
                                            onClick={copyPixCode}
                                            size="lg"
                                            className="bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            Copiar
                                        </Button>
                                    </div>
                                </div>

                                {/* Valor */}
                                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border-2 border-emerald-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-lg font-semibold text-gray-700">Valor a pagar:</span>
                                        <span className="text-3xl font-bold text-emerald-600">{formatCurrency(total)}</span>
                                    </div>
                                    <p className="text-sm text-emerald-700 mt-3">
                                        ✅ O pagamento será confirmado automaticamente após processar o PIX
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Dinheiro */}
                {paymentMethod === "money" && (
                    <Card className="mb-6 border-green-500 border-2">
                        <CardHeader className="bg-green-50">
                            <CardTitle className="flex items-center gap-2">
                                <Banknote className="w-6 h-6 text-green-600" />
                                Pagamento em Dinheiro
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-xl border-2 border-green-200 text-center">
                                <p className="text-2xl font-bold text-green-700 mb-4">
                                    💵 Pagamento na Entrega
                                </p>
                                <div className="mb-4">
                                    <span className="text-lg text-gray-700">Valor:</span>
                                    <p className="text-4xl font-bold text-green-600 mt-2">{formatCurrency(total)}</p>
                                </div>
                                <p className="text-sm text-green-700 bg-green-100 p-4 rounded-lg mt-4">
                                    💡 Tenha o dinheiro separado para facilitar a entrega!
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Cartão */}
                {paymentMethod === "card" && (
                    <Card className="mb-6 border-purple-500 border-2">
                        <CardHeader className="bg-purple-50">
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-6 h-6 text-purple-600" />
                                Pagamento com Cartão
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl border-2 border-purple-200 text-center">
                                <p className="text-2xl font-bold text-purple-700 mb-4">
                                    💳 Maquininha na Entrega
                                </p>
                                <div className="mb-4">
                                    <span className="text-lg text-gray-700">Valor:</span>
                                    <p className="text-4xl font-bold text-purple-600 mt-2">{formatCurrency(total)}</p>
                                </div>
                                <p className="text-sm text-purple-700 bg-purple-100 p-4 rounded-lg mt-4">
                                    💡 A maquininha será levada pelo entregador. Aceitamos crédito e débito!
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Próximos Passos */}
                <Card className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <CardHeader>
                        <CardTitle className="text-blue-900">📦 Acompanhe seu Pedido</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                <span className="text-white font-bold text-lg">1</span>
                            </div>
                            <div>
                                <p className="font-semibold text-lg text-gray-800">✅ Pedido em Análise</p>
                                <p className="text-sm text-gray-600">Aguardando confirmação de pagamento</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-white rounded-lg">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-600 font-bold text-lg">2</span>
                            </div>
                            <div>
                                <p className="font-semibold text-lg text-gray-600">🔨 Preparando Pedido</p>
                                <p className="text-sm text-gray-500">Seus produtos serão separados</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-white rounded-lg">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-600 font-bold text-lg">3</span>
                            </div>
                            <div>
                                <p className="font-semibold text-lg text-gray-600">🚚 Saiu para Entrega</p>
                                <p className="text-sm text-gray-500">Entrega em 30-60 minutos</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="flex-1 border-2 hover:bg-gray-50"
                    >
                        <Link href={`/loja/${storeSlug}`}>
                            ← Voltar para Loja
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg"
                    >
                        <Link href={`/loja/${storeSlug}/pedidos/${orderId}`}>
                            📦 Acompanhar Pedido
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
