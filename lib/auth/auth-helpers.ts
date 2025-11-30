import { createClient } from "@/lib/supabase/client";

// Gerar senha aleatória segura para clientes
export function generateRandomPassword(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Cadastro rápido de cliente (nome + telefone)
export async function signUpCustomer(fullName: string, phone: string) {
    const supabase = createClient();

    // Gerar senha automática
    const password = generateRandomPassword();

    // Criar email fictício baseado no telefone
    const email = `${phone.replace(/\D/g, "")}@customer.local`;

    try {
        // Criar usuário no Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone,
                    role: "customer",
                },
            },
        });

        if (error) throw error;

        return {
            success: true,
            user: data.user,
            password, // Retornar senha para mostrar ao usuário
        };
    } catch (error: any) {
        console.error("Signup error:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Login de cliente com telefone
export async function signInCustomer(phone: string) {
    const supabase = createClient();

    // Email fictício baseado no telefone
    const email = `${phone.replace(/\D/g, "")}@customer.local`;

    try {
        // Buscar perfil do cliente para verificar se existe
        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("phone", phone)
            .single();

        if (!profile) {
            return {
                success: false,
                error: "Cliente não encontrado. Faça seu cadastro primeiro.",
                needsSignup: true,
            };
        }

        // Para clientes, usamos "passwordless" sign in via magic link
        // Ou podemos usar a senha que foi gerada
        return {
            success: true,
            profile,
            needsPassword: false, // Vamos implementar login sem senha para clientes
        };
    } catch (error: any) {
        console.error("Sign in error:", error);
        return {
            success: false,
            error: error.message,
        };
    }
}

// Login de admin com email e senha
export async function signInAdmin(email: string, password: string) {
    const supabase = createClient();

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        // Verificar se é admin
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

        if (profile?.role !== "admin") {
            await supabase.auth.signOut();
            return {
                success: false,
                error: "Acesso negado. Você não tem permissão de administrador.",
            };
        }

        return {
            success: true,
            user: data.user,
            session: data.session,
        };
    } catch (error: any) {
        console.error("Admin sign in error:", error);
        return {
            success: false,
            error: error.message,
        };
    }
}

// Logout
export async function signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    return { success: !error, error };
}

// Verificar se usuário está autenticado
export async function getCurrentUser() {
    const supabase = createClient();

    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return { user: null, profile: null };
        }

        // Buscar perfil
        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        return { user, profile };
    } catch (error) {
        return { user: null, profile: null };
    }
}

// Verificar se é admin
export async function isAdmin() {
    const { profile } = await getCurrentUser();
    return profile?.role === "admin";
}

// Atualizar perfil
export async function updateProfile(userId: string, updates: any) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

    return { success: !error, data, error };
}
