import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/config';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalTransactions: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, productsRes, categoriesRes, transactionsRes] = await Promise.all([
        api.get('/users').catch(() => ({ data: { data: [] } })),
        api.get('/products').catch(() => ({ data: { data: [] } })),
        api.get('/categories').catch(() => ({ data: { data: [] } })),
        api.get('/transactions').catch(() => ({ data: { data: [] } }))
      ]);

      const transactions = transactionsRes.data?.data || [];
      
      setStats({
        totalUsers: usersRes.data?.data?.length || 0,
        totalProducts: productsRes.data?.data?.length || 0,
        totalCategories: categoriesRes.data?.data?.length || 0,
        totalTransactions: transactions.length,
        recentTransactions: transactions.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, link }) => (
    <Link 
      to={link}
      className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${color} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </Link>
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-gray-500 mt-1">Selamat datang di panel administrasi DigiWallet</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon="👥" 
          color="border-blue-500"
          link="/users"
        />
        <StatCard 
          title="Total Produk" 
          value={stats.totalProducts} 
          icon="📦" 
          color="border-green-500"
          link="/products"
        />
        <StatCard 
          title="Total Kategori" 
          value={stats.totalCategories} 
          icon="📂" 
          color="border-yellow-500"
          link="/categories"
        />
        <StatCard 
          title="Total Transaksi" 
          value={stats.totalTransactions} 
          icon="💰" 
          color="border-purple-500"
          link="/transactions"
        />
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
          <p className="text-gray-500 text-center py-8">Belum ada transaksi</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Tanggal</th>
                  <th className="pb-3 font-medium">Tipe</th>
                  <th className="pb-3 font-medium text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="text-sm">
                    <td className="py-3 text-gray-600">#{tx.id}</td>
                    <td className="py-3 text-gray-600">
                      {new Date(tx.date || tx.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.type === 'income' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                      </span>
                    </td>
                    <td className={`py-3 text-right font-medium ${
                      tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}Rp {(tx.amount || 0).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          to="/transactions/add"
          className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <span className="text-2xl">➕</span>
          <div>
            <p className="font-medium text-blue-800">Tambah Transaksi</p>
            <p className="text-sm text-blue-600">Catat transaksi baru</p>
          </div>
        </Link>
        <Link 
          to="/products/add"
          className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
        >
          <span className="text-2xl">📦</span>
          <div>
            <p className="font-medium text-green-800">Tambah Produk</p>
            <p className="text-sm text-green-600">Daftarkan produk baru</p>
          </div>
        </Link>
        <Link 
          to="/reports"
          className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
        >
          <span className="text-2xl">📊</span>
          <div>
            <p className="font-medium text-purple-800">Lihat Laporan</p>
            <p className="text-sm text-purple-600">Analisis keuangan</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
