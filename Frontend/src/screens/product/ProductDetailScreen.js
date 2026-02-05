import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { isAdmin } = useAuth();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);
  };

  return (
    <ScrollView style={styles.container}>
      {product.image && (
        <Image source={{ uri: product.image }} style={styles.image} />
      )}

      <View style={styles.card}>
        <Text style={styles.label}>Product Name</Text>
        <Text style={styles.value}>{product.name}</Text>

        <Text style={styles.label}>Price</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>

        {product.stock !== undefined && (
          <>
            <Text style={styles.label}>Stock</Text>
            <Text style={styles.value}>{product.stock} units</Text>
          </>
        )}

        {product.description && (
          <>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{product.description}</Text>
          </>
        )}

        {product.category_name && (
          <>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.value}>{product.category_name}</Text>
          </>
        )}

        {product.created_at && (
          <>
            <Text style={styles.label}>Created At</Text>
            <Text style={styles.value}>
              {new Date(product.created_at).toLocaleDateString()}
            </Text>
          </>
        )}
      </View>

      {isAdmin() && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('AddProduct', { product })}
        >
          <Text style={styles.editButtonText}>Edit Product</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
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
  price: {
    fontSize: 20,
    color: '#1a73e8',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#1a73e8',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
