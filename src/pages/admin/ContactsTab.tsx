import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { SETTINGS_API, SiteSettings } from "@/hooks/useSettings";

const CONTACT_FIELDS: { key: keyof SiteSettings; label: string; icon: string; placeholder: string; type?: string }[] = [
  { key: "phone", label: "Телефон", icon: "Phone", placeholder: "+7 (800) 000-00-00", type: "tel" },
  { key: "email", label: "E-mail", icon: "Mail", placeholder: "hello@artstage.pro", type: "email" },
  { key: "address", label: "Адрес офиса", icon: "MapPin", placeholder: "Москва, ул. Тверская, 12" },
];

const SOCIAL_FIELDS: { key: keyof SiteSettings; label: string; icon: string; placeholder: string }[] = [
  { key: "telegram", label: "Telegram", icon: "Send", placeholder: "https://t.me/your_channel" },
  { key: "whatsapp", label: "WhatsApp", icon: "MessageCircle", placeholder: "https://wa.me/78000000000" },
  { key: "instagram", label: "Instagram", icon: "Instagram", placeholder: "https://instagram.com/your_account" },
  { key: "vk", label: "ВКонтакте", icon: "Share2", placeholder: "https://vk.com/your_group" },
  { key: "youtube", label: "YouTube", icon: "Youtube", placeholder: "https://youtube.com/@your_channel" },
];

const ContactsTab = ({ showToast }: { showToast: (m: string, t?: "ok" | "err") => void }) => {
  const [settings, setSettings] = useState<SiteSettings>({
    phone: "", email: "", address: "", instagram: "", telegram: "", youtube: "", vk: "", whatsapp: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch(SETTINGS_API);
    const data = await res.json();
    setSettings((prev) => ({ ...prev, ...(data.settings || {}) }));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(SETTINGS_API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    });
    setSaving(false);
    if (res.ok) showToast("Контакты сохранены");
    else showToast("Ошибка сохранения", "err");
  };

  const update = (k: keyof SiteSettings, v: string) => setSettings({ ...settings, [k]: v });

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-white/30"><Icon name="Loader" size={24} className="animate-spin mr-3" /> Загрузка...</div>;
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl text-white mb-1">Контакты и соцсети</h1>
        <p className="text-white/40 font-body text-sm">Отображаются в подвале и на странице контактов</p>
      </div>

      <div className="bg-[#10101A] border border-white/5 rounded-2xl p-6 md:p-8 mb-6">
        <h2 className="font-display font-bold text-lg text-white mb-5 flex items-center gap-2">
          <Icon name="Phone" size={18} className="text-[#FF5C1A]" />
          Основные контакты
        </h2>
        <div className="space-y-4">
          {CONTACT_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="text-white/40 text-sm font-body mb-2 block">{f.label}</label>
              <div className="relative">
                <Icon name={f.icon} size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={f.type || "text"}
                  value={settings[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full bg-[#16162A] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white font-body focus:outline-none focus:border-[#FF5C1A]/50 transition-colors placeholder:text-white/20"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#10101A] border border-white/5 rounded-2xl p-6 md:p-8 mb-6">
        <h2 className="font-display font-bold text-lg text-white mb-5 flex items-center gap-2">
          <Icon name="Share2" size={18} className="text-[#FF1A8C]" />
          Социальные сети
        </h2>
        <p className="text-white/30 text-xs font-body mb-5">Оставьте поле пустым, чтобы скрыть иконку с сайта</p>
        <div className="space-y-4">
          {SOCIAL_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="text-white/40 text-sm font-body mb-2 block flex items-center gap-2">
                <Icon name={f.icon} size={14} className="text-white/40" />
                {f.label}
              </label>
              <input
                value={settings[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white font-body focus:outline-none focus:border-[#FF5C1A]/50 transition-colors placeholder:text-white/20"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-6 z-10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-[#FF5C1A] to-[#FF1A8C] text-white font-display font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-2xl"
        >
          {saving ? <Icon name="Loader" size={18} className="animate-spin" /> : <Icon name="Save" size={18} />}
          Сохранить изменения
        </button>
      </div>
    </>
  );
};

export default ContactsTab;
