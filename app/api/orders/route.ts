import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST: Create a new order (called during checkout)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
        }

        const { items, shipping, totalAmount } = await request.json();

        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                items: JSON.stringify(items),
                shipping: JSON.stringify(shipping),
                totalAmount,
                status: "PENDING",
            },
        });

        return NextResponse.json({ id: order.id, createdAt: order.createdAt }, { status: 201 });
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({ error: "Sipariş oluşturulamadı." }, { status: 500 });
    }
}

// GET: Get current user's orders
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Orders fetch error:", error);
        return NextResponse.json({ error: "Siparişler alınamadı." }, { status: 500 });
    }
}
