"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Search, Clock, CheckCircle, Truck, Phone, User, LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser, signOut } from "@/lib/auth/auth-helpers";

type OrderStatus = "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";

type Order = {
    id: string;
    order_number: string;
    status: OrderStatus;
    customer_name: string;
    customer_phone: string;
    payment_method: string;
    total: number;
    created_at: string;
};

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: any }> = {
    pending: { label: "Aguardando", color: "text-yellow-700", bgColor: "bg-yellow-100", icon: Clock },
    confirmed: { label: "Confirmado", color: "text-blue-700", bgColor: "bg-blue-100", icon: CheckCircle },
    preparing: { label: "Preparando", color: "text-purple-700", bgColor: "bg-purple-100", icon: Package },
    out_for_delivery: { label: "A Caminho", color: "text-orange-700", bgColor: "bg-orange-100", icon: Truck },
    delivered: { label: "Entregue", color: "text-green-700", bgColor: "bg-green-100", icon: CheckCircle },
    cancelled: { label: "Cancelado", color: "text-red-700", bgColor: "bg-red-100", icon: CheckCircle },
};

const paymentMethodMap: Record<string, string> = {
    pix: "PIX",
    money: "Dinheiro",
    card: "Cartão",
    mercadopago: "Mercado Pago",
};

