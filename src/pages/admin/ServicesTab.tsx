import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { SETTINGS_API, SiteSettings } from "@/hooks/useSettings";

const SERVICES_API = "https://functions.poehali.dev/fe246b5b-3b25-4c0f-b89c-7697e85675a1";

interface Feature { title: string; desc: string; }

interface ServicePageData {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  features: Feature[];
  icon: string;
  color: string;
  is_active: boolean;
}

const ServicesTab = ({ showToast }: { showToast: (m: string, t?: "ok" | "err") => void }) => {
  const [pages, setPages] = useState<ServicePageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<ServicePageData | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch(SERVICES_API);
    const data = await res.json();
    setPages(data.pages || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const res = await fetch(`${SERVICES_API}?slug=${editing.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editing.title,
        subtitle: editing.subtitle,
        description: editing.description,
        features: editing.features,
        is_active: editing.is_active,
      }),
    });
    setSaving(false);
    if (res.ok) { showToast("Услуга обновлена"); setEditing(null); load(); }
    else showToast("Ошибка сохранения", "err");
  };

  const updateFeature = (idx: number, field: keyof Feature, val: string) => {
    if (!editing) return;
    const features = editing.features.map((f, i) => i === idx ? { ...f, [field]: val } : f);
    setEditing({ ...editing, features });
  };

  const addFeature = () => {
    if (!editing) return;
    setEditing({ ...editing, features: [...editing.features, { title: "", desc: "" }] });
  };

  const removeFeature = (idx: number) => {
    if (!editing) return;
    setEditing({ ...editing, features: editing.features.filter((_, i) => i !== idx) });
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl text-white mb-1">Страницы услуг</h1>
        <p className="text-white/40 font-body text-sm">Редактируйте содержимое страниц по каждой услуге</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-white/30"><Icon name="Loader" size={24} className="animate-spin mr-3" /> Загрузка...</div>
      ) : (
        <div className="space-y-3">
          {pages.map((p) => (
            <div key={p.slug} className={`bg-[#10101A] border border-white/5 rounded-2xl p-5 flex items-center justify-between gap-4 ${!p.is_active ? "opacity-50" : ""}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${p.color}20`, color: p.color }}>
                  <Icon name={p.icon} size={18} />
                </div>
                <div>
                  <div className="font-display font-bold text-white">{p.title}</div>
                  <div className="text-white/40 text-sm font-body">{p.subtitle}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a href={`/services/${p.slug}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-colors">
                  <Icon name="ExternalLink" size={14} />
                </a>
                <button onClick={() => setEditing({ ...p })} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-colors">
                  <Icon name="Pencil" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#10101A] border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl my-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-white">Редактировать: {editing.title}</h2>
              <button onClick={() => setEditing(null)} className="text-white/30 hover:text-white transition-colors"><Icon name="X" size={20} /></button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-white/40 text-sm mb-2 block">Заголовок страницы</label>
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5C1A]/50 transition-colors" />
              </div>
              <div>
                <label className="text-white/40 text-sm mb-2 block">Подзаголовок</label>
                <input value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5C1A]/50 transition-colors" />
              </div>
              <div>
                <label className="text-white/40 text-sm mb-2 block">Описание</label>
                <textarea rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5C1A]/50 transition-colors resize-none" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white/40 text-sm">Что входит в услугу</label>
                  <button onClick={addFeature} className="text-[#FF5C1A] text-sm font-display font-bold flex items-center gap-1 hover:opacity-80 transition-opacity">
                    <Icon name="Plus" size={14} /> Добавить пункт
                  </button>
                </div>
                <div className="space-y-3">
                  {editing.features.map((f, i) => (
                    <div key={i} className="bg-[#16162A] border border-white/5 rounded-xl p-4 flex gap-3">
                      <div className="flex-1 space-y-2">
                        <input value={f.title} onChange={(e) => updateFeature(i, "title", e.target.value)} className="w-full bg-transparent border-b border-white/10 pb-1 text-white text-sm focus:outline-none focus:border-[#FF5C1A]/50 transition-colors" placeholder="Заголовок пункта" />
                        <input value={f.desc} onChange={(e) => updateFeature(i, "desc", e.target.value)} className="w-full bg-transparent text-white/50 text-sm focus:outline-none" placeholder="Описание пункта" />
                      </div>
                      <button onClick={() => removeFeature(i)} className="text-white/20 hover:text-red-400 transition-colors flex-shrink-0 mt-1">
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-white/40 text-sm">Активна</label>
                <button onClick={() => setEditing({ ...editing, is_active: !editing.is_active })} className={`w-10 h-6 rounded-full transition-all relative ${editing.is_active ? "bg-[#FF5C1A]" : "bg-white/10"}`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${editing.is_active ? "left-5" : "left-1"}`} />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 border border-white/10 text-white/50 font-display font-bold py-3 rounded-xl hover:border-white/20 hover:text-white transition-all">Отмена</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-gradient-to-r from-[#FF5C1A] to-[#FF1A8C] text-white font-display font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                {saving && <Icon name="Loader" size={16} className="animate-spin" />}
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesTab;
