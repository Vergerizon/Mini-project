import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/config';

export default function TransactionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category_id: '',
    product_id: ''
  });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOptions();
    if (isEdit) {
      fetchTransaction();
    }
  }, [id]);

  const fetchOptions = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        api.get('/categories').catch(() => ({ data: { data: [] } })),
        api.get('/products').catch(() => ({ data: { data: [] } }))
      ]);
      setCategories(catRes.data?.data || []);
      setProducts(prodRes.data?.data || []);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const fetchTransaction = async () => {
    try {
      const response = await api.get(`/transactions/${id}`);
      const tx = response.data?.data;
      if (tx) {
        setFormData({
          type: tx.type || 'expense',
          amount: tx.amount || '',
          description: tx.description || '',
          date: tx.date ? tx.date.split('T')[0] : new Date().toISOString().split('T')[0],
          category_id: tx.category_id || '',
          product_id: tx.product_id || ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
      navigate('/transactions');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || formData.amount <= 0) {
      setError('Jumlah harus lebih dari 0');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (isEdit) {
        await api.put(`/transactions/${id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      navigate('/transactions');
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal menyimpan transaksi');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/transactions" className="text-blue-600 hover:text-blue-700 mb-6 inline-flex items-center gap-2">
        ← Kembali
      </Link>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEdit ? 'Edit Transaksi' : 'Tambah Transaksi'}
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipe Transaksi
            </label>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                formData.type === 'income' 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={handleChange}
                  className="hidden"
                />
                <span>📈</span>
                <span className="font-medium">Pemasukan</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                formData.type === 'expense' 
                  ? 'border-red-500 bg-red-50 text-red-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={handleChange}
                  className="hidden"
                />
                <span>📉</span>
                <span className="font-medium">Pengeluaran</span>
              </label>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah (Rp)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-semibold"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Contoh: Pembayaran listrik bulan Januari"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Category */}
          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori (Opsional)
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Product */}
          {products.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Produk (Opsional)
              </label>
              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Produk</option>
                {products.map(prod => (
                  <option key={prod.id} value={prod.id}>{prod.name}</option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Menyimpan...' : (isEdit ? 'Update Transaksi' : 'Simpan Transaksi')}
          </button>
        </form>
      </div>
    </div>
  );
}
