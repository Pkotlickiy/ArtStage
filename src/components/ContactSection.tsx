import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useSettings } from "@/hooks/useSettings";

const emptyForm = { name: "", contact: "", type: "", message: "" };

const SOCIAL_MAP: { key: keyof ReturnType<typeof useSettings>["settings"]; icon: string; label: string }[] = [
  { key: "telegram", icon: "Send", label: "Telegram" },
  { key: "whatsapp", icon: "MessageCircle", label: "WhatsApp" },
  { key: "instagram", icon: "Instagram", label: "Instagram" },
  { key: "vk", icon: "Share2", label: "ВКонтакте" },
  { key: "youtube", icon: "Youtube", label: "YouTube" },
];

const ContactSection = () => {
  const { settings } = useSettings();
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

  const handleReset = () => { setForm(emptyForm); setSubmitted(false); };

  return (
  <>
    {/* CONTACTS */}
    <section id="contacts" className="py-24 px-6 section-reveal">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-[#FF1A8C] font-display text-sm font-bold tracking-widest uppercase mb-4">Свяжитесь с нами</div>
        <h2 className="font-display font-black text-4xl md:text-6xl text-white mb-6">
          Давайте создадим
          <br />
          <span className="text-gradient-orange">что-то грандиозное</span>
        </h2>
        <p className="text-white/40 mb-12 max-w-lg mx-auto font-body leading-relaxed">
          Расскажите о вашем событии — мы свяжемся в течение часа и предложим концепцию.
        </p>

        <div className="bg-[#10101A] border border-white/5 rounded-3xl p-8 md:p-10 text-left">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                <Icon name="CheckCircle" size={32} className="text-emerald-400" />
              </div>
              <h3 className="font-display font-black text-2xl text-white mb-3">Заявка отправлена!</h3>
              <p className="text-white/40 font-body mb-8">Мы свяжемся с вами в течение часа.</p>
              <button
                onClick={handleReset}
                className="border border-white/15 text-white/60 hover:text-white hover:border-white/30 font-display font-bold text-sm px-6 py-3 rounded-full transition-all"
              >
                Отправить ещё одну заявку
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="text-white/40 text-sm font-body mb-2 block">Ваше имя</label>
                  <input
                    value={form.name}
                    onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                    className={`w-full bg-[#16162A] border rounded-xl px-4 py-3 text-white font-body focus:outline-none transition-colors placeholder:text-white/20 ${errors.name ? "border-red-500/60" : "border-white/10 focus:border-[#FF5C1A]/50"}`}
                    placeholder="Александр"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1 font-body">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-white/40 text-sm font-body mb-2 block">Телефон или e-mail</label>
                  <input
                    value={form.contact}
                    onChange={(e) => { setForm({ ...form, contact: e.target.value }); setErrors({ ...errors, contact: "" }); }}
                    className={`w-full bg-[#16162A] border rounded-xl px-4 py-3 text-white font-body focus:outline-none transition-colors placeholder:text-white/20 ${errors.contact ? "border-red-500/60" : "border-white/10 focus:border-[#FF5C1A]/50"}`}
                    placeholder="+7 (999) 000-00-00"
                  />
                  {errors.contact && <p className="text-red-400 text-xs mt-1 font-body">{errors.contact}</p>}
                </div>
              </div>
              <div className="mb-5">
                <label className="text-white/40 text-sm font-body mb-2 block">Тип события</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white/70 font-body focus:outline-none focus:border-[#FF5C1A]/50 transition-colors"
                >
                  <option value="">Выберите формат...</option>
                  <option>Корпоратив</option>
                  <option>Фестиваль / концерт</option>
                  <option>Конференция</option>
                  <option>Свадьба</option>
                  <option>Другое</option>
                </select>
              </div>
              <div className="mb-8">
                <label className="text-white/40 text-sm font-body mb-2 block">Расскажите о проекте</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white font-body focus:outline-none focus:border-[#FF5C1A]/50 transition-colors placeholder:text-white/20 resize-none"
                  placeholder="Дата, количество гостей, формат, бюджет..."
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-[#FF5C1A] to-[#FF1A8C] text-white font-display font-bold py-4 rounded-xl text-base hover:opacity-90 transition-all hover:scale-[1.01] glow-orange"
              >
                Отправить заявку
              </button>
            </>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-12 text-white/30 text-sm font-body">
          {settings.phone && (
            <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Icon name="Phone" size={16} className="text-[#FF5C1A]" />
              <span>{settings.phone}</span>
            </a>
          )}
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Icon name="Mail" size={16} className="text-[#FF5C1A]" />
              <span>{settings.email}</span>
            </a>
          )}
          {settings.address && (
            <div className="flex items-center gap-2">
              <Icon name="MapPin" size={16} className="text-[#FF5C1A]" />
              <span>{settings.address}</span>
            </div>
          )}
        </div>
      </div>
    </section>

    {/* FOOTER */}
    <footer className="border-t border-white/5 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-display font-black text-lg">
          <span className="text-gradient-orange">ARTSTAGE</span>
          <span className="text-white/50">.PRO</span>
        </div>
        <div className="text-white/20 text-sm font-body text-center">© {new Date().getFullYear()} ARTSTAGE.PRO. Все права защищены.</div>
        <div className="flex gap-3">
          {SOCIAL_MAP.filter((s) => settings[s.key]).map((s) => (
            <a
              key={s.key}
              href={settings[s.key]}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#FF5C1A] hover:border-[#FF5C1A]/30 transition-colors"
            >
              <Icon name={s.icon} size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  </>
  );
};

export default ContactSection;