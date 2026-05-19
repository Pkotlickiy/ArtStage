// src/pages/Admin.tsx
import { useState } from 'react';
import PartnersTab from './admin/PartnersTab';
import ServicesTab from './admin/ServicesTab';
import ContactsTab from './admin/ContactsTab';
import PortfolioTab from './admin/PortfolioTab'; // Импортируем новый компонент

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('partners');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login === 'admin' && password === 'admin2026') {
      setIsLoggedIn(true);
    } else {
      alert('Неверный логин или пароль');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Вход в админку</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Логин</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Админ-панель</h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="text-red-600 hover:text-red-800"
          >
            Выйти
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto mt-6">
        <div className="flex border-b border-gray-200 mb-6">
          {['partners', 'services', 'contacts', 'portfolio'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'partners' && 'Партнёры'}
              {tab === 'services' && 'Услуги'}
              {tab === 'contacts' && 'Контакты'}
              {tab === 'portfolio' && 'Портфолио'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'partners' && <PartnersTab isLoggedIn={isLoggedIn} />}
          {activeTab === 'services' && <ServicesTab isLoggedIn={isLoggedIn} />}
          {activeTab === 'contacts' && <ContactsTab isLoggedIn={isLoggedIn} />}
          {activeTab === 'portfolio' && <PortfolioTab isLoggedIn={isLoggedIn} />}
        </div>
      </div>
    </div>
  );
}