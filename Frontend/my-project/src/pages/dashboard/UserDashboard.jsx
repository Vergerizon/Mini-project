import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/config';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalIncome: 0,
    totalExpense: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const transactionsRes = await api.get('/transactions').catch(() => ({ data: { data: [] } }));
      const transactions = transactionsRes.data?.data || [];
      
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      
      const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      setStats({
        totalTransactions: transactions.length,
        totalIncome,
        totalExpense,
        recentTransactions: transactions.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-8 text-white">
        <h1 className="text-2xl font-bold">Halo, {user?.name || 'User'}! 👋</h1>
        <p className="mt-2 opacity-90">Selamat datang kembali di DigiWallet</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Saldo Bersih</p>
          <p className={`text-2xl font-bold mt-2 ${
            stats.totalIncome - stats.totalExpense >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            Rp {(stats.totalIncome - stats.totalExpense).toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Total Pemasukan</p>
          <p className="text-2xl font-bold mt-2 text-green-600">
            +Rp {stats.totalIncome.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Total Pengeluaran</p>
          <p className="text-2xl font-bold mt-2 text-red-600">
            -Rp {stats.totalExpense.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link 
          to="/transactions/add"
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="text-3xl">➕</span>
          <span className="text-sm font-medium text-gray-700">Tambah Transaksi</span>
        </Link>
        <Link 
          to="/transactions"
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="text-3xl">💰</span>
          <span className="text-sm font-medium text-gray-700">Riwayat</span>
        </Link>
        <Link 
          to="/products"
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="text-3xl">📦</span>
          <span className="text-sm font-medium text-gray-700">Produk</span>
        </Link>
        <Link 
          to="/categories"
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="text-3xl">📂</span>
          <span className="text-sm font-medium text-gray-700">Kategori</span>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Transaksi Terbaru</h2>
          <Link to="/transactions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Lihat Semua →
          </Link>
        </div>

        {stats.recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">📝</span>
            <p className="text-gray-500">Belum ada transaksi</p>
            <Link 
              to="/transactions/add"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tambah Transaksi Pertama
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {tx.type === 'income' ? '📈' : '📉'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{tx.description || 'Transaksi'}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.date || tx.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
                <p className={`font-semibold ${
                  tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tx.type === 'income' ? '+' : '-'}Rp {(tx.amount || 0).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
