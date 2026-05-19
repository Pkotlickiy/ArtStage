import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

const PORTFOLIO_API = "https://functions.poehali.dev/e2d95977-e821-4b67-a67c-09ee00329879";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  year: string;
  image_url: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

const emptyPortfolioForm = {
  title: "",
  category: "",
  year: new Date().getFullYear().toString(),
  image_url: "",
  description: "",
  is_active: true,
  sort_order: 0,
};

const PortfolioTab = ({ showToast }: { showToast: (m: string, t?: "ok" | "err") => void }) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyPortfolioForm);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(PORTFOLIO_API);
      const data = await res.json();
      setPortfolio(data.portfolio || []);
    } catch {
      setPortfolio([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyPortfolioForm, year: new Date().getFullYear().toString() });
    setShowForm(true);
  };

  const openEdit = (p: PortfolioItem) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      category: p.category,
      year: p.year,
      image_url: p.image_url,
      description: p.description,
      is_active: p.is_active,
      sort_order: p.sort_order,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      showToast("Введите название проекта", "err");
      return;
    }
    if (!form.image_url.trim()) {
      showToast("Введите URL изображения", "err");
      return;
    }
    setSaving(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${PORTFOLIO_API}?id=${editingId}` : PORTFOLIO_API;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sort_order: Number(form.sort_order) }),
    });
    setSaving(false);
    if (res.ok) {
      showToast(editingId ? "Проект обновлён" : "Проект добавлен");
      setShowForm(false);
      load();
    } else {
      showToast("Ошибка сохранения", "err");
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Удалить проект «${title}»?`)) return;
    const res = await fetch(`${PORTFOLIO_API}?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Проект удалён");
      load();
    } else {
      showToast("Ошибка удаления", "err");
    }
  };

  const toggleActive = async (p: PortfolioItem) => {
    await fetch(`${PORTFOLIO_API}?id=${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !p.is_active }),
    });
    load();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-white mb-1">Портфолио</h1>
          <p className="text-white/40 font-body text-sm">Управление проектами и фотографиями</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-[#FF5C1A] to-[#FF1A8C] text-white font-display font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
        >
          <Icon name="Plus" size={16} /> Добавить
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-white/30">
          <Icon name="Loader" size={24} className="animate-spin mr-3" /> Загрузка...
        </div>
      ) : portfolio.length === 0 ? (
        <div className="text-center py-24 text-white/30">
          <Icon name="Image" size={40} className="mx-auto mb-4 opacity-30" />
          <p>Портфолио пусто</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((p) => (
            <div
              key={p.id}
              className={`bg-[#10101A] border border-white/5 rounded-2xl overflow-hidden group ${!p.is_active ? "opacity-40" : ""}`}
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-display font-bold text-[#FF5C1A] bg-[#FF5C1A]/10 border border-[#FF5C1A]/20 px-3 py-1 rounded-full">
                      {p.category}
                    </span>
                    <span className="text-xs text-white/30">{p.year}</span>
                  </div>
                  <h3 className="font-display font-bold text-white">{p.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleActive(p)}
                    className={`w-10 h-6 rounded-full transition-all relative ${p.is_active ? "bg-[#FF5C1A]" : "bg-white/10"}`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${p.is_active ? "left-5" : "left-1"}`}
                    />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-colors"
                    >
                      <Icon name="Pencil" size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-red-400 hover:border-red-400/30 transition-colors"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#10101A] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl my-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-white">
                {editingId ? "Редактировать проект" : "Новый проект"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-white/40 text-sm mb-2 block">Название *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5C1A]/50 transition-colors placeholder:text-white/20"
                  placeholder="Гала-ужин «Звёздная ночь»"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/40 text-sm mb-2 block">Категория</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5C1A]/50 transition-colors placeholder:text-white/20"
                    placeholder="Корпоратив"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-sm mb-2 block">Год</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5C1A]/50 transition-colors"
                    placeholder="2024"
                  />
                </div>
              </div>
              <div>
                <label className="text-white/40 text-sm mb-2 block">URL изображения *</label>
                <input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5C1A]/50 transition-colors placeholder:text-white/20"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="text-white/40 text-sm mb-2 block">Описание (появляется при наведении)</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5C1A]/50 transition-colors placeholder:text-white/20 resize-none"
                  placeholder="Текст описания проекта..."
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-white/40 text-sm mb-2 block">Порядок</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                    className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5C1A]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-sm mb-2 block">Активен</label>
                  <button
                    onClick={() => setForm({ ...form, is_active: !form.is_active })}
                    className={`mt-1 w-14 h-10 rounded-xl border transition-all flex items-center justify-center font-display font-bold text-xs ${
                      form.is_active
                        ? "border-[#FF5C1A]/40 bg-[#FF5C1A]/10 text-[#FF5C1A]"
                        : "border-white/10 bg-[#16162A] text-white/30"
                    }`}
                  >
                    {form.is_active ? "ДА" : "НЕТ"}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-white/10 text-white/50 font-display font-bold py-3 rounded-xl hover:border-white/20 hover:text-white transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-[#FF5C1A] to-[#FF1A8C] text-white font-display font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
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

export default PortfolioTab;
