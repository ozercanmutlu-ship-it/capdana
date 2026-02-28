"use client";

import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cn";

type Props = {
    onClose: () => void;
    onSuccess: () => void;
};

export const CommunityUploadModal = ({ onClose, onSuccess }: Props) => {
    const t = useTranslations("Community");
    const { data: session } = useSession();
    const locale = useLocale();
    const router = useRouter();

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [combo, setCombo] = useState("");
    const [caption, setCaption] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (f: File) => {
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setError("");
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files[0];
        if (f && f.type.startsWith("image/")) handleFile(f);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) { setError(t("image_required")); return; }

        setLoading(true);
        setError("");
        const fd = new FormData();
        fd.append("image", file);
        fd.append("combo", combo);
        fd.append("caption", caption);

        const res = await fetch("/api/community", { method: "POST", body: fd });
        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            if (res.status === 401) { router.push(`/${locale}/login`); return; }
            setError(data.error || t("upload_error"));
            return;
        }
        setSuccess(true);
        setTimeout(() => { onSuccess(); onClose(); }, 1800);
    };

    const content = (
        <div className="fixed inset-0 z-[999]">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} role="presentation" />
            <div className="relative flex min-h-full items-center justify-center p-4">
                <div
                    role="dialog"
                    aria-modal="true"
                    className="isolate w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]/90 shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-6 py-6 md:px-8 md:py-7 space-y-6">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.25em] text-muted">{t("modal_tag")}</p>
                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-text">{t("modal_title")}</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-text/10 bg-bg/40 text-text hover:border-[var(--accent-color)]/40 transition"
                                aria-label="Kapat"
                            >
                                ✕
                            </button>
                        </div>

                        {success ? (
                            <div className="py-10 text-center space-y-3">
                                <div className="text-4xl">🎉</div>
                                <p className="text-lg font-bold text-text">{t("pending_title")}</p>
                                <p className="text-sm text-muted">{t("pending_desc")}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Drag-drop area */}
                                <div
                                    className={cx(
                                        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition cursor-pointer",
                                        isDragging ? "border-[var(--accent-color)] bg-[var(--accent-color)]/5" : "border-text/15 hover:border-[var(--accent-color)]/40"
                                    )}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {preview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={preview} alt="Önizleme" className="mx-auto max-h-48 rounded-xl object-cover" />
                                    ) : (
                                        <>
                                            <div className="text-3xl mb-2">📸</div>
                                            <p className="text-sm font-semibold text-text">{t("drop_label")}</p>
                                            <p className="text-xs text-muted mt-1">{t("drop_hint")}</p>
                                        </>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                                    />
                                </div>

                                {/* Combo */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted">{t("combo_label")}</label>
                                    <input
                                        value={combo}
                                        onChange={(e) => setCombo(e.target.value)}
                                        placeholder="ör. Shadow Walker + Midnight Blue"
                                        className="w-full rounded-xl border border-text/10 bg-bg px-4 py-3 text-sm text-text placeholder:text-muted/40 outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-color)]/20 transition"
                                    />
                                </div>

                                {/* Caption */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted">{t("caption_label")}</label>
                                    <textarea
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        rows={2}
                                        placeholder={t("caption_placeholder")}
                                        className="w-full resize-none rounded-xl border border-text/10 bg-bg px-4 py-3 text-sm text-text placeholder:text-muted/40 outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-color)]/20 transition"
                                    />
                                </div>

                                {error && (
                                    <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>
                                )}

                                <Button type="submit" fullWidth size="lg" disabled={loading} className="press-cta">
                                    {loading ? t("uploading") : t("submit_btn")}
                                </Button>

                                <p className="text-center text-[11px] text-muted">{t("approval_note")}</p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    if (typeof document === "undefined") return null;
    return createPortal(content, document.body);
};
