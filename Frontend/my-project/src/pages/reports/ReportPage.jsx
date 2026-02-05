import { useState, useEffect } from 'react';
import api from '../../api/config';

export default function ReportPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      let url = '/reports';
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('start_date', dateRange.startDate);
      if (dateRange.endDate) params.append('end_date', dateRange.endDate);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await api.get(url);
      setReport(response.data?.data);
    } catch (error) {
      console.error('Error:', error);
      // Create mock data if API fails
      setReport({
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0,
        transactionCount: 0,
        byCategory: [],
        byMonth: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchReport();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalIncome = report?.totalIncome || report?.total_income || 0;
  const totalExpense = report?.totalExpense || report?.total_expense || 0;
  const netBalance = report?.netBalance || report?.net_balance || (totalIncome - totalExpense);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Laporan Keuangan</h1>
        <p className="text-gray-500">Analisis dan ringkasan keuangan</p>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <form onSubmit={handleFilter} className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Filter
          </button>
          <button
            type="button"
            onClick={() => {
              setDateRange({ startDate: '', endDate: '' });
              setTimeout(fetchReport, 100);
            }}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Reset
          </button>
        </form>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
              📈
            </span>
            <div>
              <p className="text-sm text-gray-500">Total Pemasukan</p>
              <p className="text-2xl font-bold text-green-600">
                Rp {totalIncome.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">
              📉
            </span>
            <div>
              <p className="text-sm text-gray-500">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-red-600">
                Rp {totalExpense.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
              netBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'
            }`}>
              💰
            </span>
            <div>
              <p className="text-sm text-gray-500">Saldo Bersih</p>
              <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                Rp {netBalance.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts/Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Perbandingan</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Pemasukan</span>
                <span className="text-green-600 font-medium">
                  Rp {totalIncome.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4">
                <div 
                  className="bg-green-500 h-4 rounded-full transition-all"
                  style={{ 
                    width: `${totalIncome + totalExpense > 0 
                      ? (totalIncome / (totalIncome + totalExpense)) * 100 
                      : 50}%` 
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Pengeluaran</span>
                <span className="text-red-600 font-medium">
                  Rp {totalExpense.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4">
                <div 
                  className="bg-red-500 h-4 rounded-full transition-all"
                  style={{ 
                    width: `${totalIncome + totalExpense > 0 
                      ? (totalExpense / (totalIncome + totalExpense)) * 100 
                      : 50}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Ringkasan</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Jumlah Transaksi</span>
              <span className="font-medium text-gray-800">
                {report?.transactionCount || report?.transaction_count || 0}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Rata-rata Pemasukan</span>
              <span className="font-medium text-green-600">
                Rp {((report?.transactionCount || 1) > 0 
                  ? Math.round(totalIncome / (report?.incomeCount || 1)) 
                  : 0).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Rata-rata Pengeluaran</span>
              <span className="font-medium text-red-600">
                Rp {((report?.transactionCount || 1) > 0 
                  ? Math.round(totalExpense / (report?.expenseCount || 1)) 
                  : 0).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {(report?.byCategory || []).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h3 className="font-semibold text-gray-800 mb-4">Per Kategori</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium">Kategori</th>
                  <th className="pb-3 font-medium text-right">Pemasukan</th>
                  <th className="pb-3 font-medium text-right">Pengeluaran</th>
                  <th className="pb-3 font-medium text-right">Selisih</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {report.byCategory.map((cat, idx) => (
                  <tr key={idx}>
                    <td className="py-3 text-gray-800">{cat.name || cat.category}</td>
                    <td className="py-3 text-right text-green-600">
                      +Rp {(cat.income || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 text-right text-red-600">
                      -Rp {(cat.expense || 0).toLocaleString('id-ID')}
                    </td>
                    <td className={`py-3 text-right font-medium ${
                      (cat.income - cat.expense) >= 0 ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      Rp {((cat.income || 0) - (cat.expense || 0)).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
