import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProductOrderSelector from "@/components/product-order-selector";
import { ArrowLeft, Package, Truck, Shield } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string; productSlug: string }>;
}) {
    const { slug, productSlug } = await params;
    const supabase = await createClient();

    const { data: store } = await supabase
        .from("stores")
        .select("*")
        .eq("slug", slug)
        .single();

    const { data: product } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("store_id", store?.id)
        .eq("slug", productSlug)
        .eq("is_active", true)
        .single();

    if (!product) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <Link
                href={`/loja/${slug}/produtos`}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Voltar para produtos
            </Link>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center">
                    {product.images && product.images[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    ) : (
                        <Package className="w-32 h-32 text-gray-400" />
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <div className="flex items-start gap-3 mb-4">
                        <Badge variant={product.product_type === "bulk" ? "default" : "secondary"}>
                            {product.product_type === "bulk" ? "🌾 A Granel" : "📦 Saco Fechado"}
                        </Badge>
                        {product.is_featured && (
                            <Badge variant="outline">⭐ Destaque</Badge>
                        )}
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {product.name}
                    </h1>

                    {product.brand && (
                        <p className="text-lg text-gray-600 mb-4">{product.brand}</p>
                    )}

                    {product.categories && (
                        <p className="text-sm text-emerald-600 mb-6">
                            {product.categories.name}
                        </p>
                    )}

                    <div className="mb-6">
                        <p className="text-4xl font-bold text-emerald-600">
                            {formatCurrency(product.price)}
                        </p>
                        <p className="text-gray-600">por {product.unit}</p>
                    </div>

                    {product.description && (
                        <p className="text-gray-700 leading-relaxed mb-6">
                            {product.description}
                        </p>
                    )}

                    {/* Order Selector */}
                    <ProductOrderSelector product={product} />

                    {/* Additional Info */}
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <Package className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                                <p className="text-xs text-gray-600">Em estoque</p>
                                <p className="font-bold">{product.stock_quantity} {product.unit}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 text-center">
                                <Truck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                                <p className="text-xs text-gray-600">Entrega</p>
                                <p className="font-bold">30-60 min</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 text-center">
                                <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                                <p className="text-xs text-gray-600">Garantia</p>
                                <p className="font-bold">Qualidade</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
