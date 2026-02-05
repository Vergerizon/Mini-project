import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AdminNavigator from './AdminNavigator';
import UserNavigator from './UserNavigator';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function AppNavigator() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  // Determine which navigator to use based on role
  const getMainNavigator = () => {
    if (!isAuthenticated) {
      return <AuthNavigator />;
    }
    
    // Check if user is admin
    if (user?.role === 'admin') {
      return <AdminNavigator />;
    }
    
    // Default to user navigator
    return <UserNavigator />;
  };

  return (
    <NavigationContainer>
      {getMainNavigator()}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
