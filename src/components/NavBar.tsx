cat > src/components/Header.tsx << 'EOF'
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { id: "services", label: "Услуги" },
    { id: "portfolio", label: "Портфолио" },
    { id: "about", label: "О нас" },
    { id: "partners", label: "Партнёры" },
    { id: "contacts", label: "Контакты" },
  ];

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0A0A0F]/95 backdrop-blur-md border-b border-white/5" : ""}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div 
          className="font-display font-black text-xl tracking-tight cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-gradient-orange">ARTSTAGE</span>
          <span className="text-white/50">.PRO</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => handleNavClick(l.id)}
              className="font-body text-sm text-white/60 hover:text-white transition-colors duration-200"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("contacts")}
            className="bg-gradient-to-r from-[#FF5C1A] to-[#FF1A8C] text-white font-display font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Обсудить проект
          </button>
        </div>
        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          <Icon name={mobileOpen ? "X" : "Menu"} size={24} />
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-[#10101A]/98 backdrop-blur-md border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => handleNavClick(l.id)}
              className="text-left font-body text-white/70 hover:text-white transition-colors py-2"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
EOF