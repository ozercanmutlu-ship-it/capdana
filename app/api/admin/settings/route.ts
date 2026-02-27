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

        const settings = await prisma.siteSettings.findUnique({
            where: { id: "default" },
        });

        if (!settings) {
            return NextResponse.json({ readyPrice: 333, customPrice: 444 });
        }

        return NextResponse.json(settings);
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
        const { readyPrice, customPrice } = body;

        const settings = await prisma.siteSettings.upsert({
            where: { id: "default" },
            update: {
                readyPrice: Number(readyPrice),
                customPrice: Number(customPrice),
            },
            create: {
                id: "default",
                readyPrice: Number(readyPrice),
                customPrice: Number(customPrice),
            },
        });

        return NextResponse.json(settings);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
