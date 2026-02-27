type FlySourceSearchOptions = {
  buttonEl: HTMLElement;
};

const prefersReducedMotion = () => {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
};

export const findFlySource = ({ buttonEl }: FlySourceSearchOptions): HTMLElement | null => {
  const selector = buttonEl.getAttribute("data-fly-source");
  if (selector) {
    const el = document.querySelector(selector);
    if (el instanceof HTMLElement) return el;
  }

  const root =
    (buttonEl.closest("[data-product-root]") as HTMLElement | null) ??
    (buttonEl.closest("[data-builder-root]") as HTMLElement | null) ??
    (buttonEl.closest("article,section,div") as HTMLElement | null);

  if (root) {
    const builder = root.querySelector("[data-builder-preview]") as HTMLElement | null;
    if (builder) return builder;

    const img =
      (root.querySelector("img[data-product-image]") as HTMLElement | null) ??
      (root.querySelector("[data-product-image] img") as HTMLElement | null) ??
      (root.querySelector("[data-product-image]") as HTMLElement | null) ??
      (root.querySelector("img") as HTMLElement | null);
    if (img) return img;
  }

  return buttonEl;
};

export const flyToCart = async (fromEl: HTMLElement, toEl: HTMLElement): Promise<void> => {
  if (typeof window === "undefined") return;
  if (prefersReducedMotion()) return;

  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();

  const startCx = fromRect.left + fromRect.width / 2;
  const startCy = fromRect.top + fromRect.height / 2;
  const endCx = toRect.left + Math.min(22, toRect.width / 2);
  const endCy = toRect.top + Math.min(18, toRect.height / 2);

  const startW = Math.max(18, Math.min(120, fromRect.width));
  const startH = Math.max(18, Math.min(120, fromRect.height));

  const clone = document.createElement("div");
  clone.style.position = "fixed";
  clone.style.left = `${startCx - startW / 2}px`;
  clone.style.top = `${startCy - startH / 2}px`;
  clone.style.width = `${startW}px`;
  clone.style.height = `${startH}px`;
  clone.style.zIndex = "9999";
  clone.style.pointerEvents = "none";
  clone.style.borderRadius = "16px";
  clone.style.overflow = "hidden";
  clone.style.boxShadow = "0 12px 30px rgba(0,0,0,0.35), 0 0 18px rgba(255,77,77,0.18)";
  clone.style.background = "rgba(10,10,10,0.55)";
  clone.style.backdropFilter = "blur(10px)";

  const img =
    (fromEl instanceof HTMLImageElement ? fromEl : (fromEl.querySelector("img") as HTMLImageElement | null)) ??
    null;

  if (img?.currentSrc || img?.src) {
    const imgEl = document.createElement("img");
    imgEl.src = img.currentSrc || img.src;
    imgEl.alt = "";
    imgEl.decoding = "async";
    imgEl.style.width = "100%";
    imgEl.style.height = "100%";
    imgEl.style.objectFit = "cover";
    clone.appendChild(imgEl);
  } else {
    const dot = document.createElement("div");
    dot.style.position = "absolute";
    dot.style.left = "50%";
    dot.style.top = "50%";
    dot.style.width = "18px";
    dot.style.height = "18px";
    dot.style.transform = "translate(-50%,-50%)";
    dot.style.borderRadius = "999px";
    dot.style.border = "1px solid rgba(255,77,77,0.7)";
    dot.style.boxShadow = "0 0 18px rgba(255,77,77,0.25)";
    clone.appendChild(dot);
  }

  document.body.appendChild(clone);

  const dx = endCx - startCx;
  const dy = endCy - startCy;
  const arc = Math.max(-140, Math.min(-60, -Math.abs(dx) * 0.1 - 80));

  const animation = clone.animate(
    [
      { transform: "translate3d(0,0,0) scale(1)", opacity: 1 },
      { transform: `translate3d(${dx * 0.55}px,${dy * 0.55 + arc}px,0) scale(0.72)`, opacity: 0.95 },
      { transform: `translate3d(${dx}px,${dy}px,0) scale(0.2)`, opacity: 0 },
    ],
    { duration: 560, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "forwards" }
  );

  try {
    await animation.finished;
  } catch {
    // ignore
  } finally {
    clone.remove();
  }

  try {
    toEl.animate(
      [
        { transform: "translate3d(0,0,0) scale(1)" },
        { transform: "translate3d(0,0,0) scale(1.06)" },
        { transform: "translate3d(0,0,0) scale(1)" },
      ],
      { duration: 220, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
    );
  } catch {
    // ignore
  }
};

export const triggerFlyToCartFrom = (buttonEl: HTMLElement) => {
  if (typeof window === "undefined") return;
  if (prefersReducedMotion()) return;

  const toEl = document.querySelector('[data-cart-target="true"]') as HTMLElement | null;
  if (!toEl) return;

  const source = findFlySource({ buttonEl }) ?? buttonEl;
  // fire and forget
  void flyToCart(source, toEl);
};

