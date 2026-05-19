import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const FOUNDED_YEAR = 2012;
const yearsOnMarket = new Date().getFullYear() - FOUNDED_YEAR;

const stats = [
  { num: "500+", label: "Событий проведено" },
  { num: `${yearsOnMarket}+`, label: "Лет на рынке" },
  { num: "98%", label: "Довольных клиентов" },
  { num: "40+", label: "Городов России" },
];

const spotlights = [
  { left: "8%",  delay: 0,    color: "#FF5C1A", angle: -18, intensity: 0.55 },
  { left: "22%", delay: 0.8,  color: "#FF1A8C", angle: -6,  intensity: 0.45 },
  { left: "38%", delay: 1.6,  color: "#FFD600", angle:  4,  intensity: 0.5  },
  { left: "55%", delay: 0.4,  color: "#FF5C1A", angle: -2,  intensity: 0.6  },
  { left: "70%", delay: 1.2,  color: "#FF1A8C", angle:  8,  intensity: 0.45 },
  { left: "84%", delay: 2.0,  color: "#FFD600", angle:  16, intensity: 0.5  },
];

const randAngle = (base: number, range = 28) =>
  base + (Math.random() - 0.5) * range * 2;

const StageLights = () => {
  const [angles, setAngles] = useState(spotlights.map((s) => s.angle));
  const targetAngles = useRef(spotlights.map((s) => s.angle));
  const currentAngles = useRef(spotlights.map((s) => s.angle));
  const rafRef = useRef<number>(0);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Каждый софит меняет цель независимо с разным интервалом
  const scheduleNext = (i: number) => {
    const delay = 1800 + Math.random() * 3500;
    const t = setTimeout(() => {
      const base = spotlights[i].angle;
      targetAngles.current[i] = randAngle(base, 30);
      scheduleNext(i);
    }, delay);
    timeoutRefs.current[i] = t;
  };

  useEffect(() => {
    spotlights.forEach((_, i) => {
      // Стартовая задержка у каждого разная
      const t = setTimeout(() => scheduleNext(i), i * 600 + Math.random() * 1000);
      timeoutRefs.current[i] = t;
    });

    // RAF — плавная интерполяция текущих углов к целевым
    const tick = () => {
      let changed = false;
      const next = currentAngles.current.map((cur, i) => {
        const target = targetAngles.current[i];
        const diff = target - cur;
        if (Math.abs(diff) < 0.05) return cur;
        changed = true;
        return cur + diff * 0.018; // скорость сглаживания
      });
      if (changed) {
        currentAngles.current = next;
        setAngles([...next]);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/8" />

      {spotlights.map((s, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{
            left: s.left,
            transform: `rotate(${angles[i]}deg)`,
            transformOrigin: "top center",
            animation: `spotlight-flicker ${3.5 + i * 0.7}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        >
          <div
            className="w-5 h-3 rounded-b-sm mx-auto"
            style={{
              background: "linear-gradient(to bottom, #2a2a2a, #111)",
              boxShadow: `0 2px 10px ${s.color}60`,
              marginLeft: "-10px",
            }}
          />
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "55px solid transparent",
              borderRight: "55px solid transparent",
              borderTop: `520px solid ${s.color}`,
              opacity: s.intensity * 0.22,
              filter: "blur(18px)",
              marginLeft: "-45px",
            }}
          />
          <div
            className="absolute top-3"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "18px solid transparent",
              borderRight: "18px solid transparent",
              borderTop: `400px solid ${s.color}`,
              opacity: s.intensity * 0.35,
              filter: "blur(6px)",
              marginLeft: "-8px",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "510px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "140px",
              height: "60px",
              borderRadius: "50%",
              background: `radial-gradient(ellipse, ${s.color}35 0%, transparent 70%)`,
              filter: "blur(12px)",
            }}
          />
        </div>
      ))}
    </div>
  );
};

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <>
      <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <StageLights />
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#FF5C1A]/15 blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[#FF1A8C]/15 blur-[120px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FFD600]/5 blur-[160px]" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 text-sm text-white/60 font-body animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#FF5C1A] animate-pulse" />
            Техническое производство мероприятий
          </div>

          <h1 className="font-display font-black text-4xl md:text-5xl lg:text-7xl leading-[0.95] mb-7 tracking-tight animate-fade-up">
            <span className="inline-block hero-title-glow text-gradient-orange">ARTSTAGE</span>
            <span className="text-white/30">.PRO</span>
            <br />
            <span className="text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide">СЦЕНЫ. СВЕТ. ЗВУК.</span>
            <br />
            <span className="text-gradient-yellow">МОНТАЖ ПОД КЛЮЧ</span>
          </h1>

          <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto mb-10 font-body leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Строим и демонтируем сцены, устанавливаем свет и звук, предоставляем оборудование в аренду и технический персонал для мероприятий любого масштаба.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <button
              onClick={() => document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-gradient-to-r from-[#FF5C1A] to-[#FF1A8C] text-white font-display font-bold px-8 py-4 rounded-full text-sm hover:opacity-90 transition-all hover:scale-105 glow-orange"
            >
              Обсудить проект
            </button>
            <button
              onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
              className="border border-white/20 text-white font-display font-bold px-8 py-4 rounded-full text-sm hover:border-[#FF5C1A]/50 transition-all hover:bg-white/5"
            >
              Наши работы →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-white/5 animate-fade-up" style={{ animationDelay: "0.6s" }}>
            {stats.map((s) => (
              <div key={s.num} className="text-center">
                <div className="font-display font-black text-3xl md:text-4xl text-gradient-orange">{s.num}</div>
                <div className="text-white/40 text-sm mt-1 font-body">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/20 animate-bounce">
          <Icon name="ChevronDown" size={20} />
        </div>
      </section>

      {/* TICKER */}
      <div className="overflow-hidden border-y border-white/5 bg-[#10101A] py-4 mt-16">
        <div className="flex gap-12 animate-ticker whitespace-nowrap">
          {["МОНТАЖ СЦЕН", "СВЕТ И ЗВУК", "АРЕНДА ОБОРУДОВАНИЯ", "ТЕХНИЧЕСКИЙ НАДЗОР", "ДЕКОР", "ПЕРСОНАЛ", "ДЕМОНТАЖ", "КОРПОРАТИВЫ", "ФЕСТИВАЛИ", "КОНЦЕРТЫ",
            "МОНТАЖ СЦЕН", "СВЕТ И ЗВУК", "АРЕНДА ОБОРУДОВАНИЯ", "ТЕХНИЧЕСКИЙ НАДЗОР", "ДЕКОР", "ПЕРСОНАЛ", "ДЕМОНТАЖ", "КОРПОРАТИВЫ", "ФЕСТИВАЛИ", "КОНЦЕРТЫ"].map((t, i) => (
            <span key={i} className="font-display font-black text-sm tracking-widest text-white/15 flex items-center gap-12">
              {t} <span className="text-[#FF5C1A]">✦</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default HeroSection;