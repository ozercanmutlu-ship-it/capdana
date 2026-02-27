import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');

        if (!filename || !request.body) {
            return new NextResponse("Missing filename or body", { status: 400 });
        }

        // Use Vercel Blob to upload the file
        // We add a timestamp to ensure uniqueness
        const uniqueFilename = `${Date.now()}-${filename}`;

        const blob = await put(`products/${uniqueFilename}`, request.body, {
            access: 'public',
        });

        return NextResponse.json(blob);
    } catch (error) {
        console.error("Upload error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
