import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/e2d95977-e821-4b67-a67c-09ee00329879";

const IMG_GALA = "https://cdn.poehali.dev/projects/0543cd19-8c4b-447b-af5e-1bf0504c2dc7/files/b4ab4e7d-15ff-4217-9137-2e649ece655b.jpg";
const IMG_FESTIVAL = "https://cdn.poehali.dev/projects/0543cd19-8c4b-447b-af5e-1bf0504c2dc7/files/b5ced6e0-e8bb-4c86-8f9b-fa9b847f258c.jpg";
const IMG_CONFERENCE = "https://cdn.poehali.dev/projects/0543cd19-8c4b-447b-af5e-1bf0504c2dc7/files/3dcccac3-148d-4429-9e09-5b4e500868e9.jpg";

interface Partner {
  id: number;
  name: string;
  description: string;
  logo: string;
  logo_url: string | null;
  is_active: boolean;
}

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  year: string;
  image_url: string;
  description: string;
  is_active: boolean;
}

const services = [
  { icon: "Theater", title: "Монтаж и демонтаж сцен", desc: "Строим сцены любого масштаба: от небольших подиумов до многоуровневых конструкций. Монтаж и демонтаж под ключ.", color: "#FF5C1A", slug: "montazh-scen" },
  { icon: "Zap", title: "Свет и звук", desc: "Полная установка светового и звукового оборудования. Настройка, эксплуатация и демонтаж после мероприятия.", color: "#FF1A8C", slug: "svet-zvuk" },
  { icon: "Package", title: "Аренда оборудования", desc: "Широкий парк сценического оборудования в аренду: фермы, прожекторы, акустика, генераторы, стойки и многое другое.", color: "#FFD600", slug: "arenda-oborudovaniya" },
  { icon: "Eye", title: "Технический надзор", desc: "Наши технические специалисты сопровождают мероприятие от начала до конца — ничто не выйдет из строя.", color: "#00D4FF", slug: "tekhnicheskiy-nadzor" },
  { icon: "Users", title: "Персонал мероприятий", desc: "Хелперы, техники, монтажники и декораторы. Опытная команда для любого масштаба события.", color: "#A855F7", slug: "personal" },
  { icon: "Palette", title: "Декор и оформление", desc: "Концептуальный дизайн пространства, флористика, инсталляции и декоративные конструкции.", color: "#10B981", slug: "dekor" },
];

