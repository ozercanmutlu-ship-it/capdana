"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { useToast } from "@/components/ToastProvider";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { show } = useToast();

    const [settings, setSettings] = useState({
        readyPrice: 333,
        customPrice: 444,
    });

    useEffect(() => {
        fetch("/api/admin/settings")
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setSettings({
                        readyPrice: data.readyPrice,
                        customPrice: data.customPrice,
                    });
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                show("Başarılı", "Ayarlar kaydedildi.");
            } else {
                show("Hata", "Ayarlar kaydedilemedi.");
            }
        } catch (error) {
            show("Hata", "Bir hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-[var(--accent-color)] border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <Section className="py-10">
            <Container className="max-w-3xl space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-text">Site Ayarları</h1>
                    <p className="text-sm text-muted mt-1">Sitenin genel fiyat ayarları.</p>
                </div>

                <Card className="p-6 border-text/10 bg-surface/50 space-y-6">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-text">Hazır Kombin Fiyatı (₺)</label>
                            <input
                                type="number"
                                value={settings.readyPrice}
                                onChange={e => setSettings({ ...settings, readyPrice: Number(e.target.value) })}
                                className="w-full rounded-xl border border-text/10 bg-bg px-4 py-3 text-sm text-text outline-none focus:border-[var(--accent-color)] transition"
                            />
                            <p className="text-xs text-muted">Aksi belirtilmedikçe tüm hazır kombinler için geçerli fiyat.</p>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-text">Özel Tasarım Fiyatı (₺)</label>
                            <input
                                type="number"
                                value={settings.customPrice}
                                onChange={e => setSettings({ ...settings, customPrice: Number(e.target.value) })}
                                className="w-full rounded-xl border border-text/10 bg-bg px-4 py-3 text-sm text-text outline-none focus:border-[var(--accent-color)] transition"
                            />
                            <p className="text-xs text-muted">Kendin tasarla sistemi için geçerli taban fiyat.</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-text/5 flex justify-end">
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
                        </Button>
                    </div>
                </Card>
            </Container>
        </Section>
    );
}
