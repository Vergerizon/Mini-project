import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/config';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data?.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Produk tidak ditemukan');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Hapus produk ini?')) return;
    
    try {
      await api.delete(`/products/${id}`);
      navigate('/products');
    } catch (error) {
      alert('Gagal menghapus produk');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/products" className="text-blue-600 hover:text-blue-700 mb-6 inline-flex items-center gap-2">
        ← Kembali ke Daftar Produk
      </Link>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/2">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-64 md:h-full object-cover"
              />
            ) : (
              <div className="w-full h-64 md:h-full bg-gray-100 flex items-center justify-center">
                <span className="text-6xl">📦</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="md:w-1/2 p-6">
            <div className="mb-4">
              {product.category && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {product.category.name || product.category}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
            
            <p className="text-3xl font-bold text-blue-600 mb-4">
              Rp {(product.price || 0).toLocaleString('id-ID')}
            </p>

            {product.stock !== undefined && (
              <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                product.stock > 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis'}
              </p>
            )}

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium text-gray-800 mb-2">Deskripsi</h3>
              <p className="text-gray-600">
                {product.description || 'Tidak ada deskripsi'}
              </p>
            </div>

            {isAdmin() && (
              <div className="flex gap-3 mt-6">
                <Link
                  to={`/products/${id}/edit`}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Edit Produk
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
