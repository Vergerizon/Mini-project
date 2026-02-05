import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/config';

export default function CategoryList() {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data?.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus kategori ini?')) return;
    
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      alert('Gagal menghapus kategori');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kategori</h1>
          <p className="text-gray-500">Kelola kategori produk</p>
        </div>
        {isAdmin() && (
          <Link
            to="/categories/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Tambah Kategori
          </Link>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <span className="text-4xl mb-4 block">📂</span>
          <p className="text-gray-500">Tidak ada kategori</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                    📂
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {category.description || 'Tidak ada deskripsi'}
                    </p>
                  </div>
                </div>
              </div>

              {isAdmin() && (
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Link
                    to={`/categories/${category.id}/edit`}
                    className="flex-1 px-3 py-2 text-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
