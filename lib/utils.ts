import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value)
}

export function formatWeight(value: number): string {
    return `${value.toFixed(2)} kg`
}

export function generateOrderNumber(): string {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `#ORD-${dateStr}-${randomStr}`
}

export function calculateQuantityFromValue(value: number, pricePerUnit: number): number {
    return value / pricePerUnit
}

export function calculateValueFromQuantity(quantity: number, pricePerUnit: number): number {
    return quantity * pricePerUnit
}
