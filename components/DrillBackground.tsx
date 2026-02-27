const patternSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240" fill="none">
  <rect width="240" height="240" fill="transparent"/>
  <g opacity="0.9" stroke="#ffffff" stroke-width="1">
    <path d="M20 24h24M32 12v24"/>
    <path d="M200 32l16 16M216 32l-16 16"/>
    <path d="M120 30h52"/>
    <path d="M64 200h80"/>
    <path d="M28 140h36"/>
  </g>
  <g fill="#ffffff" opacity="0.7" font-family="Arial, Helvetica, sans-serif" font-size="12" letter-spacing="3">
    <text x="18" y="88">CAPDANA</text>
    <text x="110" y="170">CAPDANA</text>
  </g>
  <g opacity="0.7">
    <rect x="172" y="64" width="44" height="10" fill="#ffffff"/>
    <rect x="172" y="78" width="32" height="6" fill="#ffffff"/>
    <rect x="172" y="88" width="38" height="6" fill="#ffffff"/>
  </g>
  <g opacity="0.7" fill="#ffffff">
    <circle cx="40" cy="118" r="1.5"/>
    <circle cx="52" cy="118" r="1.5"/>
    <circle cx="64" cy="118" r="1.5"/>
    <circle cx="40" cy="130" r="1.5"/>
    <circle cx="52" cy="130" r="1.5"/>
    <circle cx="64" cy="130" r="1.5"/>
  </g>
</svg>
`);

export const DrillBackground = () => {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-32 top-[-20%] h-[380px] w-[380px] rounded-full drill-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(255,77,77,0.35) 0%, rgba(255,77,77,0.05) 55%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div
          className="absolute right-[-10%] top-[10%] h-[320px] w-[320px] rounded-full drill-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(57,255,20,0.25) 0%, rgba(57,255,20,0.06) 55%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div
          className="absolute bottom-[-15%] left-[25%] h-[420px] w-[420px] rounded-full drill-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 55%, rgba(0,0,0,0) 70%)",
          }}
        />
      </div>
      <div
        className="absolute inset-0 drill-pattern"
        style={{ backgroundImage: `url("data:image/svg+xml,${patternSvg}")` }}
      />
      <div className="absolute inset-0 drill-noise" />
    </div>
  );
};
