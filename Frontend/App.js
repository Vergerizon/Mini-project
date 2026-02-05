import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, Button, View, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

// Adjust this for emulator/device:
// - Android emulator: use 10.0.2.2
// - iOS simulator: use localhost
// - Physical device: use your PC's LAN IP (e.g., 192.168.x.x)
const API_URL = 'http://10.0.2.2:3000';

export default function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const pingBackend = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/`);
      setStatus(`OK: ${res.status}`);
    } catch (e) {
      setStatus(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    pingBackend();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Digiwallet Mobile (Demo)</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Backend status:</Text>
        {loading ? <ActivityIndicator /> : <Text style={styles.value}>{status ?? 'No response'}</Text>}
      </View>
      <Button title="Ping Backend" onPress={pingBackend} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    marginRight: 8,
    fontWeight: '500',
  },
  value: {
    color: '#333',
  },
});
