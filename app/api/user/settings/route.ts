import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
        }

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword || newPassword.length < 6) {
            return NextResponse.json({ error: "Geçerli bir şifre girin." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user || !user.password) {
            return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
        }

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return NextResponse.json({ error: "Mevcut şifreniz hatalı." }, { status: 400 });
        }

        const hashed = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashed },
        });

        return NextResponse.json({ message: "Şifreniz başarıyla güncellendi." }, { status: 200 });
    } catch (error) {
        console.error("Password update error:", error);
        return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
    }
}
