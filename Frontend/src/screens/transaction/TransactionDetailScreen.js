import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function TransactionDetailScreen({ route }) {
  const { transaction } = route.params;

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'income':
      case 'credit':
        return '#2e7d32';
      case 'expense':
      case 'debit':
        return '#c62828';
      default:
        return '#1565c0';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color: getTypeColor(transaction.type) }]}>
            {formatPrice(transaction.amount)}
          </Text>
          <Text style={[styles.type, { color: getTypeColor(transaction.type) }]}>
            {transaction.type?.toUpperCase() || 'TRANSACTION'}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>
          {transaction.description || 'No description'}
        </Text>

        {transaction.category_name && (
          <>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.value}>{transaction.category_name}</Text>
          </>
        )}

        <Text style={styles.label}>Transaction ID</Text>
        <Text style={styles.value}>#{transaction.id}</Text>

        {transaction.created_at && (
          <>
            <Text style={styles.label}>Date & Time</Text>
            <Text style={styles.value}>{formatDate(transaction.created_at)}</Text>
          </>
        )}

        {transaction.user_name && (
          <>
            <Text style={styles.label}>User</Text>
            <Text style={styles.value}>{transaction.user_name}</Text>
          </>
        )}

        {transaction.notes && (
          <>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.value}>{transaction.notes}</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  type: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
});
