export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center px-4">
                <div className="mb-8">
                    <span className="text-8xl">🐕</span>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Loja não encontrada
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                    A loja que você está procurando não existe ou está inativa.
                </p>

                <a
                    href="/"
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                    ← Voltar para página inicial
                </a>
            </div>
        </div>
    );
}
