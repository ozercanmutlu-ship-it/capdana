import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const bandanas = await prisma.bandana.findMany({
            orderBy: { createdAt: "asc" }
        });

        return NextResponse.json(bandanas);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { id, name, image, slug, rarity, color } = body;

        if (!id || !name || !image || !slug || !rarity || !color) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const bandana = await prisma.bandana.create({
            data: { id, name, image, slug, rarity, color }
        });

        return NextResponse.json(bandana);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
