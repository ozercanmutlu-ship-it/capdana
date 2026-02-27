import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { name, slug, price, frontId, bandanaId, image, tags, rarity } = body;

        const capdana = await prisma.readyCapdana.update({
            where: { id },
            data: { name, slug, price, frontId, bandanaId, image, tags, rarity },
        });

        return NextResponse.json(capdana);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await prisma.readyCapdana.delete({
            where: { id },
        });

        return new NextResponse("OK", { status: 200 });
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
