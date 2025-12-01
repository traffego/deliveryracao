import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import CartBadge from "@/components/cart-badge";
import UserMenu from "@/components/user-menu";

export default async function StoreLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const supabase = createAdminClient();

    // Buscar dados da loja (usando admin client para bypass RLS)
    const { data: store, error } = await supabase
        .from("stores")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

    if (error || !store) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header da Loja */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {store.logo_url && (
                                <img
                                    src={store.logo_url}
                                    alt={store.name}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            )}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {store.name}
                                </h1>
                                {store.description && (
                                    <p className="text-sm text-gray-600">{store.description}</p>
                                )}
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center gap-6">
                            <a
                                href={`/loja/${slug}`}
                                className="text-gray-700 hover:text-emerald-600 font-medium"
                            >
                                Início
                            </a>
                            <a
                                href={`/loja/${slug}/produtos`}
                                className="text-gray-700 hover:text-emerald-600 font-medium"
                            >
                                Produtos
                            </a>
                            <a
                                href={`/loja/${slug}/meus-pedidos`}
                                className="text-gray-700 hover:text-emerald-600 font-medium"
                            >
                                📦 Meus Pedidos
                            </a>
                            <CartBadge storeSlug={slug} />
                            <UserMenu storeSlug={slug} />
                        </nav>
                    </div>
                </div>
            </header>

            {/* Conteúdo */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-white border-t mt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-3">{store.name}</h3>
                            {store.description && (
                                <p className="text-sm text-gray-600">{store.description}</p>
                            )}
                        </div>

                        {(store.phone || store.whatsapp || store.email) && (
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3">Contato</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    {store.phone && <p>📞 {store.phone}</p>}
                                    {store.whatsapp && <p>💬 {store.whatsapp}</p>}
                                    {store.email && <p>📧 {store.email}</p>}
                                </div>
                            </div>
                        )}

                        {store.street && (
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3">Endereço</h3>
                                <p className="text-sm text-gray-600">
                                    {store.street}, {store.number}
                                    {store.complement && ` - ${store.complement}`}
                                    <br />
                                    {store.neighborhood} - {store.city}/{store.state}
                                    <br />
                                    CEP: {store.zip_code}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
                        <p>© 2025 {store.name} - Todos os direitos reservados</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
