import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, RotateCcw, Truck, Clock } from "lucide-react";
import Link from "next/link";

export default async function StorePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const supabase = await createClient();

    // Buscar loja
    const { data: store } = await supabase
        .from("stores")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

    if (!store) {
        return null;
    }

    // Buscar produtos em destaque
    const { data: featuredProducts } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", store.id)
        .eq("is_featured", true)
        .eq("is_active", true)
        .limit(6);

    // Buscar configurações de entrega
    const { data: deliverySettings } = await supabase
        .from("delivery_settings")
        .select("*")
        .eq("store_id", store.id)
        .single();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 md:p-12 text-white mb-12">
                <div className="max-w-3xl">
                    <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
                        🐾 Delivery de Ração
                    </Badge>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Bem-vindo à {store.name}!
                    </h1>

                    <p className="text-xl text-emerald-50 mb-6">
                        Ração de qualidade para seu pet, entregue com rapidez e carinho.
                        <br />
                        <strong>Peça por peso ou valor!</strong>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            size="lg"
                            className="bg-white text-emerald-600 hover:bg-emerald-50"
                            asChild
                        >
                            <Link href={`/loja/${slug}/produtos`}>
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Ver Produtos
                            </Link>
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10"
                        >
                            <RotateCcw className="mr-2 h-5 w-5" />
                            Repetir Último Pedido
                        </Button>
                    </div>
                </div>
            </section>

            {/* Informações de Entrega */}
            {deliverySettings && (
                <section className="mb-12">
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <Truck className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <CardTitle className="text-lg">Entrega Rápida</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Entregamos em{" "}
                                    <strong>
                                        {deliverySettings.estimated_delivery_time_min} a{" "}
                                        {deliverySettings.estimated_delivery_time_max} minutos
                                    </strong>
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                                        <Package className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <CardTitle className="text-lg">Frete</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {deliverySettings.delivery_mode === "fixed_general" && (
                                    <p className="text-gray-600">
                                        Taxa fixa:{" "}
                                        <strong>
                                            R$ {deliverySettings.fixed_general_fee?.toFixed(2)}
                                        </strong>
                                    </p>
                                )}
                                {deliverySettings.delivery_mode === "fixed_by_zone" && (
                                    <p className="text-gray-600">
                                        Calculado por <strong>zona de entrega</strong>
                                    </p>
                                )}
                                {deliverySettings.delivery_mode === "distance_based" && (
                                    <p className="text-gray-600">
                                        Calculado por <strong>distância</strong>
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-green-600" />
                                    </div>
                                    <CardTitle className="text-lg">Horário</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Seg-Sex: <strong>8h às 18h</strong>
                                    <br />
                                    Sábado: <strong>8h às 12h</strong>
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}

            {/* Produtos em Destaque */}
            {featuredProducts && featuredProducts.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Produtos em Destaque
                        </h2>
                        <Button variant="outline" asChild>
                            <Link href={`/loja/${slug}/produtos`}>Ver Todos</Link>
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProducts.map((product) => (
                            <Card key={product.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    {product.images && product.images[0] && (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                        />
                                    )}
                                    <CardTitle>{product.name}</CardTitle>
                                    {product.brand && (
                                        <CardDescription>{product.brand}</CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-2xl font-bold text-emerald-600">
                                                R$ {product.price.toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-600">por {product.unit}</p>
                                        </div>
                                        {product.product_type === "bulk" && (
                                            <Badge variant="secondary">A Granel</Badge>
                                        )}
                                    </div>

                                    <Button className="w-full" asChild>
                                        <Link href={`/loja/${slug}/produtos/${product.slug}`}>
                                            Ver Detalhes
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="mt-16">
                <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                    <CardContent className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Primeira vez aqui? 🎉
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Cadastre-se e ganhe desconto no primeiro pedido!
                        </p>
                        <Button size="lg" asChild>
                            <Link href="/cadastro">Criar Conta Grátis</Link>
                        </Button>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
