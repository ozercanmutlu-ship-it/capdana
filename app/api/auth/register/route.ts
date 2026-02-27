import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Tüm alanları doldurun." }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "Şifre en az 6 karakter olmalı." }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "Bu e-posta zaten kayıtlı." }, { status: 400 });
        }

        const hashed = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: { name, email, password: hashed, role: "USER" },
        });

        return NextResponse.json({ message: "Kayıt başarılı.", userId: user.id }, { status: 201 });
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
    }
}
