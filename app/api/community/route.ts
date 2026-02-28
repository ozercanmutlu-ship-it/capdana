import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

// GET — public, onaylı postları döner
export async function GET() {
    try {
        const posts = await prisma.communityPost.findMany({
            where: { approved: true },
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true } } },
        });
        return NextResponse.json(posts);
    } catch {
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}

// POST — giriş yapmış + sipariş vermiş kullanıcı fotoğraf gönderir
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
    }

    // Sipariş kontrolü
    const orderCount = await prisma.order.count({
        where: { userId: session.user.id },
    });
    if (orderCount === 0) {
        return NextResponse.json(
            { error: "Paylaşmak için en az 1 sipariş vermiş olman gerekiyor." },
            { status: 403 }
        );
    }

    try {
        const formData = await req.formData();
        const file = formData.get("image") as File | null;
        const caption = (formData.get("caption") as string | null) ?? "";
        const combo = (formData.get("combo") as string | null) ?? "";

        if (!file) {
            return NextResponse.json({ error: "Fotoğraf gerekli" }, { status: 400 });
        }

        // Vercel Blob'a yükle
        const blob = await put(`community/${Date.now()}-${file.name}`, file, {
            access: "public",
        });

        const post = await prisma.communityPost.create({
            data: {
                userId: session.user.id,
                imageUrl: blob.url,
                caption: caption || null,
                combo: combo || null,
                approved: false,
            },
        });

        return NextResponse.json({ success: true, post }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Yükleme başarısız" }, { status: 500 });
    }
}
