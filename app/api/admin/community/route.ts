import { NextResponse } from "next/server";
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

// GET — tüm postlar + pending count
export async function GET() {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

    const [posts, pendingCount] = await Promise.all([
        prisma.communityPost.findMany({
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, email: true } } },
        }),
        prisma.communityPost.count({ where: { approved: false } }),
    ]);

    return NextResponse.json({ posts, pendingCount });
}
