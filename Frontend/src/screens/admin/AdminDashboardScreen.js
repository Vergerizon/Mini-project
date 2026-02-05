import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/config';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const [usersRes, productsRes, categoriesRes, transactionsRes, reportsRes] = await Promise.all([
        api.get('/api/users').catch(() => ({ data: [] })),
        api.get('/api/products').catch(() => ({ data: [] })),
        api.get('/api/categories').catch(() => ({ data: [] })),
        api.get('/api/transactions').catch(() => ({ data: [] })),
        api.get('/api/reports').catch(() => ({ data: {} })),
      ]);

      setStats({
        users: usersRes.data?.data?.length || usersRes.data?.length || 0,
        products: productsRes.data?.data?.length || productsRes.data?.length || 0,
        categories: categoriesRes.data?.data?.length || categoriesRes.data?.length || 0,
        transactions: transactionsRes.data?.data?.length || transactionsRes.data?.length || 0,
        report: reportsRes.data?.data || reportsRes.data || {},
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  const QuickAction = ({ title, subtitle, onPress, color = '#1a73e8' }) => (
    <TouchableOpacity style={[styles.quickAction, { borderLeftColor: color }]} onPress={onPress}>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Selamat Datang,</Text>
        <Text style={styles.userName}>{user?.name || 'Admin'}</Text>
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>ADMINISTRATOR</Text>
        </View>
      </View>

      {/* Financial Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ringkasan Keuangan</Text>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Saldo</Text>
          <Text style={styles.balanceAmount}>
            {formatPrice(stats?.report?.balance || stats?.report?.total_balance)}
          </Text>
        </View>
        <View style={styles.row}>
          <View style={[styles.miniCard, styles.incomeCard]}>
            <Text style={styles.miniCardLabel}>Pemasukan</Text>
            <Text style={styles.incomeText}>
              {formatPrice(stats?.report?.total_income || stats?.report?.income)}
            </Text>
          </View>
          <View style={[styles.miniCard, styles.expenseCard]}>
            <Text style={styles.miniCardLabel}>Pengeluaran</Text>
            <Text style={styles.expenseText}>
              {formatPrice(stats?.report?.total_expense || stats?.report?.expense)}
            </Text>
          </View>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistik Sistem</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.users || 0}</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.products || 0}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.categories || 0}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.transactions || 0}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        <QuickAction
          title="Kelola User"
          subtitle="Lihat, edit, atau hapus pengguna"
          onPress={() => navigation.navigate('Users')}
          color="#9c27b0"
        />
        <QuickAction
          title="Tambah Produk"
          subtitle="Tambahkan produk baru ke katalog"
          onPress={() => navigation.navigate('Products', { screen: 'AddProduct' })}
          color="#4caf50"
        />
        <QuickAction
          title="Tambah Kategori"
          subtitle="Buat kategori baru"
          onPress={() => navigation.navigate('Categories', { screen: 'AddCategory' })}
          color="#ff9800"
        />
        <QuickAction
          title="Lihat Laporan"
          subtitle="Lihat laporan keuangan lengkap"
          onPress={() => navigation.navigate('Reports')}
          color="#2196f3"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#1a237e',
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  greeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  adminBadge: {
    backgroundColor: '#ff5722',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  adminBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  balanceCard: {
    backgroundColor: '#1a73e8',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  miniCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
  },
  incomeCard: {
    backgroundColor: '#e8f5e9',
  },
  expenseCard: {
    backgroundColor: '#ffebee',
  },
  miniCardLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  incomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  expenseText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c62828',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  quickAction: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
