import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/config';

export default function TransactionList() {
  const { isAdmin } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data?.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus transaksi ini?')) return;
    
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      alert('Gagal menghapus transaksi');
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

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
          <h1 className="text-2xl font-bold text-gray-800">Transaksi</h1>
          <p className="text-gray-500">Kelola semua transaksi keuangan</p>
        </div>
        <Link
          to="/transactions/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Tambah Transaksi
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { value: 'all', label: 'Semua' },
          { value: 'income', label: 'Pemasukan' },
          { value: 'expense', label: 'Pengeluaran' }
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === tab.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl mb-4 block">📝</span>
            <p className="text-gray-500">Tidak ada transaksi</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium">Deskripsi</th>
                <th className="px-6 py-4 font-medium">Tipe</th>
                <th className="px-6 py-4 font-medium text-right">Jumlah</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">#{tx.id}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(tx.date || tx.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {tx.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      tx.type === 'income'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-semibold ${
                    tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}Rp {(tx.amount || 0).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/transactions/${tx.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Detail"
                      >
                        👁️
                      </Link>
                      <Link
                        to={`/transactions/${tx.id}/edit`}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </Link>
                      {isAdmin() && (
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
