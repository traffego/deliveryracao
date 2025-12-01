# Melhorias de UX - Modal de Carrinho e Compra Rápida

## Objetivo:
Reduzir passos no processo de compra com modal e botão "Comprar Agora"

## Implementação Necessária:

### 1. ✅ CartModal Component (JÁ CRIADO)
- Arquivo: `components/cart-modal.tsx`
- Modal lateral com animação slide-in
- Mostra itens do carrinho
- Botões: "Finalizar Compra" e "Continuar Comprando"

### 2. ⏳ Atualizar ProductOrderSelector

#### Adicionar:
```typescript
import { Zap } from "lucide-react";
import CartModal from "@/components/cart-modal";

const [showCartModal, setShowCartModal] = useState(false);
```

#### Modificar handleAddToCart:
```typescript
const handleAddToCart = (buyNow: boolean = false) => {
    // ... código existente de adicionar item ...
    
    if (buyNow) {
        // Comprar direto
        router.push(`/loja/${storeSlug}/checkout`);
    } else {
        // Mostrar modal
        setShowCartModal(true);
    }
};
```

#### Substituir botão único por 2 botões:
```typescript
<div className="flex gap-2 mt-6">
    <Button
        onClick={() => handleAddToCart(false)}
        variant="outline"
        size="lg"
        className="flex-1"
    >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Adicionar ao Carrinho
    </Button>
    
    <Button
        onClick={() => handleAddToCart(true)}
        size="lg"
        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
    >
        <Zap className="mr-2 h-5 w-5" />
        Comprar Agora
    </Button>
</div>

<CartModal
    isOpen={showCartModal}
    onClose={() => setShowCartModal(false)}
    storeSlug={storeSlug}
/>
```

## Benefícios:
- ✅ Menos cliques para finalizar compra
- ✅ Feedback imediato ao adicionar item
- ✅ Opção de continuar comprando sem sair da página
- ✅ Compra rápida em 1 clique
