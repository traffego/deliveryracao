import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Pet Ração Delivery",
    description: "Delivery de ração para seu pet",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body>{children}</body>
        </html>
    );
}
