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

        const fronts = await prisma.capFront.findMany({
            orderBy: { createdAt: "asc" }
        });

        return NextResponse.json(fronts);
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
        const { id, name, image, slug } = body;

        if (!id || !name || !image || !slug) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const front = await prisma.capFront.create({
            data: { id, name, image, slug }
        });

        return NextResponse.json(front);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
