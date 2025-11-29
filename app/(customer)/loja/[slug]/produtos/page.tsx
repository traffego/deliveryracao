import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default async function ProductsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: store } = await supabase
        .from("stores")
        .select("*")
        .eq("slug", slug)
        .single();

    const { data: products } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("store_id", store?.id)
        .eq("is_active", true)
        .order("name");

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Nossos Produtos</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                                <Badge variant={product.product_type === 'bulk' ? 'default' : 'secondary'}>
                                    {product.product_type === 'bulk' ? 'A Granel' : 'Saco Fechado'}
                                </Badge>
                                {product.is_featured && (
                                    <Badge variant="outline">⭐ Destaque</Badge>
                                )}
                            </div>
                            <CardTitle>{product.name}</CardTitle>
                            {product.brand && (
                                <CardDescription>{product.brand}</CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 text-sm mb-4">{product.description}</p>

                            <div className="mb-4">
                                <p className="text-3xl font-bold text-emerald-600">
                                    {formatCurrency(product.price)}
                                </p>
                                <p className="text-sm text-gray-600">por {product.unit}</p>
                            </div>

                            {product.order_mode === 'both' && (
                                <p className="text-xs text-emerald-600 mb-3">
                                    💡 Peça por peso ou por valor!
                                </p>
                            )}

                            <Button className="w-full" asChild>
                                <Link href={`/loja/${slug}/produtos/${product.slug}`}>
                                    Ver Detalhes
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
