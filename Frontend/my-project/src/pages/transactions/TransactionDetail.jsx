import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/config';

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      const response = await api.get(`/transactions/${id}`);
      setTransaction(response.data?.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Transaksi tidak ditemukan');
      navigate('/transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Hapus transaksi ini?')) return;
    
    try {
      await api.delete(`/transactions/${id}`);
      navigate('/transactions');
    } catch (error) {
      alert('Gagal menghapus transaksi');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!transaction) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/transactions" className="text-blue-600 hover:text-blue-700 mb-6 inline-flex items-center gap-2">
        ← Kembali ke Daftar Transaksi
      </Link>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className={`p-6 ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}>
          <p className="text-white text-sm opacity-90">
            {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
          </p>
          <p className="text-white text-3xl font-bold mt-2">
            {transaction.type === 'income' ? '+' : '-'}Rp {(transaction.amount || 0).toLocaleString('id-ID')}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500">ID Transaksi</p>
            <p className="text-gray-800 font-medium">#{transaction.id}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Tanggal</p>
            <p className="text-gray-800 font-medium">
              {new Date(transaction.date || transaction.created_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Deskripsi</p>
            <p className="text-gray-800 font-medium">{transaction.description || '-'}</p>
          </div>

          {transaction.category && (
            <div>
              <p className="text-sm text-gray-500">Kategori</p>
              <p className="text-gray-800 font-medium">{transaction.category.name || transaction.category}</p>
            </div>
          )}

          {transaction.product && (
            <div>
              <p className="text-sm text-gray-500">Produk</p>
              <p className="text-gray-800 font-medium">{transaction.product.name || transaction.product}</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 flex gap-3">
          <Link
            to={`/transactions/${id}/edit`}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Edit Transaksi
          </Link>
          {isAdmin() && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Hapus
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
