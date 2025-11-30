"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Copy, Check, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PixPaymentPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const slug = params.slug as string;

    const orderId = searchParams.get("orderId");
    const orderNumber = searchParams.get("orderNumber");
    const total = searchParams.get("total");

    const [copied, setCopied] = useState(false);
    const [checking, setChecking] = useState(false);

    // PIX código simulado (em produção seria gerado pela API de pagamento)
    const pixCode = `00020126580014br.gov.bcb.pix0136${orderId}520400005303986540${total}5802BR5925DogLivery6009SAO PAULO62070503***6304`;

    const handleCopy = () => {
        navigator.clipboard.writeText(pixCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCheckPayment = () => {
        setChecking(true);
        // Simular verificação
        setTimeout(() => {
            setChecking(false);
            router.push(`/loja/${slug}/pedido/${orderId}`);
        }, 2000);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                        <Check className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Pedido Confirmado!</h1>
                    <p className="text-gray-600">
                        Pedido <strong>#{orderNumber}</strong>
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <QrCode className="w-5 h-5" />
                            Pagamento via PIX
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-lg">
                            <div className="bg-white p-4 rounded-lg w-64 h-64 mx-auto flex items-center justify-center">
                                <div className="text-center">
                                    <QrCode className="w-32 h-32 mx-auto text-gray-400 mb-2" />
                                    <p className="text-xs text-gray-500">QR Code simulado</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Ou copie o código PIX:
                            </p>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-gray-50 p-3 rounded border text-xs font-mono break-all text-gray-600">
                                    {pixCode.slice(0, 80)}...
                                </div>
                                <Button onClick={handleCopy} variant="outline" size="icon">
                                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800 mb-2 font-medium">
                                📱 Como pagar com PIX:
                            </p>
                            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                                <li>Abra o app do seu banco</li>
                                <li>Escolha pagar com PIX</li>
                                <li>Escaneie o QR Code ou cole o código</li>
                                <li>Confirme o pagamento</li>
                            </ol>
                        </div>

                        <div className="text-center space-y-3">
                            <p className="text-sm text-gray-600">
                                Valor total: <strong className="text-lg text-emerald-600">R$ {total}</strong>
                            </p>

                            <Button
                                onClick={handleCheckPayment}
                                disabled={checking}
                                className="w-full"
                                size="lg"
                            >
                                {checking ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Verificando pagamento...
                                    </>
                                ) : (
                                    "Já paguei - Verificar status"
                                )}
                            </Button>

                            <Button variant="outline" className="w-full" asChild>
                                <Link href={`/loja/${slug}`}>Voltar para loja</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
