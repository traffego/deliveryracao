"use client";

import { useState, useEffect } from "react";
import { User, LogOut, Package, ChevronDown } from "lucide-react";
import { getCurrentUser, signOut } from "@/lib/auth/auth-helpers";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import QuickAuthModal from "@/components/auth/quick-auth-modal";
import { useRouter } from "next/navigation";

export default function UserMenu({ storeSlug }: { storeSlug: string }) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        const currentUser = await getCurrentUser();
        if (currentUser?.user) {
            setUser(currentUser);
            if (currentUser.profile) {
                setCustomerName(currentUser.profile.full_name || "");
                setCustomerPhone(currentUser.profile.phone || "");
            }
        }
        setLoading(false);
    }

    const handleAuthSuccess = async (userId: string) => {
        await checkAuth();
        setShowAuthModal(false);
    };

    const handleLogout = async () => {
        await signOut();
        setUser(null);
        router.refresh();
    };

    if (loading) {
        return (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        );
    }

    if (!user?.user) {
        return (
            <>
                <Button
                    onClick={() => setShowAuthModal(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Entrar</span>
                </Button>

                {showAuthModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="w-full max-w-md">
                            <QuickAuthModal
                                phone={customerPhone}
                                name={customerName}
                                onSuccess={handleAuthSuccess}
                                onSkip={() => setShowAuthModal(false)}
                            />
                        </div>
                    </div>
                )}
            </>
        );
    }

    const displayName = user.profile?.full_name || user.user.email?.split('@')[0] || 'Cliente';
    const firstName = displayName.split(' ')[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="hidden sm:inline font-medium">{firstName}</span>
                    <ChevronDown className="w-4 h-4 hidden sm:inline" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{displayName}</p>
                        {user.profile?.phone && (
                            <p className="text-xs text-gray-500">{user.profile.phone}</p>
                        )}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => router.push(`/loja/${storeSlug}/meus-pedidos`)}
                    className="cursor-pointer"
                >
                    <Package className="mr-2 h-4 w-4" />
                    Meus Pedidos
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
