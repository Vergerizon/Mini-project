import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import api from '../../api/config';

export default function AddUserScreen({ route, navigation }) {
  const existingUser = route.params?.user;
  const isEditing = !!existingUser;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingUser) {
      setName(existingUser.name || '');
      setEmail(existingUser.email || '');
      setRole(existingUser.role || 'user');
    }
  }, [existingUser]);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Nama dan email wajib diisi');
      return;
    }

    if (!isEditing && !password.trim()) {
      Alert.alert('Error', 'Password wajib diisi untuk user baru');
      return;
    }

    if (!isEditing && password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    try {
      const data = { name, email, role };
      if (password) {
        data.password = password;
      }

      if (isEditing) {
        await api.put(`/api/users/${existingUser.id}`, data);
        Alert.alert('Sukses', 'User berhasil diupdate');
      } else {
        await api.post('/api/users', data);
        Alert.alert('Sukses', 'User berhasil dibuat');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Operasi gagal');
    } finally {
      setLoading(false);
    }
  };

  const RoleButton = ({ label, value }) => (
    <TouchableOpacity
      style={[
        styles.roleButton,
        role === value && (value === 'admin' ? styles.roleAdmin : styles.roleUser),
      ]}
      onPress={() => setRole(value)}
    >
      <Text
        style={[
          styles.roleButtonText,
          role === value && styles.roleButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.label}>Nama Lengkap *</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>
            Password {isEditing ? '(kosongkan jika tidak ingin mengubah)' : '*'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={isEditing ? 'Biarkan kosong untuk password lama' : 'Masukkan password'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Role *</Text>
          <View style={styles.roleContainer}>
            <RoleButton label="User" value="user" />
            <RoleButton label="Admin" value="admin" />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isEditing ? 'Update User' : 'Buat User'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  roleUser: {
    borderColor: '#1a73e8',
    backgroundColor: '#e3f2fd',
  },
  roleAdmin: {
    borderColor: '#ff5722',
    backgroundColor: '#fff3e0',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  roleButtonTextActive: {
    color: '#333',
  },
  button: {
    backgroundColor: '#9c27b0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
