"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Phone, KeyRound } from "lucide-react";
import { signUpCustomer, signInCustomer } from "@/lib/auth/auth-helpers";

type QuickAuthModalProps = {
    phone: string;
    name: string;
    onSuccess: (userId: string) => void;
    onSkip?: () => void;
};

export default function QuickAuthModal({ phone, name, onSuccess, onSkip }: QuickAuthModalProps) {
    const [isSignup, setIsSignup] = useState(true);
    const [loading, setLoading] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

    const handleSignUp = async () => {
        if (!name || !phone) {
            alert("⚠️ Preencha nome e telefone");
            return;
        }

        setLoading(true);
        try {
            const result = await signUpCustomer(name, phone);

            if (result.success && result.user) {
                setGeneratedPassword(result.password!);
                // Mostrar senha gerada por 5 segundos antes de continuar
                setTimeout(() => {
                    onSuccess(result.user!.id);
                }, 5000);
            } else {
                alert(`❌ ${result.error}`);
            }
        } catch (error) {
            alert("❌ Erro ao criar conta");
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async () => {
        if (!phone) {
            alert("⚠️ Digite seu telefone");
            return;
        }

        setLoading(true);
        try {
            const result = await signInCustomer(phone);

            if (result.success && result.profile) {
                onSuccess(result.profile.id);
            } else if (result.needsSignup) {
                alert("📱 Telefone não cadastrado. Vamos criar sua conta!");
                setIsSignup(true);
            } else {
                alert(`❌ ${result.error}`);
            }
        } catch (error) {
            alert("❌ Erro ao fazer login");
        } finally {
            setLoading(false);
        }
    };

    // Se senha foi gerada, mostrar ela
    if (generatedPassword) {
        return (
            <Card className="border-emerald-500 border-2">
                <CardHeader className="bg-emerald-50">
                    <CardTitle className="flex items-center gap-2 text-emerald-900">
                        <KeyRound className="w-6 h-6" />
                        ✅ Conta Criada com Sucesso!
                    </CardTitle>
                    <CardDescription>
                        Guarde esta senha para futuros pedidos
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="bg-white p-6 rounded-lg border-2 border-emerald-600">
                        <p className="text-sm text-gray-700 mb-3">
                            📱 <strong>Telefone:</strong> {phone}
                        </p>
                        <div className="bg-emerald-50 p-4 rounded-lg">
                            <p className="text-xs text-emerald-700 mb-2">Sua senha gerada:</p>
                            <p className="text-2xl font-mono font-bold text-emerald-900 break-all">
                                {generatedPassword}
                            </p>
                        </div>
                        <p className="text-xs text-gray-600 mt-4 text-center">
                            💡 Anote ou tire uma foto desta senha
                        </p>
                    </div>
                    <p className="text-sm text-center text-gray-500 mt-4">
                        Continuando em 5 segundos...
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {isSignup ? "Criar Conta Rápida" : "Fazer Login"}
                </CardTitle>
                <CardDescription>
                    {isSignup
                        ? "Crie sua conta em segundos para acompanhar seus pedidos"
                        : "Entre com seu telefone cadastrado"
                    }
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isSignup && (
                    <div>
                        <Label htmlFor="quick-name">Nome Completo</Label>
                        <Input
                            id="quick-name"
                            value={name}
                            disabled
                            className="bg-gray-50"
                        />
                    </div>
                )}

                <div>
                    <Label htmlFor="quick-phone">Telefone</Label>
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <Input
                            id="quick-phone"
                            value={phone}
                            disabled
                            className="bg-gray-50"
                        />
                    </div>
                </div>

                <div className="pt-4 space-y-3">
                    <Button
                        onClick={isSignup ? handleSignUp : handleSignIn}
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        size="lg"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Processando...
                            </div>
                        ) : (
                            isSignup ? "✨ Criar Conta Grátis" : "🔓 Entrar"
                        )}
                    </Button>

                    <Button
                        onClick={() => setIsSignup(!isSignup)}
                        variant="ghost"
                        className="w-full"
                        size="sm"
                    >
                        {isSignup
                            ? "Já tem conta? Fazer login"
                            : "Não tem conta? Criar agora"
                        }
                    </Button>

                    {onSkip && (
                        <Button
                            onClick={onSkip}
                            variant="outline"
                            className="w-full"
                            size="sm"
                        >
                            Continuar sem cadastro
                        </Button>
                    )}
                </div>

                {isSignup && (
                    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900">
                        <p className="font-semibold mb-2">✨ Por que criar conta?</p>
                        <ul className="space-y-1 text-xs">
                            <li>✅ Acompanhe seus pedidos em tempo real</li>
                            <li>✅ Histórico completo de compras</li>
                            <li>✅ Checkout mais rápido nos próximos pedidos</li>
                            <li>✅ Sem necessidade de decorar senha - ela é gerada automaticamente!</li>
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
