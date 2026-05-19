import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import NavBar from "@/components/NavBar";

const API = "https://functions.poehali.dev/fe246b5b-3b25-4c0f-b89c-7697e85675a1";

interface Feature {
  title: string;
  desc: string;
}

interface ServicePageData {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  features: Feature[];
  icon: string;
  color: string;
}

const emptyForm = { name: "", contact: "", message: "" };

const ContactForm = ({ serviceTitle, color }: { serviceTitle: string; color: string }) => {
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});

  const validate = () => {
    const e: Partial<typeof emptyForm> = {};
    if (!form.name.trim()) e.name = "Введите имя";
    if (!form.contact.trim()) e.contact = "Введите телефон или e-mail";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
          <Icon name="CheckCircle" size={32} className="text-emerald-400" />
        </div>
        <h3 className="font-display font-black text-2xl text-white mb-3">Заявка отправлена!</h3>
        <p className="text-white/40 font-body">Мы свяжемся с вами в течение часа.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-white/40 text-sm font-body mb-2 block">Ваше имя</label>
          <input
            value={form.name}
            onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
            className={`w-full bg-[#16162A] border rounded-xl px-4 py-3 text-white font-body focus:outline-none transition-colors placeholder:text-white/20 ${errors.name ? "border-red-500/60" : "border-white/10 focus:border-[#FF5C1A]/50"}`}
            placeholder="Александр"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="text-white/40 text-sm font-body mb-2 block">Телефон или e-mail</label>
          <input
            value={form.contact}
            onChange={(e) => { setForm({ ...form, contact: e.target.value }); setErrors({ ...errors, contact: "" }); }}
            className={`w-full bg-[#16162A] border rounded-xl px-4 py-3 text-white font-body focus:outline-none transition-colors placeholder:text-white/20 ${errors.contact ? "border-red-500/60" : "border-white/10 focus:border-[#FF5C1A]/50"}`}
            placeholder="+7 (999) 000-00-00"
          />
          {errors.contact && <p className="text-red-400 text-xs mt-1">{errors.contact}</p>}
        </div>
      </div>
      <div>
        <label className="text-white/40 text-sm font-body mb-2 block">Расскажите о проекте</label>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white font-body focus:outline-none focus:border-[#FF5C1A]/50 transition-colors placeholder:text-white/20 resize-none"
          placeholder={`Расскажите о вашем мероприятии — дата, место, масштаб...`}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full text-white font-display font-bold py-4 rounded-xl text-base hover:opacity-90 transition-all hover:scale-[1.01]"
        style={{ background: `linear-gradient(135deg, ${color}, #FF1A8C)` }}
      >
        Оставить заявку на «{serviceTitle}»
      </button>
    </div>
  );
};

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<ServicePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Обновляем мета-теги динамически
  useEffect(() => {
    if (!page) return;
    const title = `${page.title} — ARTSTAGE.PRO`;
    const desc = `${page.subtitle}. ${page.description.slice(0, 120)}...`;
    const url = `https://artstage.pro/services/${page.slug}`;

    document.title = title;
    const setMeta = (sel: string, val: string) => {
      const el = document.querySelector(sel);
      if (el) el.setAttribute(el.tagName === "LINK" ? "href" : "content", val);
    };
    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', desc);
    setMeta('meta[property="og:url"]', url);
    setMeta('link[rel="canonical"]', url);

    // Schema.org для страницы услуги
    const existing = document.getElementById("service-schema");
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.id = "service-schema";
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": page.title,
      "description": page.description,
      "provider": { "@type": "Organization", "name": "ARTSTAGE.PRO", "url": "https://artstage.pro" },
      "url": url,
      "areaServed": "RU",
    });
    document.head.appendChild(script);

    return () => {
      document.title = "ARTSTAGE.PRO — Монтаж сцен, свет и звук, аренда оборудования";
      document.getElementById("service-schema")?.remove();
    };
  }, [page]);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API}?slug=${slug}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then((data) => {
        if (data?.page) {
          setPage(data.page);
        }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <Icon name="Loader" size={32} className="text-[#FF5C1A] animate-spin" />
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center text-white">
        <div className="text-6xl mb-4">404</div>
        <p className="text-white/40 mb-6">Страница не найдена</p>
        <button onClick={() => navigate("/")} className="text-[#FF5C1A] hover:underline font-display font-bold">← На главную</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-body">
      <NavBar />

      {/* HERO */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[400px] opacity-20" style={{ background: `radial-gradient(ellipse at 50% 0%, ${page.color}60, transparent 70%)` }} />
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full blur-[100px] opacity-15" style={{ background: page.color }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-10 font-body text-sm"
          >
            <Icon name="ArrowLeft" size={16} />
            Все услуги
          </button>

          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{ backgroundColor: `${page.color}20`, color: page.color }}
          >
            <Icon name={page.icon} size={30} />
          </div>

          <div className="text-sm font-display font-bold tracking-widest uppercase mb-4" style={{ color: page.color }}>
            Услуга
          </div>
          <h1 className="font-display font-black text-4xl md:text-6xl text-white leading-tight mb-4">
            {page.title}
          </h1>
          <p className="text-white/50 text-xl font-body mb-8">{page.subtitle}</p>
          <button
            onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 text-white font-display font-bold px-7 py-3.5 rounded-full hover:opacity-90 transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${page.color}, #FF1A8C)` }}
          >
            Оставить заявку
            <Icon name="ArrowRight" size={16} />
          </button>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/60 text-lg leading-relaxed font-body border-l-2 pl-6" style={{ borderColor: page.color }}>
            {page.description}
          </p>
        </div>
      </section>

      {/* FEATURES */}
      {page.features && page.features.length > 0 && (
        <section className="py-10 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-black text-2xl md:text-3xl text-white mb-10">
              Что входит в услугу
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {page.features.map((f, i) => (
                <div
                  key={i}
                  className="bg-[#10101A] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 font-display font-black text-sm"
                      style={{ backgroundColor: `${page.color}20`, color: page.color }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-display font-bold text-white mb-1">{f.title}</div>
                      <div className="text-white/40 text-sm font-body leading-relaxed">{f.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT FORM */}
      <section id="contact-form" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#10101A] border border-white/5 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="text-sm font-display font-bold tracking-widest uppercase mb-3" style={{ color: page.color }}>
                Оставить заявку
              </div>
              <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-3">
                Обсудим ваш проект
              </h2>
              <p className="text-white/40 font-body max-w-md mx-auto">
                Расскажите о мероприятии — мы свяжемся в течение часа и предложим решение.
              </p>
            </div>
            <ContactForm serviceTitle={page.title} color={page.color} />
          </div>
        </div>
      </section>

      {/* FOOTER MINI */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <div className="font-display font-black text-base mb-1">
          <span className="text-gradient-orange">ARTSTAGE</span>
          <span className="text-white/50">.PRO</span>
        </div>
        <div className="text-white/20 text-sm font-body">© {new Date().getFullYear()} ARTSTAGE.PRO. Все права защищены.</div>
      </footer>
    </div>
  );
}