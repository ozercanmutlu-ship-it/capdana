"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CommunityUploadModal } from "@/components/CommunityUploadModal";
import { cx } from "@/lib/cn";

type Post = {
    id: string;
    imageUrl: string;
    caption: string | null;
    combo: string | null;
    createdAt: string;
    user: { name: string | null };
};

type Props = {
    initialPosts?: Post[];
    limit?: number; // ana sayfa için 6, galeri sayfası için undefined (hepsi)
};

export const CommunityGallery = ({ initialPosts, limit }: Props) => {
    const t = useTranslations("Community");
    const locale = useLocale();
    const router = useRouter();
    const { data: session, status } = useSession();

    const [posts, setPosts] = useState<Post[]>(initialPosts ?? []);
    const [lightbox, setLightbox] = useState<Post | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchPosts = async () => {
        const res = await fetch("/api/community");
        if (res.ok) {
            const data: Post[] = await res.json();
            setPosts(data);
        }
    };

    useEffect(() => {
        if (!initialPosts) fetchPosts();
    }, [initialPosts]);

    const displayed = limit ? posts.slice(0, limit) : posts;

    const handleShareClick = () => {
        if (status === "unauthenticated") {
            router.push(`/${locale}/login`);
            return;
        }
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            {/* Header row */}
            <div className="flex items-end justify-between gap-4">
                <div />
                <div className="relative group/btn-wrapper">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color)]/50 opacity-0 blur transition duration-500 group-hover/btn-wrapper:opacity-60" />
                    <Button
                        type="button"
                        onClick={handleShareClick}
                        className="relative press-cta"
                    >
                        {t("submit_btn")}
                    </Button>
                </div>
            </div>

            {/* Masonry grid */}
            {displayed.length === 0 ? (
                <div className="py-20 text-center rounded-2xl border border-dashed border-text/10 text-muted text-sm">
                    {t("empty")}
                </div>
            ) : (
                <div
                    className="columns-2 md:columns-3 gap-4 space-y-4"
                    style={{ columnGap: "1rem" }}
                >
                    {displayed.map((post) => (
                        <button
                            key={post.id}
                            type="button"
                            onClick={() => setLightbox(post)}
                            className="group relative w-full break-inside-avoid overflow-hidden rounded-2xl border border-text/10 bg-surface/60 transition-all duration-300 hover:border-[var(--accent-color)]/30 hover:shadow-[0_8px_30px_var(--accent-glow)] hover:-translate-y-1 mb-4"
                            aria-label={post.combo ?? post.user.name ?? "Kombin"}
                        >
                            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                                <Image
                                    src={post.imageUrl}
                                    alt={post.combo ?? "Kombin"}
                                    fill
                                    sizes="(min-width: 768px) 33vw, 50vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex flex-col justify-end p-4">
                                    {post.combo && (
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-white/90 line-clamp-1">{post.combo}</p>
                                    )}
                                    {post.caption && (
                                        <p className="text-xs text-white/70 mt-1 line-clamp-2">{post.caption}</p>
                                    )}
                                    <p className="text-[10px] text-white/50 mt-1.5">{post.user.name ?? "Anonim"}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {lightbox && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={() => setLightbox(null)}
                        role="presentation"
                    />
                    <div className="relative z-10 max-w-lg w-full rounded-3xl overflow-hidden border border-white/10 bg-bg/90 shadow-2xl">
                        <div className="relative aspect-[3/4] w-full">
                            <Image
                                src={lightbox.imageUrl}
                                alt={lightbox.combo ?? "Kombin"}
                                fill
                                sizes="480px"
                                className="object-cover"
                            />
                        </div>
                        <div className="px-5 py-4 space-y-1">
                            {lightbox.combo && (
                                <p className="text-sm font-bold text-text">{lightbox.combo}</p>
                            )}
                            {lightbox.caption && (
                                <p className="text-sm text-muted">{lightbox.caption}</p>
                            )}
                            <p className="text-xs text-muted/60">{lightbox.user.name ?? "Anonim"}</p>
                        </div>
                        <button
                            onClick={() => setLightbox(null)}
                            className="absolute right-4 top-4 h-9 w-9 flex items-center justify-center rounded-full border border-white/20 bg-black/50 text-white text-sm backdrop-blur"
                            aria-label="Kapat"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Upload modal */}
            {isModalOpen && (
                <CommunityUploadModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchPosts}
                />
            )}
        </div>
    );
};
