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

        const readyCapdanas = await prisma.readyCapdana.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                front: true,
                bandana: true,
            }
        });

        return NextResponse.json(readyCapdanas);
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
        const { id, name, slug, price, frontId, bandanaId, image, tags, rarity } = body;

        if (!id || !name || !slug || !frontId || !bandanaId || !image || !rarity) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const capdana = await prisma.readyCapdana.create({
            data: { id, name, slug, price, frontId, bandanaId, image, tags: tags || "", rarity }
        });

        return NextResponse.json(capdana);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
