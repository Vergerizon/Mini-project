import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/config';

export default function ProductList() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data?.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus produk ini?')) return;
    
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      alert('Gagal menghapus produk');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-800">Produk</h1>
          <p className="text-gray-500">Kelola daftar produk</p>
        </div>
        {isAdmin() && (
          <Link
            to="/products/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Tambah Produk
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <span className="text-4xl mb-4 block">📦</span>
          <p className="text-gray-500">Tidak ada produk</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {product.description || 'Tidak ada deskripsi'}
                </p>
                <p className="text-blue-600 font-bold text-xl mt-3">
                  Rp {(product.price || 0).toLocaleString('id-ID')}
                </p>
                {product.stock !== undefined && (
                  <p className={`text-sm mt-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Stok: {product.stock}
                  </p>
                )}
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/products/${product.id}`}
                    className="flex-1 px-3 py-2 text-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Detail
                  </Link>
                  {isAdmin() && (
                    <>
                      <Link
                        to={`/products/${product.id}/edit`}
                        className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
