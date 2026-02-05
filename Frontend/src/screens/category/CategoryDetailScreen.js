import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function CategoryDetailScreen({ route, navigation }) {
  const { category } = route.params;
  const { isAdmin } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Category Name</Text>
        <Text style={styles.value}>{category.name}</Text>

        {category.description && (
          <>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{category.description}</Text>
          </>
        )}

        {category.created_at && (
          <>
            <Text style={styles.label}>Created At</Text>
            <Text style={styles.value}>
              {new Date(category.created_at).toLocaleDateString()}
            </Text>
          </>
        )}
      </View>

      {isAdmin() && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('AddCategory', { category })}
        >
          <Text style={styles.editButtonText}>Edit Category</Text>
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
