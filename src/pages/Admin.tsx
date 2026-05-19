import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import Toast from "./admin/Toast";
import PartnersTab from "./admin/PartnersTab";
import ServicesTab from "./admin/ServicesTab";
import ContactsTab from "./admin/ContactsTab";
import PortfolioTab from "./admin/PortfolioTab";
import AdminLogin from "./admin/AdminLogin";

export default function Admin() {
  const [tab, setTab] = useState<"partners" | "services" | "contacts" | "portfolio">("portfolio");
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-body">
      <Toast toast={toast} />

      {/* Header */}
      <div className="border-b border-white/5 bg-[#10101A]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-white/40 hover:text-white transition-colors">
              <Icon name="ArrowLeft" size={20} />
            </a>
            <div>
              <div className="font-display font-black text-lg">
                <span className="text-gradient-orange">ARTSTAGE</span>
                <span className="text-white/50">.PRO</span>
              </div>
              <div className="text-white/30 text-xs font-body">Панель администратора</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#16162A] rounded-xl p-1 gap-1">
            <button
              onClick={() => setTab("portfolio")}
              className={`px-3 md:px-4 py-2 rounded-lg text-sm font-display font-bold transition-all ${tab === "portfolio" ? "bg-[#FF5C1A] text-white" : "text-white/40 hover:text-white"}`}
            >
              Портфолио
            </button>
            <button
              onClick={() => setTab("services")}
              className={`px-3 md:px-4 py-2 rounded-lg text-sm font-display font-bold transition-all ${tab === "services" ? "bg-[#FF5C1A] text-white" : "text-white/40 hover:text-white"}`}
            >
              Услуги
            </button>
            <button
              onClick={() => setTab("partners")}
              className={`px-3 md:px-4 py-2 rounded-lg text-sm font-display font-bold transition-all ${tab === "partners" ? "bg-[#FF5C1A] text-white" : "text-white/40 hover:text-white"}`}
            >
              Партнёры
            </button>
            <button
              onClick={() => setTab("contacts")}
              className={`px-3 md:px-4 py-2 rounded-lg text-sm font-display font-bold transition-all ${tab === "contacts" ? "bg-[#FF5C1A] text-white" : "text-white/40 hover:text-white"}`}
            >
              Контакты
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {tab === "portfolio" && <PortfolioTab showToast={showToast} />}
        {tab === "services" && <ServicesTab showToast={showToast} />}
        {tab === "partners" && <PartnersTab showToast={showToast} />}
        {tab === "contacts" && <ContactsTab showToast={showToast} />}
      </div>
    </div>
  );
}
