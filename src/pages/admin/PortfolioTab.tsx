// src/pages/admin/PortfolioTab.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { PortfolioItem } from '../../types';

interface PortfolioTabProps {
  isLoggedIn: boolean;
}

export default function PortfolioTab({ isLoggedIn }: PortfolioTabProps) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Форма добавления/редактирования
  const [editingId, setEditingId] = useState<string | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchPortfolio();
    }
  }, [isLoggedIn]);

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      alert('Ошибка загрузки портфолио');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return alert('Требуется авторизация');
    if (!imageFile && !editingId) return alert('Выберите изображение');

    setUploading(true);
    try {
      let imageUrl = editingId && !imageFile 
        ? items.find(i => i.id === editingId)?.image_url 
        : '';

      // Загрузка файла в Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // Получаем публичный URL
        const { data: urlData } = supabase.storage
          .from('portfolio')
          .getPublicUrl(fileName);
        
        imageUrl = urlData.publicUrl;
      }

      if (editingId) {
        // Обновление
        const { error } = await supabase
          .from('portfolio')
          .update({ year, title, description, image_url: imageUrl })
          .eq('id', editingId);
        
        if (error) throw error;
        alert('Портфолио обновлено!');
      } else {
        // Создание
        const { error } = await supabase
          .from('portfolio')
          .insert([{ year, title, description, image_url: imageUrl }]);
        
        if (error) throw error;
        alert('Портфолио добавлено!');
      }

      // Сброс формы
      resetForm();
      fetchPortfolio();
    } catch (error: any) {
      console.error('Error saving portfolio:', error);
      alert(`Ошибка: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setYear(item.year);
    setTitle(item.title || '');
    setDescription(item.description || '');
    setPreviewUrl(item.image_url);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту работу?')) return;

    try {
      // Удаляем файл из хранилища
      const imagePath = imageUrl.split('/').pop();
      if (imagePath) {
        await supabase.storage.from('portfolio').remove([imagePath]);
      }

      // Удаляем запись из БД
      const { error } = await supabase.from('portfolio').delete().eq('id', id);
      if (error) throw error;

      alert('Удалено!');
      fetchPortfolio();
    } catch (error: any) {
      alert(`Ошибка удаления: ${error.message}`);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setYear(new Date().getFullYear());
    setTitle('');
    setDescription('');
    setImageFile(null);
    setPreviewUrl(null);
  };

  if (!isLoggedIn) {
    return <div className="p-4 text-center text-gray-500">Войдите для управления портфолио</div>;
  }

  if (loading) return <div className="p-4">Загрузка...</div>;

  return (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-bold">Портфолио</h2>

      {/* Форма */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-xl font-semibold">{editingId ? 'Редактировать' : 'Добавить работу'}</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Год</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Название (опционально)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Например: Интерьер квартиры"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Описание (появляется при наведении)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={3}
            placeholder="Краткое описание проекта..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Изображение</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
            required={!editingId}
          />
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="mt-2 h-32 w-auto object-cover rounded" />
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Загрузка...' : editingId ? 'Сохранить изменения' : 'Добавить'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      {/* Список работ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden group relative">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <img
                src={item.image_url}
                alt={item.title || `Работа ${item.year}`}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-500">{item.year}</span>
                {item.title && <h4 className="font-semibold">{item.title}</h4>}
              </div>
              {item.description && (
                <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
              )}
            </div>
            
            {/* Кнопки управления (видны только админу) */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(item)}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 shadow"
                title="Редактировать"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(item.id, item.image_url)}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow"
                title="Удалить"
              >
                🗑️
              </button>
            </div>
            
            {/* Оверлей с описанием при наведении (как на сайте) */}
            {item.description && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-center">{item.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}