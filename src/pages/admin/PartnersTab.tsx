import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

const PARTNERS_API = "https://functions.poehali.dev/e2d95977-e821-4b67-a67c-09ee00329879";

const EMOJI_OPTIONS = ["🏢", "📡", "💡", "🎵", "🎬", "🌸", "🎪", "🎭", "🎤", "🎨", "🏆", "🎯", "🚀", "⭐", "🔥", "💎"];

interface Partner {
  id: number;
  name: string;
  description: string;
  logo: string;
  logo_url: string | null;
  sort_order: number;
  is_active: boolean;
}

const emptyPartnerForm = { name: "", description: "", logo: "🏢", logo_url: "", sort_order: 0, is_active: true };

const PartnersTab = ({ showToast }: { showToast: (m: string, t?: "ok" | "err") => void }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyPartnerForm);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch(PARTNERS_API);
    const data = await res.json();
    setPartners(data.partners || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditingId(null); setForm(emptyPartnerForm); setShowForm(true); };
  const openEdit = (p: Partner) => {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description, logo: p.logo, logo_url: p.logo_url || "", sort_order: p.sort_order, is_active: p.is_active });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.description.trim()) { showToast("Заполните название и описание", "err"); return; }
    setSaving(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${PARTNERS_API}?id=${editingId}` : PARTNERS_API;
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, sort_order: Number(form.sort_order) }) });
    setSaving(false);
    if (res.ok) { showToast(editingId ? "Партнёр обновлён" : "Партнёр добавлен"); setShowForm(false); load(); }
    else showToast("Ошибка сохранения", "err");
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Удалить партнёра «${name}»?`)) return;
    const res = await fetch(`${PARTNERS_API}?id=${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Партнёр удалён"); load(); }
    else showToast("Ошибка удаления", "err");
  };

  const toggleActive = async (p: Partner) => {
    await fetch(`${PARTNERS_API}?id=${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: !p.is_active }) });
    load();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-white mb-1">Партнёры</h1>
          <p className="text-white/40 font-body text-sm">Отображаются на главной странице сайта</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-gradient-to-r from-[#FF5C1A] to-[#FF1A8C] text-white font-display font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
          <Icon name="Plus" size={16} /> Добавить
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-white/30"><Icon name="Loader" size={24} className="animate-spin mr-3" /> Загрузка...</div>
      ) : partners.length === 0 ? (
        <div className="text-center py-24 text-white/30"><Icon name="Users" size={40} className="mx-auto mb-4 opacity-30" /><p>Партнёры не добавлены</p></div>
      ) : (
        <div className="bg-[#10101A] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-white/30 text-xs font-display font-bold uppercase tracking-widest">Партнёр</th>
                <th className="text-left px-6 py-4 text-white/30 text-xs font-display font-bold uppercase tracking-widest hidden md:table-cell">Описание</th>
                <th className="text-center px-6 py-4 text-white/30 text-xs font-display font-bold uppercase tracking-widest">Порядок</th>
                <th className="text-center px-6 py-4 text-white/30 text-xs font-display font-bold uppercase tracking-widest">Активен</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {partners.map((p) => (
                <tr key={p.id} className={`border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors ${!p.is_active ? "opacity-40" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#16162A] border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                        {p.logo_url ? <img src={p.logo_url} alt={p.name} className="w-7 h-7 object-contain rounded" /> : p.logo}
                      </div>
                      <span className="font-display font-bold text-white">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/50 text-sm hidden md:table-cell">{p.description}</td>
                  <td className="px-6 py-4 text-center text-white/40 text-sm">{p.sort_order}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => toggleActive(p)} className={`w-10 h-6 rounded-full transition-all relative ${p.is_active ? "bg-[#FF5C1A]" : "bg-white/10"}`}>
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${p.is_active ? "left-5" : "left-1"}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-colors"><Icon name="Pencil" size={14} /></button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-red-400 hover:border-red-400/30 transition-colors"><Icon name="Trash2" size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#10101A] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl my-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-white">{editingId ? "Редактировать партнёра" : "Новый партнёр"}</h2>
              <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white transition-colors"><Icon name="X" size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-white/40 text-sm mb-2 block">Название *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5C1A]/50 transition-colors placeholder:text-white/20" placeholder="BrandCo" />
              </div>
              <div>
                <label className="text-white/40 text-sm mb-2 block">Описание *</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5C1A]/50 transition-colors placeholder:text-white/20" placeholder="Стратегический партнёр" />
              </div>
              <div>
                <label className="text-white/40 text-sm mb-2 block">Иконка</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button key={emoji} onClick={() => setForm({ ...form, logo: emoji })} className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all border ${form.logo === emoji ? "border-[#FF5C1A] bg-[#FF5C1A]/10" : "border-white/10 bg-[#16162A] hover:border-white/20"}`}>{emoji}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-white/40 text-sm mb-2 block">URL логотипа (необязательно)</label>
                <input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5C1A]/50 transition-colors placeholder:text-white/20" placeholder="https://example.com/logo.png" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-white/40 text-sm mb-2 block">Порядок</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5C1A]/50 transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-sm mb-2 block">Активен</label>
                  <button onClick={() => setForm({ ...form, is_active: !form.is_active })} className={`mt-1 w-14 h-10 rounded-xl border transition-all flex items-center justify-center font-display font-bold text-xs ${form.is_active ? "border-[#FF5C1A]/40 bg-[#FF5C1A]/10 text-[#FF5C1A]" : "border-white/10 bg-[#16162A] text-white/30"}`}>{form.is_active ? "ДА" : "НЕТ"}</button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-white/10 text-white/50 font-display font-bold py-3 rounded-xl hover:border-white/20 hover:text-white transition-all">Отмена</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-gradient-to-r from-[#FF5C1A] to-[#FF1A8C] text-white font-display font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                {saving && <Icon name="Loader" size={16} className="animate-spin" />}
                {editingId ? "Сохранить" : "Добавить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PartnersTab;
