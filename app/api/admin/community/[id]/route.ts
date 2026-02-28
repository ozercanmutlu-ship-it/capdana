import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "ADMIN") return null;
    return user;
}

// PATCH — approve veya reject
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

    const { id } = await params;
    const { approved } = await req.json();

    const post = await prisma.communityPost.update({
        where: { id },
        data: { approved: Boolean(approved) },
    });

    return NextResponse.json({ success: true, post });
}

// DELETE — sil
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

    const { id } = await params;
    await prisma.communityPost.delete({ where: { id } });

    return NextResponse.json({ success: true });
}
