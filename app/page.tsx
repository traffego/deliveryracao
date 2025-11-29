import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Truck, MapPin, Clock, Shield, Heart } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
            {/* Hero Section */}
            <header className="container mx-auto px-4 py-16 md:py-24">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
                        <Heart className="w-4 h-4" />
                        Feito com amor para seu pet
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                        🐾 Ração para seu{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                            melhor amigo
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                        Delivery rápido de ração a granel ou saco fechado.
                        <br />
                        <strong className="text-emerald-600">Peça por peso ou valor!</strong>
                        {" "}(Ex: "Me dê R$20 de ração")
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="text-lg h-14 px-8 bg-emerald-600 hover:bg-emerald-700">
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Ver Catálogo
                        </Button>

                        <Button size="lg" variant="outline" className="text-lg h-14 px-8 border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                            <MapPin className="mr-2 h-5 w-5" />
                            Encontrar Loja
                        </Button>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <Card className="border-emerald-100 hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                                <ShoppingBag className="w-6 h-6 text-emerald-600" />
                            </div>
                            <CardTitle>Compre por Peso ou Valor</CardTitle>
                            <CardDescription>
                                Peça exatamente o que precisa: "2kg de ração" ou "R$20 de ração X"
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-teal-100 hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                                <Truck className="w-6 h-6 text-teal-600" />
                            </div>
                            <CardTitle>Entrega Rápida</CardTitle>
                            <CardDescription>
                                Receba em casa ou retire na loja. Frete calculado por zona ou distância.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-green-100 hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                <Clock className="w-6 h-6 text-green-600" />
                            </div>
                            <CardTitle>Repita seu Pedido</CardTitle>
                            <CardDescription>
                                Reordene com 1 clique! Perfeito para quem compra sempre a mesma quantidade.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-emerald-100 hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-emerald-600" />
                            </div>
                            <CardTitle>Pagamento Seguro</CardTitle>
                            <CardDescription>
                                Pix, cartão, boleto ou dinheiro na entrega. Você escolhe!
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-teal-100 hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                                <MapPin className="w-6 h-6 text-teal-600" />
                            </div>
                            <CardTitle>Múltiplas Lojas</CardTitle>
                            <CardDescription>
                                Encontre a loja mais próxima de você e peça direto pelo app.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-green-100 hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6 text-green-600" />
                            </div>
                            <CardTitle>Ração de Qualidade</CardTitle>
                            <CardDescription>
                                A granel ou saco fechado, sempre fresca e das melhores marcas.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-16">
                <Card className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-600 to-teal-600 border-0 text-white">
                    <CardContent className="p-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Pronto para cuidar do seu pet? 🐶
                        </h2>
                        <p className="text-xl text-emerald-50 mb-8">
                            Cadastre-se agora e ganhe desconto no primeiro pedido!
                        </p>
                        <Button size="lg" variant="secondary" className="text-lg h-14 px-8">
                            Criar Conta Grátis
                        </Button>
                    </CardContent>
                </Card>
            </section>

            {/* Footer */}
            <footer className="container mx-auto px-4 py-8 text-center text-gray-600 border-t">
                <p className="text-sm">
                    © 2025 DogLivery - Sistema de Delivery de Ração
                    <br />
                    <span className="text-xs text-gray-500">
                        Desenvolvido com ❤️ para pet shops
                    </span>
                </p>
            </footer>
        </div>
    );
}
