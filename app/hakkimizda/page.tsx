import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Sente Wear markası hakkında.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Sente Wear</p>
      <h1 className="mt-2 text-3xl font-semibold">Hakkımızda</h1>
      <div className="mt-6 space-y-4 text-sm text-neutral-600">
        <p>
          Sente Wear, tek ürün odaklı koleksiyonlarla premium streetwear estetiğini
          yeniden yorumlayan bağımsız bir markadır.
        </p>
        <p>
          Tasarımımızda minimal form, güçlü detay ve zamansız duruşu bir araya
          getiriyoruz. Bandanalı şapka koleksiyonu bu yaklaşımın ilk adımı.
        </p>
      </div>
    </div>
  );
}
