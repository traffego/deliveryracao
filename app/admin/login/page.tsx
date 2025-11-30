"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Shield } from "lucide-react";
import { signInAdmin } from "@/lib/auth/auth-helpers";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signInAdmin(email, password);

            if (result.success) {
                // Redirecionar para dashboard admin
                router.push("/admin/dashboard");
                router.refresh();
            } else {
                setError(result.error || "Erro ao fazer login");
            }
        } catch (err) {
            setError("Erro inesperado. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Painel Administrativo
                    </h1>
                    <p className="text-gray-600">
                        Acesso restrito para administradores
                    </p>
                </div>

                {/* Card de Login */}
                <Card className="shadow-xl border-2">
                    <CardHeader>
                        <CardTitle>Login de Administrador</CardTitle>
                        <CardDescription>
                            Digite suas credenciais para acessar o painel
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <Label htmlFor="email">E-mail</Label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@exemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Senha */}
                            <div>
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative mt-1">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            {/* Erro */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    ⚠️ {error}
                                </div>
                            )}

                            {/* Botão */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                                size="lg"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Entrando...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-5 h-5" />
                                        Entrar no Painel
                                    </div>
                                )}
                            </Button>
                        </form>

                        {/* Informações de Segurança */}
                        <div className="mt-6 pt-6 border-t">
                            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900">
                                <p className="font-semibold mb-2 flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Segurança
                                </p>
                                <ul className="space-y-1 text-xs">
                                    <li>🔒 Conexão criptografada</li>
                                    <li>🛡️ Autenticação de dois fatores disponível</li>
                                    <li>📝 Todos os acessos são registrados</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Problemas para acessar?{" "}
                    <a href="mailto:suporte@doglivery.com" className="text-emerald-600 hover:underline">
                        Entre em contato
                    </a>
                </p>
            </div>
        </div>
    );
}