export default function MyOrdersPage() {
    const params = useParams();
    const slug = params.slug as string;

    // Estado de autenticação
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Estado de busca por telefone (para não autenticados)
    const [phone, setPhone] = useState("");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Verificar autenticação ao carregar
    useEffect(() => {
        async function checkAuth() {
            const { user: currentUser, profile: currentProfile } = await getCurrentUser();
            setUser(currentUser);
            setProfile(currentProfile);
            setAuthLoading(false);

            // Se está autenticado, carregar pedidos automaticamente
            if (currentUser) {
                loadUserOrders(currentUser.id);
            }
        }

        checkAuth();

        // Listener de mudanças de autenticação
        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const { profile: updatedProfile } = await getCurrentUser();
                setUser(session.user);
                setProfile(updatedProfile);
                loadUserOrders(session.user.id);
            } else {
                setUser(null);
                setProfile(null);
                setOrders([]);
                setSearched(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Carregar pedidos do usuário autenticado
    const loadUserOrders = async (userId: string) => {
        setLoading(true);
        try {
            const supabase = createClient();

            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (error) throw error;

            setOrders(data || []);
            setSearched(true);
        } catch (error) {
            console.error("Error loading user orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Buscar pedidos por telefone (para não autenticados)
    const searchOrders = async () => {
        if (!phone.trim()) {
            alert("⚠️ Digite seu telefone para buscar pedidos");
            return;
        }

        setLoading(true);
        setSearched(false);

        try {
            const supabase = createClient();

            // Remover formatação do telefone para busca
            const cleanPhone = phone.replace(/\D/g, "");

            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .ilike("customer_phone", `%${cleanPhone}%`)
                .order("created_at", { ascending: false });

            if (error) throw error;

            setOrders(data || []);
            setSearched(true);

            if (!data || data.length === 0) {
                alert("🔍 Nenhum pedido encontrado com este telefone");
            }
        } catch (error) {
            console.error("Error searching orders:", error);
            alert("❌ Erro ao buscar pedidos. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            searchOrders();
        }
    };

    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/\D/g, "");
        if (numbers.length <= 11) {
            return numbers
                .replace(/^(\d{2})(\d)/g, "($1) $2")
                .replace(/(\d{5})(\d)/, "$1-$2");
        }
        return value;
    };

    const handleLogout = async () => {
        await signOut();
        setUser(null);
        setProfile(null);
        setOrders([]);
        setSearched(false);
    };

    if (authLoading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href={`/loja/${slug}`} className="text-emerald-600 hover:underline mb-4 inline-block">
                        ← Voltar para loja
                    </Link>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Meus Pedidos</h1>
                            {user && profile ? (
                                <p className="text-gray-600 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Olá, <strong>{profile.full_name}</strong>!
                                </p>
                            ) : (
                                <p className="text-gray-600">Acompanhe seus pedidos</p>
                            )}
                        </div>

                        {/* Botão Login/Logout */}
                        <div>
                            {user ? (
                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sair
                                </Button>
                            ) : (
                                <Button
                                    asChild
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                                >
                                    <Link href={`/loja/${slug}/checkout`}>
                                        <LogIn className="w-4 h-4" />
                                        Fazer Login
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Se NÃO está autenticado, mostrar busca por telefone */}
                {!user && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="w-5 h-5" />
                                Buscar Pedidos por Telefone
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <Input
                                        type="tel"
                                        placeholder="(11) 99999-9999"
                                        value={phone}
                                        onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                                        onKeyPress={handleKeyPress}
                                        className="text-lg"
                                        maxLength={15}
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        Digite o telefone usado no pedido
                                    </p>
                                </div>
                                <Button
                                    onClick={searchOrders}
                                    disabled={loading}
                                    size="lg"
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Buscando...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Search className="w-5 h-5" />
                                            Buscar
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Loading */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando pedidos...</p>
                    </div>
                )}

                {/* Lista de Pedidos */}
                {!loading && searched && (
                    <>
                        {orders.length === 0 ? (
                            <Card>
                                <CardContent className="py-16 text-center">
                                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h3>
                                    <p className="text-gray-600 mb-6">
                                        {user
                                            ? "Você ainda não fez nenhum pedido"
                                            : "Não encontramos pedidos com este telefone"
                                        }
                                    </p>
                                    <Button asChild variant="outline">
                                        <Link href={`/loja/${slug}`}>Fazer um Pedido</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold">
                                        {orders.length} {orders.length === 1 ? 'Pedido' : 'Pedidos'}
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    {orders.map((order) => {
                                        const config = statusConfig[order.status];
                                        const StatusIcon = config.icon;

                                        return (
                                            <Card
                                                key={order.id}
                                                className="hover:shadow-lg transition-shadow"
                                            >
                                                <CardContent className="pt-6">
                                                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                                                        {/* Info do Pedido */}
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <h3 className="text-xl font-bold">
                                                                    #{order.order_number}
                                                                </h3>
                                                                <Badge className={`${config.bgColor} ${config.color} flex items-center gap-1`}>
                                                                    <StatusIcon className="w-3 h-3" />
                                                                    {config.label}
                                                                </Badge>
                                                            </div>

                                                            <div className="space-y-2 text-sm text-gray-600">
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="w-4 h-4" />
                                                                    <span>
                                                                        {new Date(order.created_at).toLocaleDateString("pt-BR", {
                                                                            day: "2-digit",
                                                                            month: "long",
                                                                            year: "numeric",
                                                                            hour: "2-digit",
                                                                            minute: "2-digit"
                                                                        })}
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <Package className="w-4 h-4" />
                                                                    <span>{order.customer_name}</span>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-semibold">💳</span>
                                                                    <span>{paymentMethodMap[order.payment_method] || order.payment_method}</span>
                                                                </div>

                                                                <div className="pt-2 border-t">
                                                                    <span className="text-lg font-bold text-emerald-600">
                                                                        {formatCurrency(order.total)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Ações */}
                                                        <div className="flex flex-col justify-between gap-2 sm:min-w-[160px]">
                                                            <Button
                                                                asChild
                                                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                                                            >
                                                                <Link href={`/loja/${slug}/pedidos/${order.id}`}>
                                                                    Ver Detalhes
                                                                </Link>
                                                            </Button>

                                                            {order.status !== "delivered" && order.status !== "cancelled" && (
                                                                <Button
                                                                    asChild
                                                                    variant="outline"
                                                                    className="w-full"
                                                                >
                                                                    <a
                                                                        href={`https://wa.me/5511999999999?text=Olá! Gostaria de informações sobre meu pedido ${order.order_number}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        💬 WhatsApp
                                                                    </a>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* Informações */}
                {!searched && !user && (
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <div className="text-blue-600">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-blue-900 mb-2">
                                        Como funciona?
                                    </h3>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>📱 Digite o telefone usado no pedido</li>
                                        <li>🔍 Clique em "Buscar" ou pressione Enter</li>
                                        <li>📦 Veja todos os seus pedidos e acompanhe o status</li>
                                        <li>💡 Ou faça login para ver automaticamente!</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Informações para autenticado sem pedidos */}
                {!loading && !searched && user && (
                    <Card className="border-emerald-200 bg-emerald-50">
                        <CardContent className="pt-6 text-center">
                            <Package className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
                            <h3 className="font-semibold text-emerald-900 mb-2 text-lg">
                                Seus pedidos aparecerão aqui automaticamente!
                            </h3>
                            <p className="text-sm text-emerald-800 mb-4">
                                Quando você fizer um pedido estando logado, ele aparecerá nesta página.
                            </p>
                            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                                <Link href={`/loja/${slug}/produtos`}>
                                    Começar a Comprar
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
