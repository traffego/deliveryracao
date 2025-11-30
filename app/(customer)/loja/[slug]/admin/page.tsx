"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Package,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    Search,
    Filter,
    RefreshCw
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

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

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
    pending: { label: "Pendente", color: "text-yellow-700", bgColor: "bg-yellow-100" },
    confirmed: { label: "Confirmado", color: "text-blue-700", bgColor: "bg-blue-100" },
    preparing: { label: "Preparando", color: "text-purple-700", bgColor: "bg-purple-100" },
    out_for_delivery: { label: "Em Entrega", color: "text-orange-700", bgColor: "bg-orange-100" },
    delivered: { label: "Entregue", color: "text-green-700", bgColor: "bg-green-100" },
    cancelled: { label: "Cancelado", color: "text-red-700", bgColor: "bg-red-100" },
};

export default function AdminDashboard() {
    const params = useParams();
    const slug = params.slug as string;

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<OrderStatus | "all">("all");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchOrders = async () => {
        try {
            const supabase = createClient();

            let query = supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false });

            // Aplicar filtro de status
            if (filter !== "all") {
                query = query.eq("status", filter);
            }

            const { data, error } = await query;

            if (error) throw error;

            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        // Auto-refresh a cada 30 segundos
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, [filter]);

    const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
        try {
            const supabase = createClient();

            const { error } = await supabase
                .from("orders")
                .update({ status: newStatus })
                .eq("id", orderId);

            if (error) throw error;

            // Atualizar lista local
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));

            alert("✅ Status atualizado com sucesso!");
        } catch (error) {
            console.error("Error updating status:", error);
            alert("❌ Erro ao atualizar status");
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_phone.includes(searchTerm);

        return matchesSearch;
    });

    // Estatísticas
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === "pending").length,
        preparing: orders.filter(o => o.status === "preparing").length,
        delivering: orders.filter(o => o.status === "out_for_delivery").length,
        totalRevenue: orders
            .filter(o => o.status !== "cancelled")
            .reduce((sum, o) => sum + o.total, 0),
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando pedidos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
                        <p className="text-gray-600">Gerencie todos os pedidos da loja</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={fetchOrders}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Atualizar
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/loja/${slug}`}>Ver Loja</Link>
                        </Button>
                    </div>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total</p>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                </div>
                                <Package className="w-8 h-8 text-gray-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pendentes</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                </div>
                                <Clock className="w-8 h-8 text-yellow-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Preparando</p>
                                    <p className="text-2xl font-bold text-purple-600">{stats.preparing}</p>
                                </div>
                                <Package className="w-8 h-8 text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Em Rota</p>
                                    <p className="text-2xl font-bold text-orange-600">{stats.delivering}</p>
                                </div>
                                <AlertCircle className="w-8 h-8 text-orange-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Receita</p>
                                    <p className="text-xl font-bold text-emerald-600">
                                        {formatCurrency(stats.totalRevenue)}
                                    </p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-emerald-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Busca */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar por número, nome ou telefone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>

                            {/* Filtro de Status */}
                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    variant={filter === "all" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setFilter("all")}
                                >
                                    Todos
                                </Button>
                                {Object.entries(statusConfig).map(([status, config]) => (
                                    <Button
                                        key={status}
                                        variant={filter === status ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setFilter(status as OrderStatus)}
                                    >
                                        {config.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Lista de Pedidos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Nenhum pedido encontrado</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredOrders.map((order) => {
                                    const config = statusConfig[order.status];
                                    return (
                                        <div
                                            key={order.id}
                                            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-bold text-lg">#{order.order_number}</h3>
                                                        <Badge className={`${config.bgColor} ${config.color}`}>
                                                            {config.label}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        <p>👤 {order.customer_name}</p>
                                                        <p>📱 {order.customer_phone}</p>
                                                        <p>💰 {formatCurrency(order.total)}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(order.created_at).toLocaleString("pt-BR")}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 min-w-[200px]">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                                        className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                                                    >
                                                        {Object.entries(statusConfig).map(([status, config]) => (
                                                            <option key={status} value={status}>
                                                                {config.label}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full"
                                                    >
                                                        <Link href={`/loja/${slug}/pedidos/${order.id}`}>
                                                            Ver Detalhes
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
