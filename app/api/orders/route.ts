import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

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

return NextResponse.json({ success: true, orderId: order.id });
    } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
        { error: error.message || "Failed to create order" },
        { status: 500 }
    );
}
}