const ContentSections = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [portfolioLoading, setPortfolioLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((data) => {
        setPartners((data.partners || []).filter((p: Partner) => p.is_active));
        setPortfolio((data.portfolio || []).filter((p: PortfolioItem) => p.is_active));
        setPartnersLoading(false);
        setPortfolioLoading(false);
      })
      .catch(() => { setPartners([]); setPortfolio([]); setPartnersLoading(false); setPortfolioLoading(false); });
  }, []);

  const defaultPortfolio = [
    { img: IMG_GALA, title: "Гала-ужин «Звёздная ночь»", category: "Корпоратив", year: "2024", description: "" },
    { img: IMG_FESTIVAL, title: "Фестиваль NEON FEST", category: "Фестиваль", year: "2024", description: "" },
    { img: IMG_CONFERENCE, title: "TechSummit 2024", category: "Конференция", year: "2024", description: "" },
  ];

  const displayPortfolio = portfolio.length > 0 ? portfolio : defaultPortfolio;

  return (
  <>
    {/* SERVICES */}
    <section id="services" className="py-24 px-6 max-w-7xl mx-auto section-reveal">
      <div className="mb-16">
        <div className="text-[#FF5C1A] font-display text-sm font-bold tracking-widest uppercase mb-4">Что мы делаем</div>
        <h2 className="font-display font-black text-4xl md:text-5xl text-white">
          Наши <span className="text-gradient-orange">услуги</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <a key={i} href={`/services/${s.slug}`} className="card-hover group relative bg-[#10101A] border border-white/5 rounded-2xl p-7 overflow-hidden block">
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `radial-gradient(circle at 30% 30%, ${s.color}15, transparent 70%)` }}
            />
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
              <Icon name={s.icon} size={22} />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-3">{s.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed font-body">{s.desc}</p>
            <div className="mt-5 flex items-center gap-2 text-sm font-display font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: s.color }}>
              Подробнее <Icon name="ArrowRight" size={16} />
            </div>
          </a>
        ))}
      </div>
    </section>

    {/* PORTFOLIO */}
    <section id="portfolio" className="py-24 px-6 bg-[#10101A]/50 section-reveal">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="text-[#FF1A8C] font-display text-sm font-bold tracking-widest uppercase mb-4">Наши работы</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="font-display font-black text-4xl md:text-5xl text-white">
              Портфолио <span className="text-gradient-orange">проектов</span>
            </h2>
            <button className="self-start border border-white/15 text-white/60 hover:text-white hover:border-white/30 font-display font-bold text-sm px-5 py-2.5 rounded-full transition-all">
              Все проекты →
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayPortfolio.map((p, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer card-hover">
              <img src={'image_url' in p ? p.image_url : p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/30 to-transparent" />
              {('description' in p && p.description) && (
                <div className="absolute inset-0 bg-[#0A0A0F]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                  <p className="text-white/80 text-sm text-center font-body leading-relaxed">{p.description}</p>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-display font-bold text-[#FF5C1A] bg-[#FF5C1A]/10 border border-[#FF5C1A]/20 px-3 py-1 rounded-full">{p.category}</span>
                  <span className="text-xs text-white/30">{p.year}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-white">{p.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ABOUT */}
    <section id="about" className="py-24 px-6 max-w-7xl mx-auto section-reveal">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="text-[#FFD600] font-display text-sm font-bold tracking-widest uppercase mb-4">О компании</div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white leading-tight mb-6">
            {new Date().getFullYear() - 2012}+ лет строим
            <br />
            <span className="text-gradient-yellow">сцены для</span>
            <br />
            больших событий
          </h2>
          <p className="text-white/50 leading-relaxed mb-6 font-body">
            Мы — техническая команда полного цикла. С 2012 года монтируем и демонтируем сцены, устанавливаем свет и звук, обеспечиваем техническое сопровождение мероприятий любого масштаба.
          </p>
          <p className="text-white/50 leading-relaxed mb-10 font-body">
            В штате — опытные монтажники, техники, декораторы и хелперы. Собственный парк оборудования позволяет работать быстро и без лишних посредников.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Собственное оборудование", "Монтаж под ключ", "Команда 50+", "Работаем 24/7"].map((tag) => (
              <span key={tag} className="bg-white/5 border border-white/10 text-white/60 text-sm font-body px-4 py-2 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#16162A] border border-white/5 rounded-2xl p-6 col-span-2">
              <div className="font-display font-black text-5xl text-gradient-orange mb-2">500+</div>
              <div className="text-white/50 font-body">успешно реализованных проектов в России и СНГ</div>
            </div>
            <div className="bg-gradient-to-br from-[#FF5C1A]/20 to-[#FF1A8C]/10 border border-[#FF5C1A]/20 rounded-2xl p-6">
              <div className="font-display font-black text-3xl text-white mb-2">98%</div>
              <div className="text-white/50 text-sm font-body">клиентов возвращаются снова</div>
            </div>
            <div className="bg-[#16162A] border border-white/5 rounded-2xl p-6">
              <div className="font-display font-black text-3xl text-[#FFD600] mb-2">40+</div>
              <div className="text-white/50 text-sm font-body">городов присутствия</div>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-[#FF1A8C]/10 blur-[60px]" />
        </div>
      </div>
    </section>

    {/* PARTNERS */}
    <section id="partners" className="py-12 px-6 bg-[#10101A]/50 section-reveal">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-[#FF5C1A] font-display text-sm font-bold tracking-widest uppercase mb-4">Экосистема</div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white">
            Наши <span className="text-gradient-orange">партнёры</span>
          </h2>
          <p className="text-white/40 mt-4 max-w-lg mx-auto font-body">
            Работаем с лучшими в индустрии, чтобы гарантировать высочайшее качество каждого события
          </p>
        </div>
        {partnersLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#10101A] border border-white/5 rounded-2xl p-6 flex items-center gap-5 animate-pulse">
                <div className="w-14 h-14 rounded-xl bg-white/5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-white/5 rounded mb-2 w-2/3" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {partners.map((p) => (
              <div key={p.id} className="card-hover group bg-[#10101A] border border-white/5 rounded-2xl p-6 flex items-center gap-5 hover:border-[#FF5C1A]/20 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#16162A] to-[#1E1E35] border border-white/10 flex items-center justify-center text-2xl flex-shrink-0 group-hover:border-[#FF5C1A]/30 transition-colors">
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={p.name} className="w-9 h-9 object-contain rounded" />
                  ) : (
                    p.logo
                  )}
                </div>
                <div>
                  <div className="font-display font-bold text-white mb-1">{p.name}</div>
                  <div className="text-white/40 text-sm font-body">{p.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <p className="text-white/30 text-sm font-body">
            Хотите стать нашим партнёром?{" "}
            <button onClick={() => document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" })} className="text-[#FF5C1A] hover:underline">
              Напишите нам
            </button>
          </p>
        </div>
        {/* Spacer to reduce gap between partners and footer */}
        <div className="h-8" />
      </div>
    </section>
  </>
  );
};

export default ContentSections;