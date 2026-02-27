import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH: Admin — update order status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const { status } = await request.json();
    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
    }

    const order = await prisma.order.update({
        where: { id },
        data: { status },
    });

    return NextResponse.json(order);
}
