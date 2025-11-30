import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const body = await request.json();

        const {
            storeId,
            customerName,
            customerPhone,
            deliveryStreet,
            deliveryNumber,
            deliveryNeighborhood,
            deliveryCity,
            deliveryState,
            deliveryZipCode,
            paymentMethod,
            cashPaymentAmount,
            items,
            subtotal,
            deliveryFee,
            total,
        } = body;

        const orderNumber = `ORD-${Date.now()}`;
        const cashChange = cashPaymentAmount ? cashPaymentAmount - total : 0;

        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                order_number: orderNumber,
                store_id: storeId,
                customer_name: customerName,
                customer_phone: customerPhone,
                delivery_street: deliveryStreet,
                delivery_number: deliveryNumber,
                delivery_neighborhood: deliveryNeighborhood,
                delivery_city: deliveryCity,
                delivery_state: deliveryState,
                delivery_zip_code: deliveryZipCode,
                delivery_type: "delivery",
                payment_method: paymentMethod,
                cash_payment_amount: cashPaymentAmount,
                cash_change_amount: cashChange > 0 ? cashChange : null,
                subtotal,
                delivery_fee: deliveryFee,
                total,
                status: "pending",
            })
            .select()
            .single();

        if (orderError) throw orderError;

        const orderItems = items.map((item: any) => ({
            order_id: order.id,
            product_id: item.productId,
            product_name: item.productName,
            quantity: item.quantity,
            unit_price: item.price,
            order_type: item.orderType === "by_value" ? "by_value" : "by_quantity",
            requested_value: item.requestedValue,
            subtotal: item.subtotal,
        }));

        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems);

        if (itemsError) throw itemsError;

        return NextResponse.json({ success: true, orderId: order.id, orderNumber });
    } catch (error: any) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create order" },
            { status: 500 }
        );
    }
}
