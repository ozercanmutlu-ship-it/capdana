"use client";

import Image from "next/image";
import { reviews } from "@/lib/reviews";
import { Card } from "@/components/ui/Card";
import { Star, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export const Testimonials = () => {
    const t = useTranslations('Testimonials');
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, idx) => (
                <Card
                    key={review.id}
                    className={`flex flex-col justify-between space-y-4 p-6 transition-all duration-500 hover:border-[var(--accent-color)]/30 ${idx % 3 === 1 ? "lg:translate-y-8" : ""
                        }`}
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-text/10">
                                    <Image
                                        src={review.avatar}
                                        alt={review.user}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-semibold text-text">{review.user}</p>
                                        {review.verified && <CheckCircle2 className="h-3 w-3 text-neon" />}
                                    </div>
                                    <p className="text-[10px] text-muted">{t(`reviews.${review.id}.date`)}</p>
                                </div>
                            </div>
                            <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-surface text-surface"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm italic leading-relaxed text-text/90">
                            "{t(`reviews.${review.id}.text`)}"
                        </p>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-surface/50 p-2.5 transition-colors hover:bg-surface">
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                            <Image
                                src={review.productImage}
                                alt={review.productName}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-[9px] uppercase tracking-wider text-muted">{t('purchased')}</p>
                            <p className="text-[11px] font-bold text-text line-clamp-1">{review.productName}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
