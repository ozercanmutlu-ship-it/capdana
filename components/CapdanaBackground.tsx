export const CapdanaBackground = () => {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0">
        <div
          className="capdana-glow absolute -left-32 top-[-20%] h-[360px] w-[360px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,77,77,0.28) 0%, rgba(255,77,77,0.06) 55%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div
          className="capdana-glow absolute right-[-10%] top-[12%] h-[320px] w-[320px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(57,255,20,0.22) 0%, rgba(57,255,20,0.05) 55%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div
          className="capdana-glow absolute bottom-[-18%] left-[25%] h-[420px] w-[420px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 55%, rgba(0,0,0,0) 70%)",
          }}
        />
      </div>
      <div className="capdana-pattern absolute inset-0" />
      <div className="capdana-noise absolute inset-0" />
    </div>
  );
};
