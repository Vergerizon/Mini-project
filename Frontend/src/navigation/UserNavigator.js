import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet } from 'react-native';

// User Screens
import UserDashboardScreen from '../screens/user/UserDashboardScreen';

// Shared Screens
import TransactionListScreen from '../screens/transaction/TransactionListScreen';
import TransactionDetailScreen from '../screens/transaction/TransactionDetailScreen';
import AddTransactionScreen from '../screens/transaction/AddTransactionScreen';

import CategoryListScreen from '../screens/category/CategoryListScreen';
import CategoryDetailScreen from '../screens/category/CategoryDetailScreen';

import ProductListScreen from '../screens/product/ProductListScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';

import ProfileScreen from '../screens/user/ProfileScreen';
import EditProfileScreen from '../screens/user/EditProfileScreen';
import ChangePasswordScreen from '../screens/user/ChangePasswordScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Icon
const TabIcon = ({ label, focused, color }) => (
  <View style={styles.iconContainer}>
    <Text style={[styles.iconText, { color }]}>{label.charAt(0)}</Text>
  </View>
);

// Dashboard Stack (User)
function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="DashboardMain" 
        component={UserDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
    </Stack.Navigator>
  );
}

// Transaction Stack (User can add transactions)
function TransactionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TransactionList" 
        component={TransactionListScreen}
        options={{ title: 'Transaksi Saya' }}
      />
      <Stack.Screen 
        name="TransactionDetail" 
        component={TransactionDetailScreen}
        options={{ title: 'Detail Transaksi' }}
      />
      <Stack.Screen 
        name="AddTransaction" 
        component={AddTransactionScreen}
        options={{ title: 'Transaksi Baru' }}
      />
    </Stack.Navigator>
  );
}

// Category Stack (User can only view)
function CategoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CategoryList" 
        component={CategoryListScreen}
        options={{ title: 'Kategori' }}
      />
      <Stack.Screen 
        name="CategoryDetail" 
        component={CategoryDetailScreen}
        options={{ title: 'Detail Kategori' }}
      />
      {/* User tidak bisa add/edit category */}
    </Stack.Navigator>
  );
}

// Product Stack (User can only view)
function ProductStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProductList" 
        component={ProductListScreen}
        options={{ title: 'Produk' }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{ title: 'Detail Produk' }}
      />
      {/* User tidak bisa add/edit product */}
    </Stack.Navigator>
  );
}

// Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ title: 'Profil Saya' }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ title: 'Edit Profil' }}
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen}
        options={{ title: 'Ubah Password' }}
      />
    </Stack.Navigator>
  );
}

export default function UserNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => (
          <TabIcon label={route.name} focused={focused} color={color} />
        ),
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionStack}
        options={{
          tabBarLabel: 'Transaksi',
        }}
      />
      <Tab.Screen 
        name="Products" 
        component={ProductStack}
        options={{
          tabBarLabel: 'Produk',
        }}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoryStack}
        options={{
          tabBarLabel: 'Kategori',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
